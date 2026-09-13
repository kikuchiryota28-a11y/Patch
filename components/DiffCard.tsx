'use client';

import { ArrowDownToLine, ArrowUpToLine, Check, Copy } from 'lucide-react';
import { useMemo, useState } from 'react';

function tokenize(text: string) { return text.match(/\S+|\s+/g) ?? []; }
type DiffOp = { type: 'same' | 'add' | 'remove'; value: string };

function diffWords(before: string, after: string): DiffOp[] {
  const a = tokenize(before), b = tokenize(after);
  const dp = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? 1 + dp[i + 1][j + 1] : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const ops: DiffOp[] = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { ops.push({ type: 'same', value: a[i] }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { ops.push({ type: 'remove', value: a[i++] }); }
    else { ops.push({ type: 'add', value: b[j++] }); }
  }
  while (i < a.length) ops.push({ type: 'remove', value: a[i++] });
  while (j < b.length) ops.push({ type: 'add', value: b[j++] });
  return ops;
}

export function DiffCard({ before, after }: { before: string; after: string }) {
  const [copied, setCopied] = useState(false);
  const diff = useMemo(() => diffWords(before, after), [before, after]);
  async function copyPatch() {
    await navigator.clipboard.writeText(after);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }
  return (
    <section className="overflow-hidden rounded-3xl border border-white/8 bg-zinc-950 shadow-glow">
      <div className="flex items-center justify-between border-b border-white/8 bg-white/[0.02] px-4 py-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400"><div className="flex items-center gap-1.5 rounded-full border border-red-400/15 bg-red-400/5 px-2.5 py-1 text-red-300"><ArrowUpToLine size={13} />Before</div><span className="text-zinc-700">→</span><div className="flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/5 px-2.5 py-1 text-emerald-300"><ArrowDownToLine size={13} />After</div></div>
        <button onClick={copyPatch} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-zinc-500 transition hover:bg-white/5 hover:text-zinc-200">{copied ? <Check size={13} /> : <Copy size={13} />}{copied ? 'Copied' : 'Copy'}</button>
      </div>
      <div className="grid md:grid-cols-2">
        <div className="border-b border-white/8 p-5 md:border-b-0 md:border-r md:p-6"><div className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-red-400/70">- issue</div><p className="text-sm leading-7 text-zinc-400">{before}</p></div>
        <div className="p-5 md:p-6"><div className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-400/70">+ patch</div><p className="text-sm leading-7 text-zinc-100">{diff.map((op, index) => <span key={`${op.type}-${index}`} className={op.type === 'add' ? 'rounded bg-emerald-400/15 px-0.5 text-emerald-200' : op.type === 'remove' ? 'rounded bg-red-400/15 px-0.5 text-red-300 line-through decoration-red-400/70' : ''}>{op.value}</span>)}</p></div>
      </div>
    </section>
  );
}