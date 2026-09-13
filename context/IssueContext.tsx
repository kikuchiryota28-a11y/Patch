'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import type { Issue, PatchItem, PatchStyle } from '@/lib/types';
import { initialIssues } from '@/lib/mockData';

type NewIssue = { title: string; body: string };
type NewPatch = { issueId: string; text: string; style: PatchStyle };

type IssueContextValue = {
  issues: Issue[];
  addIssue: (input: NewIssue) => string;
  addPatch: (input: NewPatch) => void;
  getIssue: (id: string) => Issue | undefined;
};

const IssueContext = createContext<IssueContextValue | null>(null);

export function IssueProvider({ children }: { children: React.ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>(initialIssues);

  const addIssue = (input: NewIssue) => {
    const id = `issue-${crypto.randomUUID()}`;
    const issue: Issue = {
      id,
      title: input.title.trim(),
      body: input.body.trim(),
      author: 'you',
      createdAt: 'just now',
      patches: [],
    };
    setIssues((current) => [issue, ...current]);
    return id;
  };

  const addPatch = (input: NewPatch) => {
    const patch: PatchItem = {
      id: `patch-${crypto.randomUUID()}`,
      text: input.text.trim(),
      style: input.style,
      author: 'you',
      votes: 0,
    };
    setIssues((current) =>
      current.map((issue) =>
        issue.id === input.issueId ? { ...issue, patches: [patch, ...issue.patches] } : issue,
      ),
    );
  };

  const value = useMemo<IssueContextValue>(
    () => ({
      issues,
      addIssue,
      addPatch,
      getIssue: (id) => issues.find((issue) => issue.id === id),
    }),
    [issues],
  );

  return <IssueContext.Provider value={value}>{children}</IssueContext.Provider>;
}

export function useIssues() {
  const context = useContext(IssueContext);
  if (!context) throw new Error('useIssues must be used inside IssueProvider');
  return context;
}