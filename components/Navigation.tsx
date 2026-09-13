'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Home, Trophy, Dices, UserCircle, Settings, Plus, Sparkles } from 'lucide-react';
import { IssueModal } from './IssueModal';
import { NotificationCenter } from './NotificationCenter';
import { useAuth } from '@/context/AuthContext';
import { getActorId } from '@/lib/identity';

const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/hall-of-fame', label: 'Hall of Fame', icon: Trophy },
  { href: '/gacha', label: 'Gacha', icon: Dices },
  { href: '/profile', label: 'Profile', icon: UserCircle },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();
  const { user, openAuth } = useAuth();
  const [open, setOpen] = useState(false);
  const [actorId, setActorId] = useState('');

  useEffect(() => setActorId(getActorId()), [user]);

  function postIssue() {
    if (!user) { openAuth(); return; }
    setOpen(true);
  }

  return <>
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] border-r border-white/[0.07] bg-zinc-950/95 px-5 py-6 backdrop-blur-2xl md:flex md:flex-col">
      <Link href="/" className="mb-9 flex items-center gap-3 px-2">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-zinc-950 shadow-lg shadow-black/20"><Sparkles size={19} strokeWidth={2.7}/></div>
        <div><div className="text-lg font-black tracking-tight text-white">Patch!</div><div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">rewrite reality</div></div>
      </Link>
      <nav className="space-y-2" aria-label="Main navigation">
        {items.map(({href,label,icon:Icon}) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return <Link key={href} href={href} className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-black transition ${active ? 'bg-white text-zinc-950 shadow-lg shadow-white/5' : 'text-zinc-500 hover:bg-white/[0.06] hover:text-white'}`}>
            <Icon size={19} strokeWidth={active ? 2.7 : 2.2}/><span>{label}</span>
          </Link>;
        })}
      </nav>
      <div className="mt-auto space-y-3">
        <button onClick={postIssue} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-4 text-sm font-black text-zinc-950 shadow-xl shadow-white/5 transition hover:bg-zinc-200 active:scale-[0.98]"><Plus size={18} strokeWidth={2.8}/>Post Issue</button>
        <div className="flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.025] p-2"><span className="pl-2 text-[11px] font-bold text-zinc-600">Notifications</span><NotificationCenter/></div>
      </div>
    </aside>

    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-zinc-950/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-2xl md:hidden" aria-label="Mobile navigation">
      <div className="grid grid-cols-5 gap-1">
        {items.map(({href,label,icon:Icon}) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return <Link key={href} href={href} className={`flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-black transition ${active ? 'bg-white text-zinc-950' : 'text-zinc-500'}`}>
            <Icon size={20} strokeWidth={active ? 2.8 : 2}/><span>{label}</span>
          </Link>;
        })}
      </div>
      <button onClick={postIssue} aria-label="Post Issue" className="absolute -top-7 left-1/2 grid h-14 w-14 -translate-x-1/2 place-items-center rounded-full border-4 border-zinc-950 bg-white text-zinc-950 shadow-2xl shadow-black/40"><Plus size={25} strokeWidth={3}/></button>
    </nav>
    <IssueModal open={open} onClose={() => setOpen(false)} />
  </>;
}
