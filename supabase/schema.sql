-- Patch! Phase 4 engagement schema
create extension if not exists pgcrypto;

create table if not exists public.issues (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  category text not null default 'General',
  owner_actor_id text not null default 'anonymous',
  merged_patch_id uuid,
  merged_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.patches (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references public.issues(id) on delete cascade,
  patched_text text not null,
  patch_type text not null default 'Casual',
  upvotes integer not null default 0 check (upvotes >= 0),
  author_actor_id text not null default 'anonymous',
  is_ai_generated boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.issues add column if not exists owner_actor_id text not null default 'anonymous';
alter table public.issues add column if not exists merged_patch_id uuid references public.patches(id) on delete set null;
alter table public.issues add column if not exists merged_at timestamptz;
alter table public.patches add column if not exists author_actor_id text not null default 'anonymous';
alter table public.patches add column if not exists is_ai_generated boolean not null default false;

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_actor_id text not null,
  type text not null check (type in ('patch_submitted','upvote_milestone','merged')),
  title text not null,
  message text not null,
  issue_id uuid references public.issues(id) on delete cascade,
  patch_id uuid references public.patches(id) on delete cascade,
  milestone integer,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index if not exists notifications_recipient_created_idx on public.notifications(recipient_actor_id, created_at desc);
create unique index if not exists notifications_milestone_unique on public.notifications(recipient_actor_id, patch_id, type, milestone) where type = 'upvote_milestone';

alter table public.issues enable row level security;
alter table public.patches enable row level security;
alter table public.notifications enable row level security;

create policy "Issues are publicly readable" on public.issues for select to anon, authenticated using (true);
create policy "Issues are publicly insertable" on public.issues for insert to anon, authenticated with check (true);
create policy "Patches are publicly readable" on public.patches for select to anon, authenticated using (true);
create policy "Patches are publicly insertable" on public.patches for insert to anon, authenticated with check (true);
create policy "Patches can increment their upvotes" on public.patches for update to anon, authenticated using (true) with check (upvotes >= 0);
create policy "Notifications are readable" on public.notifications for select to anon, authenticated using (true);
create policy "Notifications are updateable" on public.notifications for update to anon, authenticated using (true) with check (true);

grant select, insert on public.issues to anon, authenticated;
grant select, insert, update on public.patches to anon, authenticated;
grant select, update on public.notifications to anon, authenticated;

create or replace function public.notify_patch_submission()
returns trigger language plpgsql security invoker set search_path = public as $$
declare issue_owner text;
begin
  if new.is_ai_generated then return new; end if;
  select owner_actor_id into issue_owner from public.issues where id = new.issue_id;
  if issue_owner is not null and issue_owner <> new.author_actor_id then
    insert into public.notifications(recipient_actor_id,type,title,message,issue_id,patch_id)
    values(issue_owner,'patch_submitted','New Patch','Someone just patched your Issue.',new.issue_id,new.id);
  end if;
  return new;
end;
$$;
drop trigger if exists patches_notify_submission on public.patches;
create trigger patches_notify_submission after insert on public.patches for each row execute function public.notify_patch_submission();

create or replace function public.increment_patch_upvotes(p_patch_id uuid, p_actor_id text default 'anonymous')
returns public.patches language plpgsql security invoker set search_path = public as $$
declare updated_patch public.patches%rowtype; issue_title text;
begin
  update public.patches set upvotes = upvotes + 1 where id = p_patch_id returning * into updated_patch;
  if updated_patch.id is null then return null; end if;
  if updated_patch.upvotes in (10,25,50,100) and updated_patch.author_actor_id <> coalesce(p_actor_id,'anonymous') then
    select split_part(content, E'\n', 1) into issue_title from public.issues where id = updated_patch.issue_id;
    insert into public.notifications(recipient_actor_id,type,title,message,issue_id,patch_id,milestone)
    values(updated_patch.author_actor_id,'upvote_milestone',format('%s upvotes!',updated_patch.upvotes),format('Your Patch reached %s upvotes on “%s”.',updated_patch.upvotes,coalesce(issue_title,'an Issue')),updated_patch.issue_id,updated_patch.id,updated_patch.upvotes)
    on conflict do nothing;
  end if;
  return updated_patch;
end;
$$;
grant execute on function public.increment_patch_upvotes(uuid,text) to anon, authenticated;

create or replace function public.merge_patch(p_issue_id uuid, p_patch_id uuid, p_actor_id text)
returns public.issues language plpgsql security invoker set search_path = public as $$
declare issue_row public.issues%rowtype; patch_author text;
begin
  select * into issue_row from public.issues where id = p_issue_id and owner_actor_id = p_actor_id;
  if issue_row.id is null then raise exception 'Only the Issue creator can merge a Patch.'; end if;
  select author_actor_id into patch_author from public.patches where id=p_patch_id and issue_id=p_issue_id;
  if patch_author is null then raise exception 'Patch does not belong to this Issue.'; end if;
  update public.issues set merged_patch_id=p_patch_id, merged_at=now() where id=p_issue_id returning * into issue_row;
  if patch_author <> p_actor_id then insert into public.notifications(recipient_actor_id,type,title,message,issue_id,patch_id) values(patch_author,'merged','Patch merged!','Your Patch was selected as the official winning solution.',p_issue_id,p_patch_id); end if;
  return issue_row;
end;
$$;
grant execute on function public.merge_patch(uuid,uuid,text) to anon, authenticated;

create or replace function public.mark_notification_read(p_notification_id uuid,p_actor_id text)
returns void language sql security invoker set search_path=public as $$
  update public.notifications set read_at=coalesce(read_at,now()) where id=p_notification_id and recipient_actor_id=p_actor_id;
$$;
grant execute on function public.mark_notification_read(uuid,text) to anon, authenticated;
