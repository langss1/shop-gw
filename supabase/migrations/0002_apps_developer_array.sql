-- =============================================================
-- Gilang Store — apps.developer: text -> text[] (up to 5 developers)
-- Jalankan sekali di Supabase SQL Editor (setelah 0001_init.sql).
-- =============================================================

alter table public.apps alter column developer drop default;

alter table public.apps
  alter column developer type text[] using array[developer]::text[];

alter table public.apps
  alter column developer set default array['Gilang Store'];

alter table public.apps
  add constraint apps_developer_count check (
    array_length(developer, 1) between 1 and 5
  );
