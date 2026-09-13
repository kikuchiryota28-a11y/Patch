'use client';

import Link from 'next/link';
import { Plus, Sparkles, Trophy, UserCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { IssueModal } from './IssueModal';
import { NotificationCenter } from './NotificationCenter';
import { getActorId } from '@/lib/identity';

export function Header(){
 const[open,setOpen]=useState(false);const[actorId,setActorId]=useState('');useEffect(()=>setActorId(getActorId()),[]);
 return <><header className="sticky top-0 z-30 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl"><div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 md:px-6"><Link href="/" className="group flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-xl bg-white text-zinc-950 shadow-lg shadow-black/20 transition-transform group-hover:rotate-6"><Sparkles size={16} strokeWidth={2.6}/></div><div><div className="text-sm font-black tracking-tight">Patch!</div><div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">rewrite reality</div></div></Link><div className="flex items-center gap-2"><Link href="/ranking" className="hidden items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-zinc-400 transition hover:bg-white/[0.07] hover:text-zinc-100 md:inline-flex"><Trophy size={14}/>Hall of Fame</Link>{actorId&&<Link href={`/profile/${actorId}`} aria-label="Profile" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] text-zinc-400 transition hover:bg-white/[0.07] hover:text-zinc-100"><UserCircle size={17}/></Link>}<NotificationCenter/><button onClick={()=>setOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 active:scale-[0.98]"><Plus size={16}/>Post Issue</button></div></div></header><IssueModal open={open} onClose={()=>setOpen(false)}/></>;
}
