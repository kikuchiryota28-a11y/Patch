-- Patch! schema. Existing installations should run the additive auth/profile migration in patch_auth_profile_fix.sql.
create extension if not exists pgcrypto;

create table if not exists public.issues (id uuid primary key default gen_random_uuid(),content text not null,category text not null default 'General',owner_actor_id text not null default 'anonymous',merged_patch_id uuid,merged_at timestamptz,created_at timestamptz not null default now());
create table if not exists public.patches (id uuid primary key default gen_random_uuid(),issue_id uuid not null references public.issues(id) on delete cascade,patched_text text not null,patch_type text not null default 'Casual',upvotes integer not null default 0 check (upvotes >= 0),author_actor_id text not null default 'anonymous',parent_patch_id uuid references public.patches(id) on delete cascade,root_patch_id uuid,depth integer not null default 0 check (depth >= 0),is_ai_generated boolean not null default false,is_merged boolean not null default false,created_at timestamptz not null default now());
alter table public.issues add column if not exists owner_actor_id text not null default 'anonymous';
alter table public.issues add column if not exists merged_patch_id uuid references public.patches(id) on delete set null;
alter table public.issues add column if not exists merged_at timestamptz;
alter table public.patches add column if not exists author_actor_id text not null default 'anonymous';
alter table public.patches add column if not exists parent_patch_id uuid references public.patches(id) on delete cascade;
alter table public.patches add column if not exists root_patch_id uuid;
alter table public.patches add column if not exists depth integer not null default 0;
alter table public.patches add column if not exists is_ai_generated boolean not null default false;
alter table public.patches add column if not exists is_merged boolean not null default false;

create index if not exists patches_parent_idx on public.patches(parent_patch_id);
create index if not exists patches_root_idx on public.patches(root_patch_id);
create index if not exists patches_author_idx on public.patches(author_actor_id);
create index if not exists patches_votes_idx on public.patches(upvotes desc);

create table if not exists public.notifications (id uuid primary key default gen_random_uuid(),recipient_actor_id text not null,type text not null check (type in ('patch_submitted','upvote_milestone','merged')),title text not null,message text not null,issue_id uuid references public.issues(id) on delete cascade,patch_id uuid references public.patches(id) on delete cascade,milestone integer,created_at timestamptz not null default now(),read_at timestamptz);
create index if not exists notifications_recipient_created_idx on public.notifications(recipient_actor_id,created_at desc);
create unique index if not exists notifications_milestone_unique on public.notifications(recipient_actor_id,patch_id,type,milestone) where type='upvote_milestone';

create table if not exists public.profiles (actor_id text primary key,username text not null,display_name text not null,bio text,avatar_url text,language text not null default 'EN',created_at timestamptz not null default now(),updated_at timestamptz not null default now());
alter table public.profiles add column if not exists username text;
alter table public.profiles add column if not exists language text not null default 'EN';
update public.profiles set username=coalesce(nullif(username,''),'user_'||left(regexp_replace(actor_id,'[^a-zA-Z0-9]','','g'),10)) where username is null or username='';
alter table public.profiles alter column username set not null;
alter table public.profiles drop constraint if exists profiles_language_check;
alter table public.profiles add constraint profiles_language_check check (language in ('EN','JA'));
create unique index if not exists profiles_username_unique on public.profiles(lower(username));

create table if not exists public.contribution_events (id uuid primary key default gen_random_uuid(),actor_id text not null,event_type text not null check (event_type in ('issue_created','patch_created','merge_created')),issue_id uuid references public.issues(id) on delete cascade,patch_id uuid references public.patches(id) on delete cascade,created_at timestamptz not null default now());
create index if not exists contribution_events_actor_date_idx on public.contribution_events(actor_id,created_at desc);
create index if not exists contribution_events_date_idx on public.contribution_events(created_at desc);
create table if not exists public.badges (key text primary key,name text not null,description text not null,icon text,rule_type text not null);
create table if not exists public.user_badges (actor_id text not null,badge_key text not null references public.badges(key) on delete cascade,earned_at timestamptz not null default now(),primary key(actor_id,badge_key));
create table if not exists public.patch_bookmarks (actor_id text not null,patch_id uuid not null references public.patches(id) on delete cascade,created_at timestamptz not null default now(),primary key(actor_id,patch_id));
create table if not exists public.content_reports (id uuid primary key default gen_random_uuid(),reporter_actor_id text not null,target_type text not null,target_id uuid not null,reason text not null,details text not null default '',created_at timestamptz not null default now(),unique(reporter_actor_id,target_type,target_id));

alter table public.issues enable row level security;alter table public.patches enable row level security;alter table public.notifications enable row level security;alter table public.profiles enable row level security;alter table public.contribution_events enable row level security;alter table public.user_badges enable row level security;alter table public.patch_bookmarks enable row level security;alter table public.content_reports enable row level security;

drop policy if exists "Profiles are readable" on public.profiles;drop policy if exists "Profiles are insertable" on public.profiles;drop policy if exists "Profiles are updateable" on public.profiles;
create policy "Profiles are publicly readable" on public.profiles for select to anon,authenticated using (true);
create policy "Profiles can be inserted by owner" on public.profiles for insert to authenticated with check ((select auth.uid())::text=actor_id);
create policy "Profiles can be updated by owner" on public.profiles for update to authenticated using ((select auth.uid())::text=actor_id) with check ((select auth.uid())::text=actor_id);
grant select on public.profiles to anon,authenticated;grant insert,update on public.profiles to authenticated;

create or replace function public.record_contribution(p_actor_id text,p_event_type text,p_issue_id uuid default null,p_patch_id uuid default null) returns void language plpgsql security invoker set search_path=public as $$ begin insert into public.contribution_events(actor_id,event_type,issue_id,patch_id) values(p_actor_id,p_event_type,p_issue_id,p_patch_id); end; $$;
