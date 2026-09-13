'use client';

import Link from 'next/link';
import { Plus, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { IssueModal } from './IssueModal';

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="group flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-white text-zinc-950 shadow-lg shadow-black/20 transition-transform group-hover:rotate-6"><Sparkles size={16} strokeWidth={2.6} /></div>
            <div><div className="text-sm font-black tracking-tight">Patch!</div><div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">rewrite reality</div></div>
          </Link>
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 active:scale-[0.98]"><Plus size={16} />Post Issue</button>
        </div>
      </header>
      <IssueModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}