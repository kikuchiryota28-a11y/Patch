'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getActorId } from '@/lib/identity';
import { useAuth } from '@/context/AuthContext';

export default function ProfileRoute(){
 const router=useRouter();const{user}=useAuth();
 useEffect(()=>{router.replace(`/profile/${user?.id ?? getActorId()}`);},[router,user]);
 return <main className="min-h-screen grid place-items-center px-6"><div className="text-center"><div className="mx-auto mb-4 h-8 w-8 animate-pulse rounded-full bg-white/10"/><p className="text-sm font-semibold text-zinc-500">Opening your profile…</p></div></main>;
}
