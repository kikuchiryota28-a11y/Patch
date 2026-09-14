'use client';
import {createContext,useContext,useEffect,useMemo,useState} from 'react';
import type {Locale} from '@/lib/i18n';

export type {Locale} from '@/lib/i18n';

const en:Record<string,string>={'nav.home':'Home','nav.hall':'Hall of Fame','nav.gacha':'Gacha','nav.profile':'Profile','nav.settings':'Settings','nav.post':'Post Issue','auth.title':'Join Patch!','auth.email':'Email','auth.password':'Password','auth.signIn':'Sign in','auth.signUp':'Create account','auth.magic':'Send Magic Link','auth.or':'or','auth.close':'Close','settings.title':'Settings','settings.profile':'Profile','settings.displayName':'Display Name','settings.username':'Username Handle','settings.bio':'Bio / Self-Introduction','settings.avatar':'Avatar URL','settings.language':'App Settings / Language','settings.save':'Save changes','settings.saved':'Saved','settings.signin':'Sign in to edit your profile, save patches, and contribute.','profile.history':'Patch history','profile.saved':'Saved Patches','profile.badges':'Badges','profile.issues':'Issues','profile.patches':'Patches','profile.merges':'Merges','profile.upvotes':'Upvotes','profile.empty':'No patches yet.'};
const ja:Record<string,string>={'nav.home':'ホーム','nav.hall':'殿堂入り','nav.gacha':'ガチャ','nav.profile':'プロフィール','nav.settings':'設定','nav.post':'Issueを投稿','auth.title':'Patch!に参加','auth.email':'メールアドレス','auth.password':'パスワード','auth.signIn':'ログイン','auth.signUp':'アカウント作成','auth.magic':'マジックリンクを送る','auth.or':'または','auth.close':'閉じる','settings.title':'設定','settings.profile':'プロフィール','settings.displayName':'表示名','settings.username':'ユーザーネーム','settings.bio':'自己紹介','settings.avatar':'アバターURL','settings.language':'アプリ設定 / 言語設定','settings.save':'変更を保存','settings.saved':'保存しました','settings.signin':'プロフィール編集、Patch保存、投稿にはログインしてください。','profile.history':'Patch履歴','profile.saved':'保存したPatch','profile.badges':'バッジ','profile.issues':'Issue','profile.patches':'Patch','profile.merges':'マージ','profile.upvotes':'Upvote','profile.empty':'まだPatchがありません。'};
const es:Record<string,string>={'nav.home':'Inicio','nav.hall':'Salón de la Fama','nav.gacha':'Gacha','nav.profile':'Perfil','nav.settings':'Ajustes','nav.post':'Publicar Issue','auth.title':'Únete a Patch!','auth.email':'Correo','auth.password':'Contraseña','auth.signIn':'Iniciar sesión','auth.signUp':'Crear cuenta','auth.magic':'Enviar enlace mágico','auth.or':'o','auth.close':'Cerrar','settings.title':'Ajustes','settings.profile':'Perfil','settings.displayName':'Nombre visible','settings.username':'Nombre de usuario','settings.bio':'Biografía','settings.avatar':'URL del avatar','settings.language':'Ajustes de la app / Idioma','settings.save':'Guardar cambios','settings.saved':'Guardado','settings.signin':'Inicia sesión para editar tu perfil, guardar Patches y contribuir.','profile.history':'Historial de Patches','profile.saved':'Patches guardados','profile.badges':'Insignias','profile.issues':'Issues','profile.patches':'Patches','profile.merges':'Fusiones','profile.upvotes':'Upvotes','profile.empty':'Aún no hay Patches.'};
const zh:Record<string,string>={'nav.home':'首页','nav.hall':'名人堂','nav.gacha':'扭蛋','nav.profile':'个人资料','nav.settings':'设置','nav.post':'发布 Issue','auth.title':'加入 Patch!','auth.email':'邮箱','auth.password':'密码','auth.signIn':'登录','auth.signUp':'创建账号','auth.magic':'发送魔法链接','auth.or':'或','auth.close':'关闭','settings.title':'设置','settings.profile':'个人资料','settings.displayName':'显示名称','settings.username':'用户名','settings.bio':'个人简介','settings.avatar':'头像 URL','settings.language':'应用设置 / 语言','settings.save':'保存更改','settings.saved':'已保存','settings.signin':'登录后即可编辑资料、保存 Patch 并参与社区。','profile.history':'Patch 历史','profile.saved':'已保存的 Patch','profile.badges':'徽章','profile.issues':'Issue','profile.patches':'Patch','profile.merges':'合并','profile.upvotes':'赞','profile.empty':'还没有 Patch。'};
const dict={en,ja,es,zh};
type Ctx={locale:Locale;setLocale:(x:Locale)=>void;t:(k:string)=>string};
const C=createContext<Ctx|null>(null);

export function I18nProvider({children}:{children:React.ReactNode}){
  const[locale,setLocaleState]=useState<Locale>('en');
  useEffect(()=>{
    const c=document.cookie.match(/(?:^|; )patch-locale=([^;]+)/)?.[1];
    const l=window.localStorage.getItem('patch-locale');
    const x=(l||c||navigator.language).toLowerCase().split('-')[0];
    setLocaleState(x==='ja'||x==='es'||x==='zh'?x:'en');
  },[]);
  const setLocale=(x:Locale)=>{setLocaleState(x);document.cookie=`patch-locale=${x}; Path=/; Max-Age=31536000; SameSite=Lax`;window.localStorage.setItem('patch-locale',x);};
  const t=(k:string)=>dict[locale][k]??dict.en[k]??k;
  return <C.Provider value={useMemo(()=>({locale,setLocale,t}),[locale])}>{children}</C.Provider>;
}
export function useI18n(){const v=useContext(C);if(!v)throw new Error('useI18n must be used inside I18nProvider');return v}
