'use client';

import { useEffect, useState } from 'react';
import { Github, Mail, X } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';

export function AuthModal() {
  const { user, authOpen, closeAuth, needsOnboarding, saveProfile } = useAuth();
  const supabase = getSupabaseClient();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [language, setLanguage] = useState<'EN'|'JA'>('EN');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(String(user.user_metadata?.full_name ?? user.user_metadata?.name ?? ''));
      setAvatarUrl(String(user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? ''));
    }
  }, [user]);

  if (!authOpen && !needsOnboarding) return null;

  async function oauth(provider: 'google'|'github'|'x') {
    if (!supabase) return;
    setBusy(true); setMessage('');
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/auth/callback?next=/` } });
    if (error) { setMessage(error.message); setBusy(false); }
  }
  async function magicLink() {
    if (!supabase || !email.trim()) return;
    setBusy(true); setMessage('');
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/` } });
    setMessage(error ? error.message : 'Check your email for the sign-in link.'); setBusy(false);
  }
  async function finishProfile() {
    setBusy(true); setMessage('');
    try { await saveProfile({ username, displayName, avatarUrl, language }); closeAuth(); } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not save profile.'); } finally { setBusy(false); }
  }

  const onboarding = Boolean(user && needsOnboarding);
  return <div className="fixed inset-0 z-[60] grid place-items-center bg-black/75 p-4 backdrop-blur-sm" onMouseDown={() => { if (!onboarding) closeAuth(); }}>
    <div role="dialog" aria-modal="true" className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-2xl" onMouseDown={e=>e.stopPropagation()}>
      <div className="mb-6 flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Patch!</p><h2 className="mt-1 text-xl font-bold text-white">{onboarding ? 'Finish your Patchsmith profile' : 'Join Patch!'}</h2><p className="mt-1 text-sm text-zinc-500">{onboarding ? 'One quick step before you start rewriting reality.' : 'Read freely. Sign in when you want to participate.'}</p></div>{!onboarding && <button onClick={closeAuth} aria-label="Close"><X size={18}/></button>}</div>
      {onboarding ? <div className="space-y-4">
        <div><label className="mb-1.5 block text-xs font-semibold text-zinc-400">Username</label><div className="flex items-center rounded-2xl border border-white/10 bg-zinc-950 px-4"><span className="text-zinc-600">@</span><input value={username} onChange={e=>setUsername(e.target.value)} placeholder="patchsmith" className="w-full bg-transparent px-2 py-3 text-sm outline-none" maxLength={24}/></div></div>
        <div><label className="mb-1.5 block text-xs font-semibold text-zinc-400">Display name</label><input value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="Your name" className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm" maxLength={50}/></div>
        <div><label className="mb-1.5 block text-xs font-semibold text-zinc-400">Avatar URL</label><input value={avatarUrl} onChange={e=>setAvatarUrl(e.target.value)} placeholder="https://…" className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm" /></div>
        <div><label className="mb-1.5 block text-xs font-semibold text-zinc-400">Preferred content language</label><select value={language} onChange={e=>setLanguage(e.target.value as 'EN'|'JA')} className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm"><option value="EN">English</option><option value="JA">日本語</option></select></div>
        <button onClick={finishProfile} disabled={busy} className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-bold text-zinc-950 disabled:opacity-40">{busy ? 'Saving…' : 'Complete profile'}</button>
      </div> : <div className="space-y-3">
        <button onClick={()=>oauth('google')} disabled={busy} className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm font-bold text-zinc-950"><span className="text-base">G</span>Continue with Google</button>
        <button onClick={()=>oauth('github')} disabled={busy} className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm font-bold text-white"><Github size={17}/>Continue with GitHub</button>
        <button onClick={()=>oauth('x')} disabled={busy} className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm font-bold text-white">𝕏 Continue with X</button>
        <div className="my-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.15em] text-zinc-600"><span className="h-px flex-1 bg-white/5"/>or<span className="h-px flex-1 bg-white/5"/></div>
        <div className="flex gap-2"><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm"/><button onClick={magicLink} disabled={busy || !email.trim()} className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-zinc-950 disabled:opacity-40"><Mail size={15}/>Magic Link</button></div>
      </div>}
      {message && <p className="mt-4 rounded-2xl border border-amber-300/10 bg-amber-300/[0.05] p-3 text-xs leading-5 text-amber-200">{message}</p>}
    </div>
  </div>;
}
