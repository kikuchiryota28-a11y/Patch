'use client';

import { ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { PatchItem } from '@/lib/types';
import { DiffCard } from './DiffCard';

export function PatchCard({
  patch,
  before,
  onUpvote,
  disabled = false,
}: {
  patch: PatchItem;
  before: string;
  onUpvote: () => Promise<void>;
  disabled?: boolean;
}) {
  const [isVoting, setIsVoting] = useState(false);

  async function handleUpvote() {
    if (disabled || isVoting) return;
    setIsVoting(true);
    try {
      await onUpvote();
    } finally {
      setIsVoting(false);
    }
  }

  return (
    <article className="space-y-3">
      <div className="flex items-center justify-between gap-4 px-1">
        <div className="flex min-w-0 items-center gap-3">
          <span className="truncate text-sm font-semibold text-zinc-200">@{patch.author}</span>
          <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] font-semibold text-zinc-400">
            {patch.style}
          </span>
        </div>
        <button
          type="button"
          onClick={handleUpvote}
          disabled={disabled || isVoting}
          aria-label={`Upvote patch, currently ${patch.votes} votes`}
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1.5 text-xs font-semibold text-zinc-400 transition hover:border-indigo-300/30 hover:bg-indigo-300/10 hover:text-indigo-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronUp size={14} className="transition-transform group-hover:-translate-y-0.5" />
          {patch.votes}
        </button>
      </div>
      <DiffCard before={before} after={patch.text} />
    </article>
  );
}
