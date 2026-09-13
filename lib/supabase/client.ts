import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';

type Database = {
  public: {
    Tables: {
      issues: {
        Row: { id: string; content: string; category: string; owner_actor_id: string; merged_patch_id: string | null; merged_at: string | null; created_at: string };
        Insert: { id?: string; content: string; category?: string; owner_actor_id?: string; merged_patch_id?: string | null; merged_at?: string | null; created_at?: string };
        Update: { id?: string; content?: string; category?: string; owner_actor_id?: string; merged_patch_id?: string | null; merged_at?: string | null; created_at?: string };
        Relationships: [];
      };
      patches: {
        Row: { id: string; issue_id: string; patched_text: string; patch_type: string; upvotes: number; author_actor_id: string; is_ai_generated: boolean; created_at: string };
        Insert: { id?: string; issue_id: string; patched_text: string; patch_type: string; upvotes?: number; author_actor_id?: string; is_ai_generated?: boolean; created_at?: string };
        Update: { id?: string; issue_id?: string; patched_text?: string; patch_type?: string; upvotes?: number; author_actor_id?: string; is_ai_generated?: boolean; created_at?: string };
        Relationships: [];
      };
      notifications: {
        Row: { id: string; recipient_actor_id: string; type: string; title: string; message: string; issue_id: string | null; patch_id: string | null; milestone: number | null; created_at: string; read_at: string | null };
        Insert: { id?: string; recipient_actor_id: string; type: string; title: string; message: string; issue_id?: string | null; patch_id?: string | null; milestone?: number | null; created_at?: string; read_at?: string | null };
        Update: { id?: string; recipient_actor_id?: string; type?: string; title?: string; message?: string; issue_id?: string | null; patch_id?: string | null; milestone?: number | null; created_at?: string; read_at?: string | null };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      increment_patch_upvotes: { Args: { p_patch_id: string; p_actor_id?: string }; Returns: Database['public']['Tables']['patches']['Row'][] };
      merge_patch: { Args: { p_issue_id: string; p_patch_id: string; p_actor_id: string }; Returns: Database['public']['Tables']['issues']['Row'][] };
      mark_notification_read: { Args: { p_notification_id: string; p_actor_id: string }; Returns: undefined };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

type TypedSupabaseClient = SupabaseClient<Database>;
let client: TypedSupabaseClient | null = null;

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export function getSupabaseClient(): TypedSupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (client) return client;
  client = createSupabaseClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
