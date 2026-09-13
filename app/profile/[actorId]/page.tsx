'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, Flame, GitMerge, MessageSquare, Trophy } from 'lucide-react';
import { Header } from '@/components/Header';
import { ContributionHeatmap } from '@/components/ContributionHeatmap';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { ContributionDay, ProfileStats, Badge } from '@/lib/types';
import { getActorLabel } from '@/lib/identity';

export default function ProfilePage({ params }: { params: { actorId: string } }) {
  const actorId = params.actorId;
  const [stats,setStats]=useState<ProfileStats>({issueCount:0,patchCount:0,mergeCount:0,totalUpvotes:0});
  const [days,setDays]=useState<ContributionDay[]>([]);
  const [badges,setBadges]=useState<Badge[]>([]);
  const [patches,setPatches]=useState<Array<{id:string;patched_text:string;patch_type:string;upvotes:number;created_at:string}>>([]);
  const [name,setName]=useState(getActorLabel(actorId));

  useEffect(()=>{
    const supabase=getSupabaseClient(); if(!supabase)return;
    Promise.all([
      supabase.rpc('get_profile_stats',{p_actor_id:actorId}),
      supabase.rpc('get_contribution_heatmap',{p_actor_id:actorId,p_since:new Date(Date.now()-365*24*60*60*1000).toISOString()}),
      supabase.from('profiles').select('display_name').eq('actor_id',actorId).maybeSingle(),
      supabase.from('user_badges').select('badge_key,earned_at,badges(key,name,description,icon)').eq('actor_id',actorId).order('earned_at',{ascending:false}),
      supabase.from('patches').select('id,patched_text,patch_type,upvotes,created_at').eq('author_actor_id',actorId).order('created_at',{ascending:false}).limit(30),
    ]).then(([s,h,p,b,ps])=>{
      const row=s.data?.[0];if(row)setStats({issueCount:Number(row.issue_count),patchCount:Number(row.patch_count),mergeCount:Number(row.merge_count),totalUpvotes:Number(row.total_upvotes)});
      setDays((h.data??[]).map(x=>({day:x.day,contributions:Number(x.contributions)})));
      if(p.data?.display_name)setName(p.data.display_name);
      const mapped=(b.data??[]).map((x:any)=>Array.isArray(x.badges)?x.badges[0]:x.badges).filter(Boolean) as Badge[];setBadges(mapped);
      setPatches((ps.data??[]) as typeof patches);
    }).catch(console.error);
  },[actorId]);

  return <main className="min-h-screen"><Header/><div className="mx-auto max-w-5xl px-4 pb-24 pt-10 md:px-6">
    <Link href="/" className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-200"><ArrowLeft size={14}/>Back</Link>
    <section className="rounded-3xl border border-white/8 bg-white/[0.025] p-6 md:p-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-white/10 text-2xl font-black">{name.slice(-4).toUpperCase()}</div><div><h1 className="text-3xl font-black tracking-tight">{name}</h1><p className="mt-1 text-sm text-white/35">Patchsmith profile</p></div></div><div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"><Stat icon={<MessageSquare size={16}/>} label="Issues" value={stats.issueCount}/><Stat icon={<Flame size={16}/>} label="Patches" value={stats.patchCount}/><Stat icon={<GitMerge size={16}/>} label="Merges" value={stats.mergeCount}/><Stat icon={<Trophy size={16}/>} label="Upvotes" value={stats.totalUpvotes}/></div></section>
    <div className="mt-10"><ContributionHeatmap days={days}/></div>
    {badges.length>0&&<section className="mt-10"><h2 className="mb-4 text-lg font-bold">Badges</h2><div className="flex flex-wrap gap-2">{badges.map(b=><div key={b.key} className="rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-3"><div className="text-sm font-semibold">{b.icon} {b.name}</div><div className="mt-1 text-[11px] text-white/30">{b.description}</div></div>)}</div></section>}
    <section className="mt-10"><h2 className="mb-4 text-lg font-bold">Patch history</h2><div className="space-y-3">{patches.map(p=><article key={p.id} className="rounded-2xl border border-white/8 bg-white/[0.02] p-4"><div className="flex items-center justify-between gap-3"><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-200/70">{p.patch_type}</span><span className="text-xs text-white/35">↑ {p.upvotes}</span></div><p className="mt-3 text-sm leading-6 text-zinc-300">{p.patched_text}</p></article>)}{patches.length===0&&<div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-white/30">No patches yet.</div>}</div></section>
  </div></main>;
}

function Stat({icon,label,value}:{icon:React.ReactNode;label:string;value:number}){return <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4"><div className="flex items-center gap-2 text-white/35">{icon}<span className="text-xs">{label}</span></div><div className="mt-2 text-2xl font-black">{value.toLocaleString()}</div></div>}
