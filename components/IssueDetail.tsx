'use client';

import Link from 'next/link';
import { ArrowLeft, Copy, MessageSquarePlus, Share2, Sparkles, Trophy } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import { PatchModal } from '@/components/PatchModal';
import { PatchTree } from '@/components/PatchTree';
import { useIssues } from '@/context/IssueContext';
import { getActorId } from '@/lib/identity';
import type { PatchItem } from '@/lib/types';

function clip(value:string,max:number){const clean=value.replace(/\s+/g,' ').trim();return clean.length>max?`${clean.slice(0,max-1)}…`:clean;}
function buildShareText(before:string,after:string,url:string){return `Patch!\n\nBefore: ${clip(before,72)}\nAfter: ${clip(after,100)}\n\nPatch this yourself → ${url}`;}

export function IssueDetail({id}:{id:string}){
 const{getIssue,upvotePatch,mergePatch,dbEnabled}=useIssues();const issue=getIssue(id);const[open,setOpen]=useState(false);const[shareLabel,setShareLabel]=useState('Share to X');const[actorId,setActorId]=useState('');const[parentPatch,setParentPatch]=useState<PatchItem|null>(null);
 useEffect(()=>{setActorId(getActorId());},[]);
 const bestPatch=useMemo(()=>issue?.patches.reduce((best,patch)=>(!best||patch.votes>best.votes?patch:best),issue.patches[0]),[issue]);
 if(!issue)return <main className="min-h-screen"><Header/><div className="mx-auto max-w-3xl px-4 py-20 text-center"><h1 className="text-2xl font-bold">Issue not found</h1><Link href="/" className="mt-6 inline-block text-sm font-semibold text-indigo-300">Back home →</Link></div></main>;
 const currentIssue=issue;
 function shareToX(){if(!bestPatch){setShareLabel('Add a Patch first');window.setTimeout(()=>setShareLabel('Share to X'),1800);return;}const text=buildShareText(currentIssue.body,bestPatch.text,window.location.href);window.open(`https://x.com/intent/post?text=${encodeURIComponent(text)}`,'_blank','noopener,noreferrer,width=720,height=640');setShareLabel('Opening X…');window.setTimeout(()=>setShareLabel('Share to X'),1600);}
 async function copyShareText(){if(!bestPatch)return;await navigator.clipboard.writeText(buildShareText(currentIssue.body,bestPatch.text,window.location.href));setShareLabel('Copied');window.setTimeout(()=>setShareLabel('Share to X'),1600);}
 function openPatch(parent:PatchItem|null){setParentPatch(parent);setOpen(true);}
 return <main className="min-h-screen"><Header/><div className="mx-auto max-w-4xl px-4 pb-24 pt-8 md:px-6 md:pt-12">
  <Link href="/" className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-200"><ArrowLeft size={14}/>Back to timeline</Link>
  <section className="rounded-3xl border border-white/8 bg-white/[0.025] p-6 shadow-glow md:p-8"><div className="mb-4 flex flex-wrap gap-2 text-xs text-zinc-500"><span className="rounded-full border border-white/8 px-2.5 py-1">@{currentIssue.author}</span><span>•</span><span>{currentIssue.createdAt}</span><span className="rounded-full border border-white/8 px-2.5 py-1">{currentIssue.category}</span>{currentIssue.mergedPatchId&&<span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/15 bg-emerald-300/[0.08] px-2.5 py-1 font-semibold text-emerald-200"><Trophy size={12}/>Official merged</span>}</div><h1 className="max-w-3xl text-3xl font-black tracking-[-0.03em] md:text-5xl">{currentIssue.title}</h1><p className="mt-5 max-w-3xl whitespace-pre-line text-sm leading-7 text-zinc-400 md:text-base">{currentIssue.body}</p><div className="mt-7 flex flex-wrap items-center gap-3"><button onClick={()=>openPatch(null)} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-zinc-950 transition hover:bg-zinc-200"><MessageSquarePlus size={16}/>Submit a Patch</button><button onClick={shareToX} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-zinc-100 transition hover:bg-white/[0.08]"><Share2 size={16}/>{shareLabel}</button><button onClick={copyShareText} disabled={!bestPatch} aria-label="Copy share text" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-semibold text-zinc-400 transition hover:bg-white/[0.08] hover:text-zinc-100 disabled:opacity-40"><Copy size={14}/>Copy</button><div className="inline-flex items-center gap-2 rounded-full border border-white/8 px-4 py-2.5 text-xs font-semibold text-zinc-400"><Sparkles size={14}/>{currentIssue.patches.length} Patches</div></div></section>
  {currentIssue.patches.length?<PatchTree patches={currentIssue.patches} onReply={openPatch} onUpvote={patch=>upvotePatch(currentIssue.id,patch.id)} canMerge={Boolean(actorId)&&currentIssue.ownerActorId===actorId} onMerge={patch=>mergePatch(currentIssue.id,patch.id)}/>:<div className="mt-10 rounded-3xl border border-dashed border-white/10 p-10 text-center text-sm text-zinc-500">No patches yet. Be the first.</div>}
 </div><PatchModal issueId={currentIssue.id} open={open} parentPatch={parentPatch} onClose={()=>{setOpen(false);setParentPatch(null);}}/></main>;
}
