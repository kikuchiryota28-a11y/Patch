'use client';

import { ChevronUp } from 'lucide-react';
import type { PatchItem } from '@/lib/types';
import { DiffCard } from './DiffCard';

export function PatchCard({ patch, before }: { patch: PatchItem; before: string }) {
  return (
    <article className="space-y-3">
      <div className="flex items-center justify-between gap-4 px-1">
        <div className="flex min-w-0 items-center gap-3"><span className="truncate text-sm font-semibold text-zinc-200">@{patch.author}</span><span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] font-semibold text-zinc-400">{patch.style}</span></div>
        <div className="flex shrink-0 items-center gap-1 text-xs text-zinc-500"><ChevronUp size={14} />{patch.votes}</div>
      </div>
      <DiffCard before={before} after={patch.text} />
    </article>
  );
}