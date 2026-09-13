import type {Metadata} from 'next';
import './globals.css';
import {IssueProvider} from '@/context/IssueContext';
import {AuthProvider} from '@/context/AuthContext';
import {AuthModal} from '@/components/AuthModal';
import {Navigation} from '@/components/Navigation';
import {I18nProvider} from '@/lib/i18n-client';
export const metadata:Metadata={title:'Patch! — Rewrite reality',description:'Post an Issue. Let the internet patch it.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" className="dark"><body className="bg-zinc-950 text-white antialiased"><I18nProvider><AuthProvider><IssueProvider><Navigation/><div className="min-h-screen md:pl-[248px]"><main className="min-h-screen pt-20 pb-28 px-4 md:px-8 md:pt-8 md:pb-10">{children}</main></div></IssueProvider><AuthModal/></AuthProvider></I18nProvider></body></html>}
