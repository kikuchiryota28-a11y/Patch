'use client';

import Link from 'next/link';
import { Bell, CheckCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { NotificationItem } from '@/lib/types';
import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from '@/lib/patchDb';

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const unread = useMemo(() => items.filter((item) => !item.readAt).length, [items]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const next = await fetchNotifications();
        if (active) setItems(next);
      } catch (error) {
        console.error(error);
      }
    };
    void load();
    const timer = window.setInterval(load, 20000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  async function read(item: NotificationItem) {
    if (!item.readAt) {
      try {
        await markNotificationRead(item.id);
        setItems((current) => current.map((candidate) => candidate.id === item.id ? { ...candidate, readAt: new Date().toISOString() } : candidate));
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function markAllRead() {
    setLoading(true);
    try {
      await markAllNotificationsRead(items);
      const now = new Date().toISOString();
      setItems((current) => current.map((item) => ({ ...item, readAt: item.readAt ?? now })));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-label="Notifications" className="relative grid h-10 w-10 place-items-center rounded-full border border-white/8 bg-white/[0.03] text-zinc-300 transition hover:bg-white/[0.07]">
        <Bell size={17} />
        {unread > 0 && <span className="absolute -right-0.5 -top-0.5 grid min-h-4 min-w-4 place-items-center rounded-full bg-indigo-400 px-1 text-[9px] font-black text-zinc-950">{unread > 9 ? '9+' : unread}</span>}
      </button>
      {open && <>
        <button className="fixed inset-0 z-40 cursor-default" aria-label="Close notifications" onClick={() => setOpen(false)} />
        <div className="absolute right-0 z-50 mt-3 w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
            <div><div className="text-sm font-bold">Notifications</div><div className="text-[11px] text-zinc-500">Stay in the loop.</div></div>
            <button type="button" disabled={loading || unread === 0} onClick={markAllRead} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 transition hover:text-zinc-200 disabled:opacity-30"><CheckCheck size={13}/>Mark all read</button>
          </div>
          <div className="max-h-[420px] overflow-y-auto">
            {items.length === 0 ? <div className="px-5 py-10 text-center text-sm text-zinc-500">Nothing yet. Your next Patch win will show up here.</div> : items.map((item) => (
              <Link key={item.id} href={item.issueId ? `/issues/${item.issueId}` : '/'} onClick={() => void read(item)} className={`block border-b border-white/5 px-4 py-3 transition hover:bg-white/[0.04] ${item.readAt ? 'opacity-55' : 'bg-indigo-400/[0.04]'}`}>
                <div className="flex items-start gap-3"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-300"/><div className="min-w-0"><div className="text-sm font-semibold text-zinc-100">{item.title}</div><p className="mt-1 text-xs leading-5 text-zinc-500">{item.message}</p><div className="mt-1 text-[10px] text-zinc-600">{new Date(item.createdAt).toLocaleString()}</div></div></div>
              </Link>
            ))}
          </div>
        </div>
      </>}
    </div>
  );
}
