'use client';

import {FormEvent,useEffect,useState} from 'react';
import {Mail,ArrowRight,Sparkles} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {getSupabaseClient} from '@/lib/supabase/client';
import {useAuth} from '@/context/AuthContext';

export default function LoginPage(){
 const router=useRouter();
 const{user,loading}=useAuth();
 const supabase=getSupabaseClient();
 const[email,setEmail]=useState('');
 const[password,setPassword]=useState('');
 const[mode,setMode]=useState<'signin'|'signup'>('signin');
 const[busy,setBusy]=useState(false);
 const[message,setMessage]=useState('');
 useEffect(()=>{if(!loading&&user)router.replace('/')},[loading,user,router]);
 async function submit(e:FormEvent){e.preventDefault();if(!supabase||!email.trim()||password.length<6)return;setBusy(true);setMessage('');const redirectTo=`${window.location.origin}/auth/callback?next=/`;const result=mode==='signin'?await supabase.auth.signInWithPassword({email:email.trim(),password}):await supabase.auth.signUp({email:email.trim(),password,options:{emailRedirectTo:redirectTo}});if(result.error)setMessage(result.error.message);else if(mode==='signup'&&!result.data.session)setMessage('Account created. Check your email to confirm it.');else router.replace('/');setBusy(false)}
 async function magic(){if(!supabase||!email.trim())return;setBusy(true);setMessage('');const{error}=await supabase.auth.signInWithOtp({email:email.trim(),options:{emailRedirectTo:`${window.location.origin}/auth/callback?next=/`}});setMessage(error?.message??'Check your email for a sign-in link.');setBusy(false)}
 return <main className="min-h-screen px-5 py-16 md:px-8"><div className="mx-auto flex min-h-[75vh] max-w-md items-center"><div className="w-full rounded-[32px] border border-white/10 bg-white/[0.03] p-7 shadow-[0_30px_100px_rgba(0,0,0,.45)] backdrop-blur-xl md:p-9"><div className="mb-8"><div className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-white text-zinc-950"><Sparkles size={20}/></div><p className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-600">Patch!</p><h1 className="mt-2 text-3xl font-black tracking-[-0.04em]">{mode==='signin'?'Welcome back.':'Join Patch.'}</h1><p className="mt-2 text-sm leading-6 text-zinc-500">{mode==='signin'?'Sign in and start rewriting reality.':'Create an account and start patching.'}</p></div><form onSubmit={submit} className="space-y-3"><input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3.5 text-sm text-white outline-none focus:border-white/25"/><input type="password" autoComplete={mode==='signin'?'current-password':'new-password'} required minLength={6} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password (6+ characters)" className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3.5 text-sm text-white outline-none focus:border-white/25"/><button type="submit" disabled={busy||!email.trim()||password.length<6} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 text-sm font-black text-zinc-950 transition hover:-translate-y-0.5 disabled:opacity-40">{busy?'Please wait…':mode==='signin'?'Sign in':'Create account'}<ArrowRight size={16}/></button></form><div className="my-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-700"><span className="h-px flex-1 bg-white/5"/>or<span className="h-px flex-1 bg-white/5"/></div><button onClick={magic} disabled={busy||!email.trim()} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-white/[0.08] disabled:opacity-40"><Mail size={16}/>Email me a sign-in link</button>{message&&<p className="mt-4 rounded-2xl border border-amber-300/10 bg-amber-300/[0.05] p-3 text-xs leading-5 text-amber-200">{message}</p>}<button onClick={()=>{setMode(mode==='signin'?'signup':'signin');setMessage('')}} className="mt-5 w-full text-xs font-semibold text-zinc-500 hover:text-white">{mode==='signin'?"Don't have an account? Create one":"Already have an account? Sign in"}</button></div></div></main>
}
