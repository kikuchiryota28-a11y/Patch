'use client';
import { useEffect, useState } from 'react';
export function LanguageSelector(){
 const[locale,setLocale]=useState<'en'|'ja'>('en');
 useEffect(()=>{const v=document.cookie.match(/(?:^|; )patch-locale=(en|ja)/)?.[1] as 'en'|'ja'|undefined;if(v)setLocale(v);},[]);
 function change(next:'en'|'ja'){setLocale(next);document.cookie=`patch-locale=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;window.location.reload();}
 return <div className="inline-flex rounded-full border border-white/8 bg-white/[0.03] p-0.5 text-[10px] font-bold"><button onClick={()=>change('en')} className={`rounded-full px-2.5 py-1.5 transition ${locale==='en'?'bg-white text-zinc-950':'text-zinc-500 hover:text-zinc-200'}`}>EN</button><button onClick={()=>change('ja')} className={`rounded-full px-2.5 py-1.5 transition ${locale==='ja'?'bg-white text-zinc-950':'text-zinc-500 hover:text-zinc-200'}`}>JA</button></div>;
}
