'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useState} from 'react';
import {Home,Trophy,Dices,UserCircle,Settings,Plus,Sparkles,LogIn} from 'lucide-react';
import {IssueModal} from './IssueModal';
import {NotificationCenter} from './NotificationCenter';
import {useAuth} from '@/context/AuthContext';
import {useI18n} from '@/components/I18nProvider';

export function Navigation(){
 const pathname=usePathname();const{user,openAuth}=useAuth();const{t}=useI18n();const[open,setOpen]=useState(false);
 const items=[{href:'/',label:t('nav.home'),icon:Home},{href:'/hall-of-fame',label:t('nav.hall'),icon:Trophy},{href:'/gacha',label:t('nav.gacha'),icon:Dices},{href:'/profile',label:t('nav.profile'),icon:UserCircle},{href:'/settings',label:t('nav.settings'),icon:Settings}];
 const active=(href:string)=>href==='/'?pathname==='/':pathname.startsWith(href);
 function postIssue(){if(!user){openAuth();return}setOpen(true)}
 return <>
  <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] border-r border-white/[0.07] bg-zinc-950/95 px-5 py-6 backdrop-blur-2xl md:flex md:flex-col">
   <Link href="/" className="mb-9 flex items-center gap-3 px-2"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-zinc-950"><Sparkles size={19}/></div><div><div className="text-lg font-black">Patch!</div><div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">rewrite reality</div></div></Link>
   <nav className="space-y-2">{items.map(({href,label,icon:Icon})=><Link key={href} href={href} aria-current={active(href)?'page':undefined} className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-black transition ${active(href)?'bg-white text-zinc-950':'text-zinc-500 hover:bg-white/[0.06] hover:text-white'}`}><Icon size={19}/><span>{label}</span></Link>)}</nav>
   <div className="mt-auto space-y-3"><Link href={user?'/settings':'/login'} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white transition hover:bg-white/[0.08]"><LogIn size={16}/>{user?'Account':'Sign in'}</Link><button onClick={postIssue} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-4 text-sm font-black text-zinc-950"><Plus size={18}/>{t('nav.post')}</button><div className="flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.025] p-2"><span className="pl-2 text-[11px] font-bold text-zinc-600">Notifications</span><NotificationCenter/></div></div>
  </aside>
  <nav aria-label="Primary navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-zinc-950/95 px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] backdrop-blur-2xl md:hidden">
   <div className="grid grid-cols-5 gap-1">{items.map(({href,label,icon:Icon},index)=>index===2?<button key="create" type="button" onClick={postIssue} aria-label={t('nav.post')} className="flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-black text-zinc-500 active:scale-95"><span className="grid h-9 w-9 place-items-center rounded-full bg-white text-zinc-950 shadow-lg"><Plus size={21} strokeWidth={3}/></span><span>{t('nav.post')}</span></button>:<Link key={href} href={href} aria-current={active(href)?'page':undefined} className={`flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-black transition active:scale-95 ${active(href)?'bg-white text-zinc-950':'text-zinc-500 hover:text-white'}`}><Icon size={20} strokeWidth={2.5}/><span>{label}</span></Link>)}</div>
  </nav>
  <IssueModal open={open} onClose={()=>setOpen(false)}/>
 </>;
}
