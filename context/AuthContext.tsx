'use client';
import {createContext,useContext,useEffect,useMemo,useState} from 'react';
import type {User} from '@supabase/supabase-js';
import {getSupabaseClient} from '@/lib/supabase/client';
import {completeProfile} from '@/lib/auth/actions';
import {setAuthenticatedActorId} from '@/lib/identity';
import type {Locale} from '@/lib/i18n';

export type Profile={username:string;displayName:string;bio:string;avatarUrl:string;language:Locale};
type DbLanguage='EN'|'JA'|'ES'|'ZH';
type AuthContextValue={user:User|null;profile:Profile|null;loading:boolean;authOpen:boolean;openAuth:()=>void;closeAuth:()=>void;profileComplete:boolean;needsOnboarding:boolean;refreshProfile:()=>Promise<void>;saveProfile:(input:Profile)=>Promise<void>};
const C=createContext<AuthContextValue|null>(null);

const TO_DB_LANGUAGE={en:'EN',ja:'JA',es:'ES',zh:'ZH'} satisfies Record<Locale,DbLanguage>;
const FROM_DB_LANGUAGE={EN:'en',JA:'ja',ES:'es',ZH:'zh'} satisfies Record<DbLanguage,Locale>;

function toDbLanguage(locale:Locale):DbLanguage{return TO_DB_LANGUAGE[locale]}
function fromDbLanguage(value:unknown):Locale{return value==='JA'||value==='ES'||value==='ZH'?FROM_DB_LANGUAGE[value]:'en'}

export function AuthProvider({children}:{children:React.ReactNode}){
 const supabase=getSupabaseClient();const[user,setUser]=useState<User|null>(null);const[profile,setProfile]=useState<Profile|null>(null);const[loading,setLoading]=useState(true);const[authOpen,setAuthOpen]=useState(false);
 async function refreshProfile(){if(!supabase||!user){setProfile(null);return}const{data}=await supabase.from('profiles').select('username,display_name,bio,avatar_url,language').eq('actor_id',user.id).maybeSingle();if(data)setProfile({username:data.username??'',displayName:data.display_name??'',bio:data.bio??'',avatarUrl:data.avatar_url??'',language:fromDbLanguage(data.language)});else setProfile(null)}
 useEffect(()=>{if(!supabase){setLoading(false);return}supabase.auth.getUser().then(({data})=>{setUser(data.user??null);setAuthenticatedActorId(data.user?.id??null);setLoading(false)});const{data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>{setUser(s?.user??null);setAuthenticatedActorId(s?.user?.id??null);if(!s?.user)setProfile(null)});return()=>subscription.unsubscribe()},[supabase]);
 useEffect(()=>{if(user)void refreshProfile()},[user]);
 async function saveProfile(input:Profile){const normalized={...input,username:input.username.trim().replace(/^@/,''),displayName:input.displayName.trim(),bio:input.bio.trim(),avatarUrl:input.avatarUrl.trim()};await completeProfile({...normalized,language:toDbLanguage(normalized.language)});setProfile(normalized);await refreshProfile()}
 const value=useMemo(()=>({user,profile,loading,authOpen,openAuth:()=>setAuthOpen(true),closeAuth:()=>setAuthOpen(false),profileComplete:Boolean(profile?.username&&profile?.displayName),needsOnboarding:Boolean(user&&!loading&&!profile),refreshProfile,saveProfile}),[user,profile,loading,authOpen]);
 return <C.Provider value={value}>{children}</C.Provider>
}
export function useAuth(){const v=useContext(C);if(!v)throw new Error('useAuth must be used inside AuthProvider');return v}
