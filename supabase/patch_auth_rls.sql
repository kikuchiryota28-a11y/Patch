-- Patch! auth/RLS hardening migration.
-- Targets the existing Patch schema used by the application.

begin;

alter table public.profiles enable row level security;
alter table public.issues enable row level security;
alter table public.patches enable row level security;
alter table public.notifications enable row level security;
alter table public.patch_bookmarks enable row level security;
alter table public.content_reports enable row level security;

drop policy if exists profiles_select_public on public.profiles;
create policy profiles_select_public on public.profiles for select to anon, authenticated using (true);
drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles for insert to authenticated with check (auth.uid() = actor_id);
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update to authenticated using (auth.uid() = actor_id) with check (auth.uid() = actor_id);

drop policy if exists issues_select_public on public.issues;
create policy issues_select_public on public.issues for select to anon, authenticated using (true);
drop policy if exists issues_insert_own on public.issues;
create policy issues_insert_own on public.issues for insert to authenticated with check (auth.uid() = owner_actor_id);
drop policy if exists issues_update_own on public.issues;
create policy issues_update_own on public.issues for update to authenticated using (auth.uid() = owner_actor_id) with check (auth.uid() = owner_actor_id);
drop policy if exists issues_delete_own on public.issues;
create policy issues_delete_own on public.issues for delete to authenticated using (auth.uid() = owner_actor_id);

drop policy if exists patches_select_public on public.patches;
create policy patches_select_public on public.patches for select to anon, authenticated using (true);
drop policy if exists patches_insert_own on public.patches;
create policy patches_insert_own on public.patches for insert to authenticated with check (auth.uid() = author_actor_id);
drop policy if exists patches_update_own on public.patches;
create policy patches_update_own on public.patches for update to authenticated using (auth.uid() = author_actor_id) with check (auth.uid() = author_actor_id);
drop policy if exists patches_delete_own on public.patches;
create policy patches_delete_own on public.patches for delete to authenticated using (auth.uid() = author_actor_id);

drop policy if exists notifications_select_own on public.notifications;
create policy notifications_select_own on public.notifications for select to authenticated using (auth.uid() = recipient_actor_id);
drop policy if exists notifications_update_own on public.notifications;
create policy notifications_update_own on public.notifications for update to authenticated using (auth.uid() = recipient_actor_id) with check (auth.uid() = recipient_actor_id);

drop policy if exists patch_bookmarks_select_own on public.patch_bookmarks;
create policy patch_bookmarks_select_own on public.patch_bookmarks for select to authenticated using (auth.uid() = actor_id);
drop policy if exists patch_bookmarks_insert_own on public.patch_bookmarks;
create policy patch_bookmarks_insert_own on public.patch_bookmarks for insert to authenticated with check (auth.uid() = actor_id);
drop policy if exists patch_bookmarks_delete_own on public.patch_bookmarks;
create policy patch_bookmarks_delete_own on public.patch_bookmarks for delete to authenticated using (auth.uid() = actor_id);

drop policy if exists content_reports_insert_own on public.content_reports;
create policy content_reports_insert_own on public.content_reports for insert to authenticated with check (auth.uid() = reporter_actor_id);
drop policy if exists content_reports_select_own on public.content_reports;
create policy content_reports_select_own on public.content_reports for select to authenticated using (auth.uid() = reporter_actor_id);

-- Create a guaranteed-unique placeholder username. The onboarding flow can replace it.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (actor_id, username, display_name, avatar_url, language, updated_at)
  values (
    new.id,
    'user_' || substr(replace(new.id::text, '-', ''), 1, 19),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Patchsmith'),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'),
    'EN',
    now()
  )
  on conflict (actor_id) do update
  set avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
      updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

grant select on public.profiles to anon, authenticated;
grant select on public.issues to anon, authenticated;
grant select on public.patches to anon, authenticated;
grant select, update on public.notifications to authenticated;
grant select, insert, delete on public.patch_bookmarks to authenticated;
grant select, insert on public.content_reports to authenticated;
grant insert, update on public.profiles to authenticated;
grant insert, update, delete on public.issues to authenticated;
grant insert, update, delete on public.patches to authenticated;

commit;
