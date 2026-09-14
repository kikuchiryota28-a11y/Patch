'use client';

import {createContext,useContext,useEffect,useMemo,useState} from 'react';
import type {User} from '@supabase/supabase-js';
import {getSupabaseClient} from '@/lib/supabase/client';
import {completeProfile} from '@/lib/auth/actions';
import {setAuthenticatedActorId} from '@/lib/identity';
import type {Language} from '@/lib/dictionary';

type DbLanguage='EN'|'JA'|'ES'|'ZH';
export type Profile={username:string;displayName:string;bio:string;avatarUrl:string;language:Language};
type AuthResult={error:null|Error;message?:string};
type AuthContextValue={
 user:User|null;
 profile:Profile|null;
 loading:boolean;
 authOpen:boolean;
 openAuth:()=>void;
 closeAuth:()=>void;
 profileComplete:boolean;
 needsOnboarding:boolean;
 refreshProfile:()=>Promise<void>;
 signIn:(email:string,password:string)=>Promise<AuthResult>;
 signUp:(email:string,password:string,displayName:string)=>Promise<AuthResult>;
 signOut:()=>Promise<void>;
 saveProfile:(input:Profile)=>Promise<void>;
};
const C=createContext<AuthContextValue|null>(null);
const FROM_DB_LANGUAGE:Record<DbLanguage,Language>={EN:'en',JA:'ja',ES:'en',ZH:'en'};
const TO_DB_LANGUAGE:Record<Language,DbLanguage>={en:'EN',ja:'JA'};
function fromDbLanguage(value:unknown):Language{return value==='JA'? 'ja':'en'}

function profileDefaults(user:User):Profile{
 const metadata=user.user_metadata??{};
 const rawDisplay=String(metadata.display_name??metadata.name??metadata.full_name??'').trim();
 const displayName=rawDisplay||String(user.email?.split('@')[0]??'Patchsmith').slice(0,50);
 const rawUsername=String(metadata.username??'').trim().replace(/^@/,'').toLowerCase();
 const username=/^[a-z0-9_]{3,24}$/.test(rawUsername)?rawUsername:`user_${user.id.replace(/[^a-z0-9]/gi,'').slice(0,10)}`;
 const avatarUrl=String(metadata.avatar_url??metadata.picture??'').trim();
 return{username,displayName,bio:'',avatarUrl,language:'en'};
}

export function AuthProvider({children}:{children:React.ReactNode}){
 const supabase=getSupabaseClient();
 const[user,setUser]=useState<User|null>(null);
 const[profile,setProfile]=useState<Profile|null>(null);
 const[loading,setLoading]=useState(true);
 const[authOpen,setAuthOpen]=useState(false);

 async function ensureProfile(activeUser:User){
  if(!supabase)return;
  const {data,error}=await supabase.from('profiles').select('actor_id,username,display_name,bio,avatar_url,language').eq('actor_id',activeUser.id).maybeSingle();
  if(error)throw error;
  if(data){
   setProfile({username:data.username??'',displayName:data.display_name??'',bio:data.bio??'',avatarUrl:data.avatar_url??'',language:fromDbLanguage(data.language)});
   return;
  }
  const defaults=profileDefaults(activeUser);
  const {data:created,error:createError}=await supabase.from('profiles').upsert({actor_id:activeUser.id,username:defaults.username,display_name:defaults.displayName,bio:defaults.bio,avatar_url:defaults.avatarUrl||null,language:TO_DB_LANGUAGE[defaults.language],updated_at:new Date().toISOString()},{onConflict:'actor_id'}).select('username,display_name,bio,avatar_url,language').maybeSingle();
  if(createError)throw createError;
  if(created)setProfile({username:created.username??'',displayName:created.display_name??'',bio:created.bio??'',avatarUrl:created.avatar_url??'',language:fromDbLanguage(created.language)});
 }

 async function refreshProfile(){if(!supabase||!user){setProfile(null);return}await ensureProfile(user)}

 useEffect(()=>{
  if(!supabase){setLoading(false);return}
  let active=true;
  supabase.auth.getUser().then(({data})=>{if(!active)return;const next=data.user??null;setUser(next);setAuthenticatedActorId(next?.id??null);setLoading(false)}).catch(()=>{if(active){setUser(null);setAuthenticatedActorId(null);setLoading(false)}});
  const{data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{const next=session?.user??null;setUser(next);setAuthenticatedActorId(next?.id??null);if(!next)setProfile(null)});
  return()=>{active=false;subscription.unsubscribe()};
 },[supabase]);

 useEffect(()=>{if(user)void refreshProfile().catch(()=>setProfile(null))},[user]);

 async function signIn(email:string,password:string):Promise<AuthResult>{
  if(!supabase)return{error:new Error('Supabase is not configured.')};
  const normalizedEmail=email.trim().toLowerCase();
  if(!normalizedEmail||!password)return{error:new Error('Please enter your email and password.')};
  const{error}=await supabase.auth.signInWithPassword({email:normalizedEmail,password});
  if(error)return{error,message:error.message};
  setAuthOpen(false);
  return{error:null};
 }

 async function signUp(email:string,password:string,displayName:string):Promise<AuthResult>{
  if(!supabase)return{error:new Error('Supabase is not configured.')};
  const normalizedEmail=email.trim().toLowerCase();
  const cleanDisplay=displayName.trim();
  if(!normalizedEmail||!cleanDisplay||!password)return{error:new Error('Please complete all required fields.')};
  if(password.length<6)return{error:new Error('Password must be at least 6 characters.')};
  const{data,error}=await supabase.auth.signUp({email:normalizedEmail,password,options:{data:{display_name:cleanDisplay}}});
  if(error)return{error,message:error.message};
  if(data.user&&data.session){try{await ensureProfile(data.user)}catch(profileError){return{error:profileError instanceof Error?profileError:new Error('Could not create your profile.')}}setAuthOpen(false);return{error:null};}
  return{error:null,message:'CONFIRM_EMAIL'};
 }

 async function signOut(){if(!supabase)return;await supabase.auth.signOut();setUser(null);setProfile(null);setAuthenticatedActorId(null);setAuthOpen(false)}

 async function saveProfile(input:Profile){
  if(!user)throw new Error('Authentication required.');
  const normalized={...input,username:input.username.trim().replace(/^@/,'').toLowerCase(),displayName:input.displayName.trim(),bio:input.bio.trim().slice(0,300),avatarUrl:input.avatarUrl.trim().slice(0,500)};
  await completeProfile({username:normalized.username,displayName:normalized.displayName,bio:normalized.bio,avatarUrl:normalized.avatarUrl,language:TO_DB_LANGUAGE[normalized.language]});
  setProfile(normalized);
  await refreshProfile();
 }

 const value=useMemo<AuthContextValue>(()=>({user,profile,loading,authOpen,openAuth:()=>setAuthOpen(true),closeAuth:()=>setAuthOpen(false),profileComplete:Boolean(profile?.username&&profile?.displayName),needsOnboarding:Boolean(user&&!loading&&!profile),refreshProfile,signIn,signUp,signOut,saveProfile}),[user,profile,loading,authOpen]);
 return <C.Provider value={value}>{children}</C.Provider>;
}

export function useAuth(){const v=useContext(C);if(!v)throw new Error('useAuth must be used inside AuthProvider');return v}
