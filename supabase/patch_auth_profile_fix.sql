-- Run this once against the existing Supabase project. This is additive and safe for existing profiles.
alter table public.profiles add column if not exists username text;
alter table public.profiles add column if not exists language text not null default 'EN';
update public.profiles set username='user_'||left(regexp_replace(actor_id,'[^a-zA-Z0-9]','','g'),10) where username is null or username='';
alter table public.profiles alter column username set not null;
alter table public.profiles drop constraint if exists profiles_language_check;
alter table public.profiles add constraint profiles_language_check check(language in ('EN','JA'));
create unique index if not exists profiles_username_unique on public.profiles(lower(username));

drop policy if exists "Profiles are insertable" on public.profiles;
drop policy if exists "Profiles are updateable" on public.profiles;
create policy "Profiles are insertable" on public.profiles for insert to authenticated with check((select auth.uid())::text=actor_id);
create policy "Profiles are updateable" on public.profiles for update to authenticated using((select auth.uid())::text=actor_id) with check((select auth.uid())::text=actor_id);
revoke insert,update on public.profiles from anon;
grant insert,update on public.profiles to authenticated;
