-- =============================================================
-- Gilang Store — banners jadi murni gambar (hapus title/subtitle)
-- Jalankan sekali di Supabase SQL Editor (setelah 0002).
-- =============================================================

alter table public.banners drop column if exists title;
alter table public.banners drop column if exists subtitle;
