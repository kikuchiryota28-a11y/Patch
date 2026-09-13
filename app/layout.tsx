import type { Metadata } from 'next';
import './globals.css';
import { IssueProvider } from '@/context/IssueContext';
import { AuthProvider } from '@/context/AuthContext';
import { AuthModal } from '@/components/AuthModal';

export const metadata: Metadata = { title: 'Patch! — Rewrite reality', description: 'Post an Issue. Let the internet patch it.' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="dark"><body><AuthProvider><IssueProvider>{children}</IssueProvider><AuthModal/></AuthProvider></body></html>;
}
