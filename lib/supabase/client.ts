import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

type Database = {
  public: {
    Tables: {
      issues: { Row: { id:string; content:string; category:string; language:string; owner_actor_id:string; merged_patch_id:string|null; merged_at:string|null; created_at:string }; Insert: Record<string,unknown>; Update: Record<string,unknown>; Relationships: [] };
      patches: { Row: { id:string; issue_id:string; patched_text:string; patch_type:string; upvotes:number; author_actor_id:string; parent_patch_id:string|null; root_patch_id:string|null; depth:number; is_ai_generated:boolean; is_merged:boolean; created_at:string }; Insert: Record<string,unknown>; Update: Record<string,unknown>; Relationships: [] };
      profiles: { Row:{actor_id:string;username:string|null;display_name:string|null;bio:string|null;avatar_url:string|null;language:string;created_at:string;updated_at:string}; Insert:Record<string,unknown>; Update:Record<string,unknown>; Relationships:[] };
      notifications: { Row:{id:string;recipient_actor_id:string;type:string;title:string;message:string;issue_id:string|null;patch_id:string|null;milestone:number|null;created_at:string;read_at:string|null}; Insert:Record<string,unknown>; Update:Record<string,unknown>; Relationships:[] };
      contribution_events: { Row:{id:string;actor_id:string;event_type:string;issue_id:string|null;patch_id:string|null;created_at:string}; Insert:Record<string,unknown>; Update:Record<string,unknown>; Relationships:[] };
      badges: { Row:{key:string;name:string;description:string;icon:string|null;rule_type:string}; Insert:Record<string,unknown>; Update:Record<string,unknown>; Relationships:[] };
      user_badges: { Row:{actor_id:string;badge_key:string;earned_at:string}; Insert:Record<string,unknown>; Update:Record<string,unknown>; Relationships:[] };
      patch_bookmarks: { Row:{actor_id:string;patch_id:string;created_at:string}; Insert:Record<string,unknown>; Update:Record<string,unknown>; Relationships:[] };
      content_reports: { Row:{id:string;reporter_actor_id:string;target_type:string;target_id:string;reason:string;details:string;created_at:string}; Insert:Record<string,unknown>; Update:Record<string,unknown>; Relationships:[] };
    };
    Views: Record<string,never>;
    Functions:{
      increment_patch_upvotes:{Args:{p_patch_id:string;p_actor_id?:string};Returns:Database['public']['Tables']['patches']['Row']};
      merge_patch:{Args:{p_issue_id:string;p_patch_id:string;p_actor_id:string};Returns:Database['public']['Tables']['issues']['Row']};
      mark_notification_read:{Args:{p_notification_id:string;p_actor_id:string};Returns:undefined};
      create_patch:{Args:{p_issue_id:string;p_patched_text:string;p_patch_type:string;p_actor_id:string;p_parent_patch_id?:string|null;p_is_ai_generated?:boolean};Returns:Database['public']['Tables']['patches']['Row']};
      get_profile_stats:{Args:{p_actor_id:string};Returns:{issue_count:number;patch_count:number;merge_count:number;total_upvotes:number}[]};
      get_contribution_heatmap:{Args:{p_actor_id:string;p_since:string};Returns:{day:string;contributions:number}[]};
    };
    Enums:Record<string,never>; CompositeTypes:Record<string,never>;
  };
};

type TypedSupabaseClient=SupabaseClient<Database>;
let client:TypedSupabaseClient|null=null;
export function isSupabaseConfigured(){return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);}
export function getSupabaseClient():TypedSupabaseClient|null{if(!isSupabaseConfigured())return null;if(client)return client;client=createBrowserClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);return client;}
