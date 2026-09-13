'use client';

import Link from 'next/link';
import { ArrowLeft, Copy, MessageSquarePlus, Share2, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import { PatchCard } from '@/components/PatchCard';
import { PatchModal } from '@/components/PatchModal';
import { useIssues } from '@/context/IssueContext';

function clip(value: string, max: number) {
  const clean = value.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

function buildShareText(before: string, after: string, url: string) {
  return `Patch!\n\nBefore: ${clip(before, 72)}\nAfter: ${clip(after, 100)}\n\nPatch this yourself → ${url}`;
}

export function IssueDetail({ id }: { id: string }) {
  const { getIssue, upvotePatch, dbEnabled } = useIssues();
  const issue = getIssue(id);
  const [open, setOpen] = useState(false);
  const [shareLabel, setShareLabel] = useState('Share to X');

  const bestPatch = useMemo(
    () => issue?.patches.reduce((best, patch) => (!best || patch.votes > best.votes ? patch : best), issue.patches[0]),
    [issue],
  );

  if (!issue) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Issue not found</h1>
          <Link href="/" className="mt-6 inline-block text-sm font-semibold text-indigo-300">Back home →</Link>
        </div>
      </main>
    );
  }

  const currentIssue = issue;

  function shareToX() {
    if (!bestPatch) {
      setShareLabel('Add a Patch first');
      window.setTimeout(() => setShareLabel('Share to X'), 1800);
      return;
    }

    const text = buildShareText(currentIssue.body, bestPatch.text, window.location.href);
    const shareUrl = `https://x.com/intent/post?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=720,height=640');
    setShareLabel('Opening X…');
    window.setTimeout(() => setShareLabel('Share to X'), 1600);
  }

  async function copyShareText() {
    if (!bestPatch) return;
    const text = buildShareText(currentIssue.body, bestPatch.text, window.location.href);
    await navigator.clipboard.writeText(text);
    setShareLabel('Copied');
    window.setTimeout(() => setShareLabel('Share to X'), 1600);
  }

  return (
    <main className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-4xl px-4 pb-24 pt-8 md:px-6 md:pt-12">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-200">
          <ArrowLeft size={14} />Back to timeline
        </Link>
        <section className="rounded-3xl border border-white/8 bg-white/[0.025] p-6 shadow-glow md:p-8">
          <div className="mb-4 flex flex-wrap gap-2 text-xs text-zinc-500">
            <span className="rounded-full border border-white/8 px-2.5 py-1">@{currentIssue.author}</span>
            <span>•</span>
            <span>{currentIssue.createdAt}</span>
            <span className="rounded-full border border-white/8 px-2.5 py-1">{currentIssue.category}</span>
          </div>
          <h1 className="max-w-3xl text-3xl font-black tracking-[-0.03em] md:text-5xl">{currentIssue.title}</h1>
          <p className="mt-5 max-w-3xl whitespace-pre-line text-sm leading-7 text-zinc-400 md:text-base">{currentIssue.body}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-zinc-950 transition hover:bg-zinc-200">
              <MessageSquarePlus size={16} />Submit a Patch
            </button>
            <button onClick={shareToX} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-zinc-100 transition hover:bg-white/[0.08]">
              <Share2 size={16} />{shareLabel}
            </button>
            <button onClick={copyShareText} disabled={!bestPatch} aria-label="Copy share text" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-semibold text-zinc-400 transition hover:bg-white/[0.08] hover:text-zinc-100 disabled:opacity-40">
              <Copy size={14} />Copy
            </button>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/8 px-4 py-2.5 text-xs font-semibold text-zinc-400">
              <Sparkles size={14} />{currentIssue.patches.length} Patches
            </div>
          </div>
        </section>
        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300/80">The Patch stack</div>
              <h2 className="mt-1 text-xl font-bold">How the internet would say it</h2>
            </div>
            {dbEnabled && <span className="text-[11px] font-semibold text-emerald-300/80">Live database</span>}
          </div>
          <div className="space-y-8">
            {currentIssue.patches.length ? currentIssue.patches.map((p) => (
              <PatchCard key={p.id} patch={p} before={currentIssue.body} onUpvote={() => upvotePatch(currentIssue.id, p.id)} />
            )) : (
              <div className="rounded-3xl border border-dashed border-white/10 p-10 text-center text-sm text-zinc-500">No patches yet. Be the first.</div>
            )}
          </div>
        </section>
      </div>
      <PatchModal issueId={currentIssue.id} open={open} onClose={() => setOpen(false)} />
    </main>
  );
}
