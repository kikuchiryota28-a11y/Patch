'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/supabase/client';
import { completeProfile } from '@/lib/auth/actions';
import { setAuthenticatedActorId } from '@/lib/identity';

export type Locale = 'en' | 'ja';
type AuthContextValue = { user: User | null; loading: boolean; authOpen: boolean; openAuth: () => void; closeAuth: () => void; profileComplete: boolean; needsOnboarding: boolean; refreshProfile: () => Promise<void>; saveProfile: (input: { username: string; displayName: string; avatarUrl: string; language: 'EN' | 'JA' }) => Promise<void> };
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = getSupabaseClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  async function refreshProfile() {
    if (!supabase || !user) { setProfileComplete(false); return; }
    const { data } = await supabase.from('profiles').select('username,display_name,avatar_url').eq('actor_id', user.id).maybeSingle();
    setProfileComplete(Boolean(data?.username && data?.display_name && data?.avatar_url));
  }
  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getUser().then(({ data }) => { setUser(data.user ?? null); setAuthenticatedActorId(data.user?.id ?? null); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user ?? null); setAuthenticatedActorId(session?.user?.id ?? null); if (!session?.user) setProfileComplete(false); });
    return () => subscription.unsubscribe();
  }, [supabase]);
  useEffect(() => { if (user) void refreshProfile(); }, [user]);
  async function saveProfile(input: { username: string; displayName: string; avatarUrl: string; language: 'EN'|'JA' }) { await completeProfile(input); await refreshProfile(); }
  const value = useMemo(() => ({ user, loading, authOpen, openAuth: () => setAuthOpen(true), closeAuth: () => setAuthOpen(false), profileComplete, needsOnboarding: Boolean(user && !loading && !profileComplete), refreshProfile, saveProfile }), [user, loading, authOpen, profileComplete]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used inside AuthProvider'); return value; }
