-- Patch! Phase 2 + AI Auto-Patch schema
create extension if not exists pgcrypto;

create table if not exists public.issues (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  category text not null default 'General',
  created_at timestamptz not null default now()
);

create table if not exists public.patches (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references public.issues(id) on delete cascade,
  patched_text text not null,
  patch_type text not null default 'Casual',
  upvotes integer not null default 0 check (upvotes >= 0),
  is_ai_generated boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.issues enable row level security;
alter table public.patches enable row level security;
alter table public.patches add column if not exists is_ai_generated boolean not null default false;

create policy "Issues are publicly readable"
  on public.issues for select to anon, authenticated using (true);

create policy "Issues are publicly insertable"
  on public.issues for insert to anon, authenticated with check (true);

create policy "Patches are publicly readable"
  on public.patches for select to anon, authenticated using (true);

create policy "Patches are publicly insertable"
  on public.patches for insert to anon, authenticated with check (true);

create policy "Patches can increment their upvotes"
  on public.patches for update to anon, authenticated
  using (true)
  with check (upvotes >= 0);

grant select, insert on public.issues to anon, authenticated;
grant select, insert, update on public.patches to anon, authenticated;

create or replace function public.increment_patch_upvotes(p_patch_id uuid)
returns public.patches
language sql
security invoker
set search_path = public
as $$
  update public.patches
  set upvotes = upvotes + 1
  where id = p_patch_id
  returning *;
$$;

grant execute on function public.increment_patch_upvotes(uuid) to anon, authenticated;
