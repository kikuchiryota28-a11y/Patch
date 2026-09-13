export type PatchStyle =
  | 'Business Formal'
  | 'Psychopath / Chaos'
  | 'Poetic / Chunnibyou'
  | 'Casual'
  | 'Corporate Passive-Aggressive';

export interface PatchItem {
  id: string;
  text: string;
  style: PatchStyle;
  author: string;
  votes: number;
  createdAt: string;
  isAiGenerated?: boolean;
}

export interface Issue {
  id: string;
  title: string;
  body: string;
  author: string;
  createdAt: string;
  category: string;
  patches: PatchItem[];
}
