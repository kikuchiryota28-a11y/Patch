import type { Issue, PatchItem, PatchStyle } from '@/lib/types';
import { getSupabaseClient } from '@/lib/supabase/client';
import { initialIssues } from '@/lib/mockData';

type IssueRow = { id: string; content: string; category: string; created_at: string };
type PatchRow = { id: string; issue_id: string; patched_text: string; patch_type: string; upvotes: number; created_at: string };
type CreateIssueInput = { title: string; body: string; category?: string };
type CreatePatchInput = { issueId: string; text: string; style: PatchStyle };

const patchStyles: PatchStyle[] = ['Business Formal','Psychopath / Chaos','Poetic / Chunnibyou','Casual','Corporate Passive-Aggressive'];
function isPatchStyle(value: string): value is PatchStyle { return patchStyles.includes(value as PatchStyle); }
function mapPatch(row: PatchRow): PatchItem { return { id: row.id, text: row.patched_text, style: isPatchStyle(row.patch_type) ? row.patch_type : 'Casual', author: 'community', votes: row.upvotes, createdAt: row.created_at }; }
function mapIssue(row: IssueRow, patches: PatchRow[]): Issue {
  const [firstLine, ...rest] = row.content.split('\n');
  return { id: row.id, title: firstLine?.trim() || 'Untitled Issue', body: rest.join('\n').trim() || firstLine?.trim() || '', author: 'community', createdAt: row.created_at, category: row.category, patches: patches.filter((patch) => patch.issue_id === row.id).sort((a,b) => b.upvotes-a.upvotes || Date.parse(b.created_at)-Date.parse(a.created_at)).map(mapPatch) };
}
export function hasDatabaseConfig() { return getSupabaseClient() !== null; }
export async function fetchIssues(): Promise<Issue[]> {
  const supabase = getSupabaseClient(); if (!supabase) return initialIssues;
  const [{ data: issueRows, error: issueError }, { data: patchRows, error: patchError }] = await Promise.all([
    supabase.from('issues').select('id, content, category, created_at').order('created_at', { ascending: false }),
    supabase.from('patches').select('id, issue_id, patched_text, patch_type, upvotes, created_at').order('upvotes', { ascending: false }).order('created_at', { ascending: false }),
  ]);
  if (issueError) throw issueError; if (patchError) throw patchError;
  return (issueRows as IssueRow[]).map((row) => mapIssue(row, (patchRows ?? []) as PatchRow[]));
}
export async function createIssue(input: CreateIssueInput): Promise<Issue> {
  const supabase = getSupabaseClient();
  if (!supabase) return { id: `issue-${crypto.randomUUID()}`, title: input.title.trim(), body: input.body.trim(), author: 'you', createdAt: new Date().toISOString(), category: input.category ?? 'General', patches: [] };
  const { data, error } = await supabase.from('issues').insert({ content: `${input.title.trim()}\n${input.body.trim()}`, category: input.category?.trim() || 'General' }).select('id, content, category, created_at').single();
  if (error) throw error; return mapIssue(data as IssueRow, []);
}
export async function createPatch(input: CreatePatchInput): Promise<PatchItem> {
  const supabase = getSupabaseClient();
  if (!supabase) return { id: `patch-${crypto.randomUUID()}`, text: input.text.trim(), style: input.style, author: 'you', votes: 0, createdAt: new Date().toISOString() };
  const { data, error } = await supabase.from('patches').insert({ issue_id: input.issueId, patched_text: input.text.trim(), patch_type: input.style, upvotes: 0 }).select('id, issue_id, patched_text, patch_type, upvotes, created_at').single();
  if (error) throw error; return mapPatch(data as PatchRow);
}
export async function upvotePatch(patchId: string): Promise<PatchItem> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase is not configured. Local voting is handled in the UI state.');
  const { data, error } = await supabase.rpc('increment_patch_upvotes', { p_patch_id: patchId });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) throw new Error('Patch was not found.');
  return mapPatch(row as PatchRow);
}
