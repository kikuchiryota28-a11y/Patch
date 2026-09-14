'use client';
import {useEffect} from 'react';
import {LanguageProvider,useLanguage} from '@/context/LanguageContext';
import type {Language} from '@/lib/dictionary';
export type Locale=Language;
export function I18nProvider({children}:{children:React.ReactNode}){return <LanguageProvider>{children}</LanguageProvider>}
export function useI18n(){const{language,setLanguage,dictionary}=useLanguage();useEffect(()=>{document.documentElement.lang=language},[language]);return{locale:language,setLocale:setLanguage,dictionary,t:(key:string)=>{const[a,b]=key.split('.',2);const section=dictionary[a as keyof typeof dictionary] as Record<string,unknown>|undefined;const value=section?.[b??''];return typeof value==='string'?value:key}}}
