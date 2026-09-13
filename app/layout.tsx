import type { Metadata } from 'next';
import './globals.css';
import { IssueProvider } from '@/context/IssueContext';

export const metadata: Metadata = {
  title: 'Patch! — Rewrite reality',
  description: 'Post an Issue. Let the internet patch it.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body><IssueProvider>{children}</IssueProvider></body>
    </html>
  );
}