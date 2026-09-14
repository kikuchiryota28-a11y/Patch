'use client';

import Link from 'next/link';
import {useEffect,useState} from 'react';
import {Check,ExternalLink,LogIn,LogOut,Save,Settings as SettingsIcon,Trash2,UserCircle} from 'lucide-react';
import {useAuth} from '@/context/AuthContext';
import {useLanguage} from '@/context/LanguageContext';

export default function SettingsPage(){
 const{user,profile,openAuth,signOut,saveProfile}=useAuth();
 const{language,setLanguage,dictionary}=useLanguage();
 const d=dictionary.settings;
 const[displayName,setDisplayName]=useState('');
 const[avatarUrl,setAvatarUrl]=useState('');
 const[username,setUsername]=useState('');
 const[bio,setBio]=useState('');
 const[saving,setSaving]=useState(false);
 const[saved,setSaved]=useState(false);
 const[error,setError]=useState('');
 const[signingOut,setSigningOut]=useState(false);
 useEffect(()=>{if(profile){setDisplayName(profile.displayName);setAvatarUrl(profile.avatarUrl);setUsername(profile.username);setBio(profile.bio)}},[profile]);
 async function save(e:React.FormEvent){e.preventDefault();if(!user)return;setSaving(true);setSaved(false);setError('');try{await saveProfile({username,displayName,bio,avatarUrl,language});setSaved(true)}catch{setError(d.saveError)}finally{setSaving(false)}}
 async function handleSignOut(){setSigningOut(true);try{await signOut()}catch{setError(d.saveError)}finally{setSigningOut(false)}}
 function clearLocalData(){try{localStorage.removeItem('patch-voted-patches');sessionStorage.clear();window.location.reload()}catch{window.location.reload()}}
 return <main className="min-h-screen"><div className="mx-auto max-w-3xl px-4 pb-28 pt-7 md:px-8 md:pt-14">
  <header className="mb-10"><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-zinc-400"><SettingsIcon size={13}/>{d.title}</div><h1 className="text-4xl font-black tracking-[-0.04em] md:text-6xl">{d.title}</h1><p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">{dictionary.settings.description}</p></header>
  {!user?<section className="rounded-[28px] border border-white/10 bg-white/[0.025] p-7 shadow-2xl shadow-black/20"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-zinc-950"><LogIn size={22}/></div><h2 className="mt-6 text-2xl font-black">{dictionary.auth.title}</h2><p className="mt-2 max-w-lg text-sm leading-6 text-zinc-500">{d.signInPrompt}</p><button type="button" onClick={openAuth} className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-black text-zinc-950"><LogIn size={16}/>{dictionary.auth.signIn}</button></section>:<div className="space-y-5">
   <form onSubmit={save} className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.025] shadow-2xl shadow-black/10"><div className="border-b border-white/5 p-6 md:p-7"><div className="flex items-center justify-between gap-4"><div><h2 className="text-xl font-black">{d.profileSettings}</h2><p className="mt-1 text-xs text-zinc-600">{d.publicIdentity}</p></div><Link href="/profile" className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-zinc-400 hover:bg-white/[0.04]">{d.viewProfile}</Link></div></div>
    <div className="p-6 md:p-7"><div className="flex items-center gap-4 rounded-2xl bg-white/[0.025] p-4"><div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">{avatarUrl?<img src={avatarUrl} alt="" className="h-full w-full object-cover"/>:<UserCircle size={30} className="text-zinc-600"/>}</div><div><p className="text-sm font-black">{displayName||d.yourName}</p><p className="mt-1 text-xs text-zinc-600">@{username||'username'}</p></div></div>
     <div className="mt-6 grid gap-4"><Field label={d.displayName} value={displayName} setValue={setDisplayName} placeholder={d.yourName}/><Field label={d.username} value={username} setValue={setUsername} placeholder="patchsmith"/><Field label={d.avatarUrl} value={avatarUrl} setValue={setAvatarUrl} placeholder="https://…"/><label className="text-xs font-bold text-zinc-500">{d.bio}<textarea value={bio} onChange={e=>setBio(e.target.value)} maxLength={300} rows={4} placeholder={d.bioPlaceholder} className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-white/25"/></label></div>
     <div className="mt-5 border-t border-white/5 pt-5"><p className="text-xs font-bold text-zinc-600">{d.email}</p><p className="mt-1 break-all text-sm text-zinc-300">{user.email||'—'}</p></div>
     {error&&<div role="alert" className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/[0.06] p-4 text-sm leading-6 text-red-200">{error}</div>}
     <button type="submit" disabled={saving} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 text-sm font-black text-zinc-950 disabled:opacity-50"><Save size={17}/>{saving?d.saveChanges:saved?d.saved:d.saveChanges}{saved&&<Check size={16}/>}</button>
    </div></form>
   <section className="rounded-[28px] border border-white/10 bg-white/[0.025] p-6 md:p-7"><h2 className="text-xl font-black">{d.appSettings}</h2><p className="mt-1 text-xs text-zinc-600">{d.appLanguageDescription}</p><div className="mt-5 grid grid-cols-2 gap-3"><LanguageButton active={language==='en'} onClick={()=>setLanguage('en')} label="English"/><LanguageButton active={language==='ja'} onClick={()=>setLanguage('ja')} label="日本語"/></div></section>
   <section className="rounded-[28px] border border-white/10 bg-white/[0.025] p-6 md:p-7"><div className="flex items-start gap-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.05]"><Trash2 size={18}/></div><div><h2 className="text-xl font-black">{d.systemData}</h2><p className="mt-1 text-xs leading-5 text-zinc-600">{d.systemDataDescription}</p><button type="button" onClick={clearLocalData} className="mt-4 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-bold text-zinc-300">{d.clearCache}</button></div></div></section>
   <section className="rounded-[28px] border border-red-400/15 bg-red-400/[0.025] p-6 md:p-7"><h2 className="text-xl font-black">{d.accountActions}</h2><p className="mt-1 text-xs leading-5 text-zinc-600">{d.accountActionsDescription}</p><button type="button" disabled={signingOut} onClick={()=>void handleSignOut()} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-300/20 px-4 py-2.5 text-sm font-bold text-red-200 disabled:opacity-50"><LogOut size={16}/>{signingOut?d.signingOut:d.signOut}</button></section>
   <section className="rounded-[28px] border border-white/10 bg-white/[0.025] p-6 md:p-7"><h2 className="text-xl font-black">{d.appInfo}</h2><div className="mt-4 flex justify-between border-b border-white/5 pb-4 text-sm"><span className="text-zinc-500">{d.version}</span><span className="font-bold text-zinc-300">v1.0.0</span></div><div className="mt-4 grid gap-3 sm:grid-cols-2"><a href="/terms" className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-zinc-300">{d.terms}<ExternalLink size={15}/></a><a href="/privacy" className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-zinc-300">{d.privacy}<ExternalLink size={15}/></a></div></section>
  </div>}
 </div></main>
}

function Field({label,value,setValue,placeholder}:{label:string;value:string;setValue:(v:string)=>void;placeholder:string}){return <label className="text-xs font-bold text-zinc-500">{label}<input value={value} onChange={e=>setValue(e.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-white/25"/></label>}
function LanguageButton({active,onClick,label}:{active:boolean;onClick:()=>void;label:string}){return <button type="button" onClick={onClick} className={`rounded-2xl border px-4 py-3.5 text-sm font-black transition ${active?'border-white bg-white text-zinc-950':'border-white/10 bg-zinc-950 text-zinc-300 hover:bg-white/[0.04]'}`}>{label}</button>}
