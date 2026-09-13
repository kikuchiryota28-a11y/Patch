export type PatchStyle =
  | 'Business Formal'
  | 'Psychopath / Chaos'
  | 'Poetic / Chunnibyou'
  | 'Casual'
  | 'Corporate Passive-Aggressive';

export type NotificationType = 'patch_submitted' | 'upvote_milestone' | 'merged';

export interface PatchItem {
  id: string;
  text: string;
  style: PatchStyle;
  author: string;
  authorActorId?: string;
  votes: number;
  createdAt: string;
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
  createdAt: string;
  readAt?: string | null;
}
