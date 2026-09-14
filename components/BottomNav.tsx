'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Dices,Home,Plus,Settings,Trophy,UserCircle} from 'lucide-react';
import {useI18n} from '@/components/I18nProvider';

export function BottomNav({onPost}:{onPost:()=>void}){
 const pathname=usePathname();
 const{t}=useI18n();
 const items=[
  {href:'/',label:t('nav.home'),icon:Home},
  {href:'/hall-of-fame',label:t('nav.hall'),icon:Trophy},
  {href:'/gacha',label:t('nav.gacha'),icon:Dices},
  {href:'/profile',label:t('nav.profile'),icon:UserCircle},
  {href:'/settings',label:t('nav.settings'),icon:Settings}
 ];
 const active=(href:string)=>href==='/'?pathname==='/':pathname.startsWith(href);
 return <nav aria-label={t('nav.home')} className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-zinc-950/95 px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] backdrop-blur-2xl md:hidden">
  <div className="mx-auto grid max-w-xl grid-cols-5 gap-1">
   {items.map(({href,label,icon:Icon},index)=>index===2?<button key="create" type="button" onClick={onPost} aria-label={t('nav.post')} className="flex min-h-[58px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-black text-zinc-500 active:scale-95"><span className="grid h-9 w-9 place-items-center rounded-full bg-white text-zinc-950 shadow-lg"><Plus size={21} strokeWidth={3}/></span><span className="max-w-full truncate">{t('nav.post')}</span></button>:<Link key={href} href={href} aria-current={active(href)?'page':undefined} className={`flex min-h-[58px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-black transition active:scale-95 ${active(href)?'bg-white text-zinc-950':'text-zinc-500 hover:text-white'}`}><Icon size={20} strokeWidth={2.5}/><span className="max-w-full truncate">{label}</span></Link>)}
  </div>
 </nav>;
}
