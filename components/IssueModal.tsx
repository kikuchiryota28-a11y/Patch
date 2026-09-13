'use client';

import { Bot, X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { useIssues } from '@/context/IssueContext';

export function IssueModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addIssue } = useIssues();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setTitle('');
      setBody('');
      setIsSubmitting(false);
    }
  }, [open]);

  if (!open) return null;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim() || !body.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addIssue({ title, body, category: 'General' });
      onClose();
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" className="w-full max-w-lg rounded-3xl border border-white/10 bg-zinc-900 p-6" onMouseDown={(e) => e.stopPropagation()}>
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">Post a new Issue</h2>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-indigo-300/20 bg-indigo-300/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-200">
              <Bot size={11} />3 AI Patches spawn automatically
            </div>
          </div>
          <button onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Issue title" className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm" maxLength={120} />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Explain the situation" className="min-h-32 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm" maxLength={600} />
          <button type="submit" disabled={!title.trim() || !body.trim() || isSubmitting} className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-bold text-zinc-950 disabled:opacity-40">
            {isSubmitting ? 'Spawning patches…' : 'Publish Issue + Spawn Patches'}
          </button>
        </form>
      </div>
    </div>
  );
}
