-- =============================================================
-- Gilang Store — initial schema
-- Jalankan sekali di Supabase SQL Editor (atau lewat MCP/CLI).
-- =============================================================

-- -------------------------------------------------------------
-- 1. PROFILES  (role admin untuk web admin)
-- -------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  full_name  text,
  role       text not null default 'viewer' check (role in ('admin', 'viewer')),
  created_at timestamptz not null default now()
);

-- Dipakai oleh semua policy tulis. SECURITY DEFINER supaya pembacaan
-- profiles di dalam policy tidak memicu rekursi RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

-- Setiap user baru di auth.users otomatis dapat baris profiles.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill user yang sudah terlanjur dibuat sebelum migration ini.
insert into public.profiles (id, email)
select u.id, u.email
from auth.users u
on conflict (id) do nothing;

-- -------------------------------------------------------------
-- 2. APPS
-- -------------------------------------------------------------
create table if not exists public.apps (
  id                  uuid primary key default gen_random_uuid(),
  slug                text not null unique,
  name                text not null,
  tagline             text,
  description         text,
  category            text not null default 'Web Development',
  platform            text not null default 'mobile'
                        check (platform in ('mobile', 'web', 'cli', 'skills-ai')),
  year                int,
  tech_stack          text[] not null default '{}',
  icon_url            text,
  gradient            text not null default 'from-blue-500 to-cyan-400',
  video_url           text,
  rating              numeric(2, 1) not null default 0 check (rating >= 0 and rating <= 5),
  content_rating      text not null default '12+',
  has_iap             boolean not null default false,
  developer           text not null default 'Gilang Store',
  version             text,
  download_url        text,
  download_file_path  text,
  download_size_bytes bigint,
  download_count      int not null default 0,
  status              text not null default 'draft' check (status in ('draft', 'published')),
  is_featured         boolean not null default false,
  sort_order          int not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  -- App yang sudah published wajib punya tujuan download (file atau URL).
  constraint apps_published_needs_download check (
    status <> 'published'
    or download_url is not null
    or download_file_path is not null
  )
);

create index if not exists apps_status_idx     on public.apps (status);
create index if not exists apps_platform_idx   on public.apps (platform);
create index if not exists apps_category_idx   on public.apps (category);
create index if not exists apps_sort_order_idx on public.apps (sort_order, created_at desc);

-- -------------------------------------------------------------
-- 3. APP SCREENSHOTS
-- -------------------------------------------------------------
create table if not exists public.app_screenshots (
  id         uuid primary key default gen_random_uuid(),
  app_id     uuid not null references public.apps (id) on delete cascade,
  image_url  text not null,
  caption    text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists app_screenshots_app_id_idx
  on public.app_screenshots (app_id, sort_order);

-- -------------------------------------------------------------
-- 4. APP LINKS
-- -------------------------------------------------------------
create table if not exists public.app_links (
  id         uuid primary key default gen_random_uuid(),
  app_id     uuid not null references public.apps (id) on delete cascade,
  type       text not null default 'website'
               check (type in ('github', 'launch', 'npm', 'docs', 'website')),
  url        text not null,
  label      text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists app_links_app_id_idx
  on public.app_links (app_id, sort_order);

-- -------------------------------------------------------------
-- 5. BANNERS  (carousel featured di header)
-- -------------------------------------------------------------
create table if not exists public.banners (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  subtitle   text,
  image_url  text,
  link_url   text,
  gradient   text not null default 'from-blue-600 via-indigo-600 to-purple-700',
  sort_order int not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists banners_active_idx on public.banners (is_active, sort_order);

-- -------------------------------------------------------------
-- 6. updated_at trigger
-- -------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists apps_set_updated_at on public.apps;
create trigger apps_set_updated_at
  before update on public.apps
  for each row execute function public.set_updated_at();

drop trigger if exists banners_set_updated_at on public.banners;
create trigger banners_set_updated_at
  before update on public.banners
  for each row execute function public.set_updated_at();

-- -------------------------------------------------------------
-- 7. increment_download  (dipanggil /api/download/[slug])
-- -------------------------------------------------------------
create or replace function public.increment_download(app_slug text)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.apps
  set download_count = download_count + 1
  where slug = app_slug
    and status = 'published';
$$;

grant execute on function public.increment_download(text) to anon, authenticated;

-- -------------------------------------------------------------
-- 8. ROW LEVEL SECURITY
-- -------------------------------------------------------------
alter table public.profiles        enable row level security;
alter table public.apps            enable row level security;
alter table public.app_screenshots enable row level security;
alter table public.app_links       enable row level security;
alter table public.banners         enable row level security;

-- profiles ------------------------------------------------------
drop policy if exists "profiles: read own"    on public.profiles;
drop policy if exists "profiles: admin read"  on public.profiles;
drop policy if exists "profiles: admin write" on public.profiles;

create policy "profiles: read own"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy "profiles: admin read"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

create policy "profiles: admin write"
  on public.profiles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- apps ----------------------------------------------------------
drop policy if exists "apps: public read published" on public.apps;
drop policy if exists "apps: admin all"             on public.apps;

create policy "apps: public read published"
  on public.apps for select
  to anon, authenticated
  using (status = 'published');

create policy "apps: admin all"
  on public.apps for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- app_screenshots -----------------------------------------------
drop policy if exists "screenshots: public read published" on public.app_screenshots;
drop policy if exists "screenshots: admin all"             on public.app_screenshots;

create policy "screenshots: public read published"
  on public.app_screenshots for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.apps a
      where a.id = app_screenshots.app_id
        and a.status = 'published'
    )
  );

create policy "screenshots: admin all"
  on public.app_screenshots for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- app_links -----------------------------------------------------
drop policy if exists "links: public read published" on public.app_links;
drop policy if exists "links: admin all"             on public.app_links;

create policy "links: public read published"
  on public.app_links for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.apps a
      where a.id = app_links.app_id
        and a.status = 'published'
    )
  );

create policy "links: admin all"
  on public.app_links for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- banners -------------------------------------------------------
drop policy if exists "banners: public read active" on public.banners;
drop policy if exists "banners: admin all"          on public.banners;

create policy "banners: public read active"
  on public.banners for select
  to anon, authenticated
  using (is_active);

create policy "banners: admin all"
  on public.banners for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -------------------------------------------------------------
-- 9. STORAGE
--    app-media    : icon, screenshot, gambar banner
--    app-releases : file rilis yang bisa di-download
-- -------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('app-media', 'app-media', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('app-releases', 'app-releases', true)
on conflict (id) do update set public = true;

drop policy if exists "storage: public read"  on storage.objects;
drop policy if exists "storage: admin write"  on storage.objects;
drop policy if exists "storage: admin update" on storage.objects;
drop policy if exists "storage: admin delete" on storage.objects;

create policy "storage: public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id in ('app-media', 'app-releases'));

create policy "storage: admin write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id in ('app-media', 'app-releases') and public.is_admin());

create policy "storage: admin update"
  on storage.objects for update
  to authenticated
  using (bucket_id in ('app-media', 'app-releases') and public.is_admin())
  with check (bucket_id in ('app-media', 'app-releases') and public.is_admin());

create policy "storage: admin delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id in ('app-media', 'app-releases') and public.is_admin());
