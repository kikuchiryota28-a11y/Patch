'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseClient } from '@/lib/supabase/client';

export async function createPatchAction(input: { issueId:string; text:string; style:string; actorId:string; parentPatchId?:string|null }) {
  const supabase=getSupabaseClient();
  if(!supabase) throw new Error('Supabase is not configured.');
  const {data,error}=await supabase.rpc('create_patch',{p_issue_id:input.issueId,p_patched_text:input.text,p_patch_type:input.style,p_actor_id:input.actorId,p_parent_patch_id:input.parentPatchId??null,p_is_ai_generated:false});
  if(error) throw new Error(error.message);
  revalidatePath(`/issues/${input.issueId}`);
  return Array.isArray(data)?data[0]:data;
}

export async function upvotePatchAction(patchId:string,actorId:string){
  const supabase=getSupabaseClient();
  if(!supabase) throw new Error('Supabase is not configured.');
  const {data,error}=await supabase.rpc('increment_patch_upvotes',{p_patch_id:patchId,p_actor_id:actorId});
  if(error) throw new Error(error.message);
  return Array.isArray(data)?data[0]:data;
}

export async function mergePatchAction(issueId:string,patchId:string,actorId:string){
  const supabase=getSupabaseClient();
  if(!supabase) throw new Error('Supabase is not configured.');
  const {data,error}=await supabase.rpc('merge_patch',{p_issue_id:issueId,p_patch_id:patchId,p_actor_id:actorId});
  if(error) throw new Error(error.message);
  revalidatePath(`/issues/${issueId}`);
  return Array.isArray(data)?data[0]:data;
}
