'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

async function requireActorId() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error) throw new Error('Authentication required.');
  const actorId = data?.claims?.sub;
  if (!actorId) throw new Error('Authentication required.');
  return { supabase, actorId };
}

export async function createPatchAction(input: { issueId: string; text: string; style: string; actorId?: string; parentPatchId?: string | null }) {
  const { supabase, actorId } = await requireActorId();
  const { data, error } = await supabase.rpc('create_patch', {
    p_issue_id: input.issueId,
    p_patched_text: input.text,
    p_patch_type: input.style,
    p_actor_id: actorId,
    p_parent_patch_id: input.parentPatchId ?? null,
    p_is_ai_generated: false,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/issues/${input.issueId}`);
  return Array.isArray(data) ? data[0] : data;
}

export async function upvotePatchAction(patchId: string, _actorId?: string) {
  const { supabase, actorId } = await requireActorId();
  const { data, error } = await supabase.rpc('increment_patch_upvotes', {
    p_patch_id: patchId,
    p_actor_id: actorId,
  });
  if (error) throw new Error(error.message);
  return Array.isArray(data) ? data[0] : data;
}

export async function mergePatchAction(issueId: string, patchId: string, _actorId?: string) {
  const { supabase, actorId } = await requireActorId();
  const { data, error } = await supabase.rpc('merge_patch', {
    p_issue_id: issueId,
    p_patch_id: patchId,
    p_actor_id: actorId,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/issues/${issueId}`);
  return Array.isArray(data) ? data[0] : data;
}
