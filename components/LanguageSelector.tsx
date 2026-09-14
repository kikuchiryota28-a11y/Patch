'use client';
import {useLanguage} from '@/context/LanguageContext';
export function LanguageSelector(){const{language,setLanguage}=useLanguage();return <label className="block"><span className="sr-only">Language</span><select value={language} onChange={e=>setLanguage(e.target.value==='ja'?'ja':'en')} className="w-full appearance-none rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm font-bold text-white outline-none focus:border-white/25"><option value="en">English (EN)</option><option value="ja">日本語 (JA)</option></select></label>}
