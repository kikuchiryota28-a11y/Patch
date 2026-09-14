'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {Edit3,LogIn,UserCircle} from 'lucide-react';
import {useAuth} from '@/context/AuthContext';
import {getActorId} from '@/lib/identity';
import {getSupabaseClient} from '@/lib/supabase/client';
import {useLanguage} from '@/context/LanguageContext';

export default function ProfilePage(){
 const{user,profile,openAuth}=useAuth();
 const{dictionary}=useLanguage();
 const d=dictionary.profile;
 const[stats,setStats]=useState({issues:0,patches:0,upvotes:0});
 useEffect(()=>{const actor=user?.id??getActorId();const s=getSupabaseClient();if(!s||!actor)return;void s.rpc('get_profile_stats',{p_actor_id:actor}).then(({data})=>{const row=data?.[0];if(row)setStats({issues:Number(row.issue_count??0),patches:Number(row.patch_count??0),upvotes:Number(row.total_upvotes??0)})})},[user]);
 if(!user)return <main className="min-h-screen grid place-items-center px-6"><section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.025] p-8 text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/10"><UserCircle size={32} className="text-zinc-500"/></div><h1 className="mt-5 text-2xl font-black">Profile</h1><p className="mt-2 text-sm leading-6 text-zinc-500">{dictionary.settings.signInPrompt}</p><button type="button" onClick={openAuth} className="mt-6 rounded-2xl bg-white px-5 py-3 text-sm font-black text-zinc-950"><LogIn size={16} className="mr-2 inline"/>{dictionary.auth.signIn}</button></section></main>;
 const name=profile?.displayName||d.issues;const username=profile?.username||'';const avatar=profile?.avatarUrl||'';
 return <main className="min-h-screen"><div className="mx-auto max-w-3xl px-4 pb-24 pt-8 md:px-8 md:pt-14"><section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 md:p-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-full bg-white/10 text-3xl font-black">{avatar?<img src={avatar} alt="" className="h-full w-full object-cover"/>:<UserCircle size={42} className="text-zinc-600"/>}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-3"><h1 className="text-3xl font-black">{name}</h1><Link href="/settings" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-black text-zinc-300 hover:bg-white/[0.05]"><Edit3 size={14}/>{d.edit}</Link></div>{username&&<p className="mt-1 text-sm text-zinc-500">@{username}</p>}{profile?.bio&&<p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">{profile.bio}</p>}<p className="mt-3 text-xs text-zinc-600">{user.email}</p></div></div><div className="mt-8 grid grid-cols-3 gap-3"><Stat label={d.issues} value={stats.issues}/><Stat label={d.patches} value={stats.patches}/><Stat label={d.upvotes} value={stats.upvotes}/></div></section><div className="mt-5 flex flex-wrap gap-3"><Link href={`/profile/${user.id}`} className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-zinc-300 hover:bg-white/[0.04]">{d.contributions}</Link><Link href="/settings" className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-zinc-950">{d.edit}</Link></div></div></main>;
}
function Stat({label,value}:{label:string;value:number}){return <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"><div className="text-xs font-bold text-zinc-600">{label}</div><div className="mt-2 text-2xl font-black">{value.toLocaleString()}</div></div>}
