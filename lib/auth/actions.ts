'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

function cleanUsername(value: string) {
  return value.trim().replace(/^@/, '').toLowerCase();
}

export async function completeProfile(input: { username: string; displayName: string; avatarUrl: string; language: 'EN' | 'JA' }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) throw new Error('Authentication required.');
  const username = cleanUsername(input.username);
  if (!/^[a-z0-9_]{3,24}$/.test(username)) throw new Error('Username must be 3–24 characters using letters, numbers, or _.');
  if (!input.displayName.trim() || input.displayName.trim().length > 50) throw new Error('Display name is required.');
  if (!input.avatarUrl.trim()) throw new Error('Avatar is required.');
  const { error } = await supabase.from('profiles').upsert({ actor_id: userId, username, display_name: input.displayName.trim(), avatar_url: input.avatarUrl.trim(), language: input.language, updated_at: new Date().toISOString() });
  if (error) throw error;
  revalidatePath('/');
  revalidatePath(`/profile/${userId}`);
  return { ok: true, username };
}

export async function toggleBookmark(patchId: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const actorId = data?.claims?.sub;
  if (!actorId) throw new Error('Authentication required.');
  const { data: existing } = await supabase.from('patch_bookmarks').select('patch_id').eq('actor_id', actorId).eq('patch_id', patchId).maybeSingle();
  if (existing) {
    const { error } = await supabase.from('patch_bookmarks').delete().eq('actor_id', actorId).eq('patch_id', patchId);
    if (error) throw error;
    return { bookmarked: false };
  }
  const { error } = await supabase.from('patch_bookmarks').insert({ actor_id: actorId, patch_id: patchId });
  if (error) throw error;
  return { bookmarked: true };
}

export async function reportContent(input: { targetType: 'issue' | 'patch'; targetId: string; reason: string; details?: string }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const actorId = data?.claims?.sub;
  if (!actorId) throw new Error('Authentication required.');
  const allowed = ['spam', 'harassment', 'sexual', 'privacy', 'safety', 'other'];
  if (!allowed.includes(input.reason)) throw new Error('Invalid report reason.');
  const { error } = await supabase.from('content_reports').insert({ reporter_actor_id: actorId, target_type: input.targetType, target_id: input.targetId, reason: input.reason, details: (input.details ?? '').slice(0, 500) });
  if (error && error.code !== '23505') throw error;
  return { reported: true };
}

export async function getBookmarkedPatchIds() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const actorId = data?.claims?.sub;
  if (!actorId) return [];
  const { data: rows, error } = await supabase.from('patch_bookmarks').select('patch_id').eq('actor_id', actorId);
  if (error) throw error;
  return (rows ?? []).map(row => row.patch_id);
}
