import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';

type Database = {
  public: {
    Tables: {
      issues: {
        Row: {
          id: string;
          content: string;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          content: string;
          category?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          content?: string;
          category?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      patches: {
        Row: {
          id: string;
          issue_id: string;
          patched_text: string;
          patch_type: string;
          upvotes: number;
          is_ai_generated: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          issue_id: string;
          patched_text: string;
          patch_type: string;
          upvotes?: number;
          is_ai_generated?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          issue_id?: string;
          patched_text?: string;
          patch_type?: string;
          upvotes?: number;
          is_ai_generated?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      increment_patch_upvotes: {
        Args: { p_patch_id: string };
        Returns: {
          id: string;
          issue_id: string;
          patched_text: string;
          patch_type: string;
          upvotes: number;
          is_ai_generated: boolean;
          created_at: string;
        }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

type TypedSupabaseClient = SupabaseClient<Database>;

let client: TypedSupabaseClient | null = null;

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

export function getSupabaseClient(): TypedSupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (client) return client;

  client = createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );

  return client;
}
