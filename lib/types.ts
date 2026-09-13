export type PatchStyle = 'Business Formal' | 'Psychopath / Chaos' | 'Poetic / Chunnibyou' | 'Casual' | 'Corporate Passive-Aggressive';
export type NotificationType = 'patch_submitted' | 'upvote_milestone' | 'merged';
export type ContributionEventType = 'issue_created' | 'patch_created' | 'merge_created';

export interface PatchItem {
  id: string;
  issueId: string;
  text: string;
  style: PatchStyle;
  author: string;
  authorActorId?: string;
  votes: number;
  createdAt: string;
  parentPatchId?: string | null;
  rootPatchId?: string | null;
  depth: number;
  isAiGenerated?: boolean;
  isMerged?: boolean;
}

export interface Issue {
  id: string;
  title: string;
  body: string;
  author: string;
  ownerActorId?: string;
  createdAt: string;
  category: string;
  patches: PatchItem[];
  mergedPatchId?: string | null;
  mergedAt?: string | null;
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  issueId?: string | null;
  patchId?: string | null;
  milestone?: number | null;
  createdAt: string;
  readAt?: string | null;
}

export interface Profile { actorId: string; displayName: string; bio?: string | null; avatarUrl?: string | null; createdAt: string; }
export interface ProfileStats { issueCount: number; patchCount: number; mergeCount: number; totalUpvotes: number; }
export interface ContributionDay { day: string; contributions: number; }
export interface Badge { key: string; name: string; description: string; icon?: string | null; earnedAt?: string | null; }
