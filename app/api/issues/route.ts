import { NextResponse } from 'next/server';
import { generateAutoPatches } from '@/lib/aiPatches';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { Issue, PatchItem } from '@/lib/types';

export const runtime = 'nodejs';

function buildLocalIssue(title: string, body: string, category: string, generated: Awaited<ReturnType<typeof generateAutoPatches>>): Issue {
  const now = new Date().toISOString();
  const issueId = `issue-${crypto.randomUUID()}`;
  return {
    id: issueId,
    title,
    body,
    author: 'you',
    createdAt: now,
    category,
    patches: generated.map((patch) => ({
      id: `patch-${crypto.randomUUID()}`,
      text: patch.text,
      style: patch.style,
      author: 'Patch! AI',
      votes: 0,
      createdAt: now,
      isAiGenerated: true,
    } satisfies PatchItem)),
  };
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      title?: unknown;
      body?: unknown;
      category?: unknown;
    };

    const title = typeof payload.title === 'string' ? payload.title.trim() : '';
    const body = typeof payload.body === 'string' ? payload.body.trim() : '';
    const category = typeof payload.category === 'string' && payload.category.trim() ? payload.category.trim() : 'General';

    if (!title || !body) {
      return NextResponse.json({ error: 'Title and body are required.' }, { status: 400 });
    }
    if (title.length > 120 || body.length > 600) {
      return NextResponse.json({ error: 'Issue is too long.' }, { status: 400 });
    }

    const generated = await generateAutoPatches(title, body);
    const supabase = getSupabaseClient();

    if (!supabase) {
      return NextResponse.json({ issue: buildLocalIssue(title, body, category, generated), source: 'local' }, { status: 201 });
    }

    const { data: issueRow, error: issueError } = await supabase
      .from('issues')
      .insert({
        content: `${title}\n${body}`,
        category,
      })
      .select('id, content, category, created_at')
      .single();

    if (issueError) throw issueError;

    const patchRows = generated.map((patch) => ({
      issue_id: issueRow.id,
      patched_text: patch.text,
      patch_type: patch.style,
      upvotes: 0,
      is_ai_generated: true,
    }));

    const { data: insertedPatches, error: patchError } = await supabase
      .from('patches')
      .insert(patchRows)
      .select('id, issue_id, patched_text, patch_type, upvotes, created_at, is_ai_generated');

    if (patchError) {
      await supabase.from('issues').delete().eq('id', issueRow.id);
      throw patchError;
    }

    const issue: Issue = {
      id: issueRow.id,
      title,
      body,
      author: 'you',
      createdAt: issueRow.created_at,
      category: issueRow.category,
      patches: (insertedPatches ?? [])
        .map((patch) => ({
          id: patch.id,
          text: patch.patched_text,
          style: patch.patch_type as Issue['patches'][number]['style'],
          author: 'Patch! AI',
          votes: patch.upvotes,
          createdAt: patch.created_at,
          isAiGenerated: Boolean(patch.is_ai_generated),
        }))
        .sort((a, b) => b.votes - a.votes),
    };

    return NextResponse.json({ issue, source: 'supabase', aiModel: process.env.OPENAI_API_KEY ? (process.env.OPENAI_MODEL || 'gpt-5.6-luna') : 'fallback' }, { status: 201 });
  } catch (error) {
    console.error('Issue creation failed:', error);
    return NextResponse.json({ error: 'Could not create the Issue.' }, { status: 500 });
  }
}
