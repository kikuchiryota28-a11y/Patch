'use client';
import {useI18n} from '@/lib/i18n-client';
export function LanguageSelector(){const{locale,setLocale}=useI18n();return <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{([['en','EN'],['ja','JA'],['es','ES'],['zh','ZH']] as const).map(([value,label])=><button key={value} type="button" onClick={()=>setLocale(value)} aria-pressed={locale===value} className={`rounded-2xl px-4 py-3 text-sm font-black transition ${locale===value?'bg-white text-zinc-950':'bg-white/[0.04] text-zinc-500 hover:text-white'}`}>{label}</button>)}</div>}
