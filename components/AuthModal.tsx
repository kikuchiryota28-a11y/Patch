'use client';

import {useEffect,useState} from 'react';
import {LockKeyhole,Mail,X} from 'lucide-react';
import {useAuth} from '@/context/AuthContext';
import {useLanguage} from '@/context/LanguageContext';

export function AuthModal(){
 const{authOpen,closeAuth,signIn,signUp}=useAuth();
 const{dictionary}=useLanguage();
 const d=dictionary.auth;
 const[email,setEmail]=useState('');
 const[password,setPassword]=useState('');
 const[displayName,setDisplayName]=useState('');
 const[mode,setMode]=useState<'signin'|'signup'>('signin');
 const[error,setError]=useState('');
 const[info,setInfo]=useState('');
 const[busy,setBusy]=useState(false);
 useEffect(()=>{if(!authOpen){setEmail('');setPassword('');setDisplayName('');setError('');setInfo('');setBusy(false)}},[authOpen]);
 if(!authOpen)return null;
 async function submit(){
  setError('');setInfo('');
  if(!email.trim()||!password||(mode==='signup'&&!displayName.trim())){setError(d.missingFields);return}
  if(password.length<6){setError(d.passwordLength);return}
  setBusy(true);
  try{
   const result=mode==='signin'?await signIn(email,password):await signUp(email,password,displayName);
   if(result.error){setError(mode==='signin'?d.invalidCredentials:d.missingFields);return}
   if(result.message==='CONFIRM_EMAIL'){setInfo(d.confirmEmail);return}
   closeAuth();
  }catch{setError(mode==='signin'?d.invalidCredentials:d.missingFields)}finally{setBusy(false)}
 }
 return <div className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-4 backdrop-blur-xl" onMouseDown={closeAuth}>
  <div role="dialog" aria-modal="true" aria-labelledby="patch-auth-title" className="w-full max-w-md rounded-[28px] border border-white/10 bg-zinc-900/95 p-6 shadow-[0_30px_100px_rgba(0,0,0,.65)]" onMouseDown={e=>e.stopPropagation()}>
   <div className="mb-6 flex items-start justify-between"><div><div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-zinc-950"><LockKeyhole size={18}/></div><h2 id="patch-auth-title" className="text-2xl font-black tracking-tight">{d.title}</h2></div><button type="button" onClick={closeAuth} aria-label={d.close} className="grid h-10 w-10 place-items-center rounded-full text-zinc-500 hover:bg-white/[0.06] hover:text-white"><X size={18}/></button></div>
   <form onSubmit={e=>{e.preventDefault();void submit()}} className="space-y-3">
    {mode==='signup'&&<input value={displayName} onChange={e=>setDisplayName(e.target.value)} autoComplete="name" placeholder={d.displayName} className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3.5 text-sm text-white outline-none focus:border-white/25"/>}
    <input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" placeholder={d.email} className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3.5 text-sm text-white outline-none focus:border-white/25"/>
    <input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete={mode==='signin'?'current-password':'new-password'} minLength={6} placeholder={d.password} className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3.5 text-sm text-white outline-none focus:border-white/25"/>
    <button type="submit" disabled={busy} className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 text-sm font-black text-zinc-950 disabled:opacity-50"><Mail size={15}/>{busy?(mode==='signin'?d.signingIn:d.signingUp):(mode==='signin'?d.signIn:d.signUp)}</button>
   </form>
   {error&&<p role="alert" className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/[0.06] p-3 text-xs leading-5 text-red-200">{error}</p>}
   {info&&<p role="status" className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-3 text-xs leading-5 text-emerald-200">{info}</p>}
   <button type="button" onClick={()=>{setMode(mode==='signin'?'signup':'signin');setError('');setInfo('')}} className="mt-5 w-full py-2 text-xs font-semibold text-zinc-500 hover:text-white">{mode==='signin'?d.switchToSignUp:d.switchToSignIn}</button>
  </div>
 </div>
}
