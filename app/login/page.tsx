'use client';
import {FormEvent,useEffect,useState} from 'react';
import {ArrowRight,Sparkles} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/context/AuthContext';
import {useLanguage} from '@/context/LanguageContext';

export default function LoginPage(){
 const router=useRouter();
 const{user,loading,signIn,signUp}=useAuth();
 const{dictionary}=useLanguage();
 const d=dictionary.auth;
 const[email,setEmail]=useState('');
 const[password,setPassword]=useState('');
 const[displayName,setDisplayName]=useState('');
 const[mode,setMode]=useState<'signin'|'signup'>('signin');
 const[busy,setBusy]=useState(false);
 const[message,setMessage]=useState('');
 const[info,setInfo]=useState('');
 useEffect(()=>{if(!loading&&user)router.replace('/')},[loading,user,router]);
 const switchMode=(next:'signin'|'signup')=>{setMode(next);setMessage('');setInfo('');setBusy(false)};
 async function submit(e:FormEvent){e.preventDefault();setMessage('');setInfo('');if(!email.trim()||!password||(mode==='signup'&&!displayName.trim())){setMessage(d.missingFields);return}if(password.length<6){setMessage(d.passwordLength);return}setBusy(true);try{const result=mode==='signin'?await signIn(email,password):await signUp(email,password,displayName);if(result.error)setMessage(result.message??(mode==='signin'?d.invalidCredentials:d.missingFields));else if(result.message==='CONFIRM_EMAIL')setInfo(d.confirmEmail);else router.replace('/')}catch{setMessage(d.invalidCredentials)}finally{setBusy(false)}}
 return <main className="min-h-screen px-5 py-16 md:px-8"><div className="mx-auto flex min-h-[75vh] max-w-md items-center"><div className="w-full rounded-[32px] border border-white/10 bg-white/[0.03] p-7 shadow-[0_30px_100px_rgba(0,0,0,.45)] backdrop-blur-xl md:p-9"><div className="mb-8"><div className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-white text-zinc-950"><Sparkles size={20}/></div><p className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-600">Patch!</p><h1 className="mt-2 text-3xl font-black tracking-[-0.04em]">{mode==='signin'?d.signIn:d.signUp}</h1><p className="mt-2 text-sm leading-6 text-zinc-500">{mode==='signin'?d.title:d.switchToSignUp}</p></div><form onSubmit={submit} className="space-y-3">{mode==='signup'&&<input autoComplete="name" required value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder={d.displayName} className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3.5 text-sm text-white outline-none focus:border-white/25"/>}<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder={d.email} className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3.5 text-sm text-white outline-none focus:border-white/25"/><input type="password" autoComplete={mode==='signin'?'current-password':'new-password'} required minLength={6} value={password} onChange={e=>setPassword(e.target.value)} placeholder={d.password} className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3.5 text-sm text-white outline-none focus:border-white/25"/><button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 text-sm font-black text-zinc-950 transition disabled:opacity-40">{busy?(mode==='signin'?d.signingIn:d.signingUp):(mode==='signin'?d.signIn:d.signUp)}<ArrowRight size={16}/></button></form>{message&&<p role="alert" className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/[0.06] p-3 text-xs leading-5 text-red-200">{message}</p>}{info&&<p role="status" className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-3 text-xs leading-5 text-emerald-200">{info}</p>}<div className="mt-5 flex items-center justify-center gap-1 text-xs"><span className="text-zinc-600">{mode==='signin'?d.noAccount:d.haveAccount}</span><button type="button" onClick={()=>switchMode(mode==='signin'?'signup':'signin')} disabled={busy} aria-label={mode==='signin'?d.switchToSignUp:d.switchToSignIn} className="rounded-lg px-1 py-1 font-bold text-zinc-300 transition hover:bg-white/[0.06] hover:text-white disabled:pointer-events-none disabled:opacity-50">{mode==='signin'?d.switchToSignUp:d.switchToSignIn}</button></div></div></div></main>}
