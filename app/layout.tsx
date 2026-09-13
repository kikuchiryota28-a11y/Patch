import type { Metadata } from 'next';
import './globals.css';
import { IssueProvider } from '@/context/IssueContext';
import { AuthProvider } from '@/context/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { Navigation } from '@/components/Navigation';

export const metadata: Metadata = { title: 'Patch! — Rewrite reality', description: 'Post an Issue. Let the internet patch it.' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="dark"><body className="bg-zinc-950 text-white antialiased"><AuthProvider><IssueProvider><Navigation/><div className="min-h-screen md:pl-[248px]"><div className="pb-20 md:pb-0">{children}</div></div></IssueProvider><AuthModal/></AuthProvider></body></html>;
}
