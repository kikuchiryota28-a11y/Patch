'use client';

import Link from 'next/link';
import { ArrowUpRight, MessageSquareText, Sparkles } from 'lucide-react';
import { useIssues } from '@/context/IssueContext';

export function Timeline() {
  const { issues } = useIssues();
  return (
    <div className="space-y-3">
      {issues.map((issue) => (
        <Link key={issue.id} href={`/issues/${issue.id}`} className="group block rounded-3xl border border-white/7 bg-white/[0.025] p-5 transition hover:-translate-y-0.5 hover:border-white/12 hover:bg-white/[0.045] hover:shadow-glow md:p-6">
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-zinc-500"><span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1">@{issue.author}</span><span>•</span><span>{issue.createdAt}</span></div>
              <h2 className="text-base font-semibold leading-7 text-zinc-100 transition group-hover:text-white md:text-lg">{issue.title}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-500 line-clamp-2">{issue.body}</p>
            </div>
            <ArrowUpRight size={18} className="mt-1 shrink-0 text-zinc-700 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-zinc-300" />
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400"><MessageSquareText size={15} />{issue.patches.length} {issue.patches.length === 1 ? 'Patch' : 'Patches'}</div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 transition group-hover:text-indigo-300"><Sparkles size={13} />See rewrites</div>
          </div>
        </Link>
      ))}
    </div>
  );
}