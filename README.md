# Gilang Store

Storefront aplikasi (Next.js 16 + React 19 + Tailwind 4) dengan backend Supabase dan
web admin untuk mengelola isinya.

- **Storefront** `/` — daftar app, carousel banner, panel detail, tombol Install.
- **Admin** `/admin` — CRUD app (termasuk upload ikon, screenshot, dan file rilis) serta CRUD banner.
- **API publik** `/api/v1/*` — data yang sama, dalam JSON.

---

## Setup

### 1. Environment

Buat `.env.local` di root project:

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxx
```

Service role key **tidak dipakai** — semua operasi tulis lewat JWT admin + RLS.

### 2. Database

Jalankan `supabase/migrations/0001_init.sql` di Supabase SQL Editor. Isinya:

| Objek | Keterangan |
| --- | --- |
| `profiles` | Role user (`admin` / `viewer`), terisi otomatis lewat trigger saat user baru daftar |
| `apps` | Data utama app |
| `app_screenshots`, `app_links` | Relasi milik app |
| `banners` | Carousel di header storefront |
| `is_admin()` | Helper yang dipakai semua policy tulis |
| `increment_download()` | Dipanggil endpoint download |
| Bucket `app-media`, `app-releases` | Gambar dan file rilis |

RLS: publik hanya bisa membaca app `published` dan banner `is_active`; seluruh operasi
tulis hanya untuk admin.

Opsional: `supabase/seed.sql` mengisi 3 app dan 2 banner contoh.

### 3. Buat user admin

1. Supabase Dashboard → **Authentication** → **Add user** (email + password).
2. Jalankan di SQL Editor:
   ```sql
   update public.profiles set role = 'admin' where email = 'email-anda@contoh.com';
   ```

### 4. Jalankan

```bash
npm install
npm run dev
```

Storefront di <http://localhost:3000>, admin di <http://localhost:3000/admin>.

---

## API publik

| Endpoint | Keterangan |
| --- | --- |
| `GET /api/v1/apps` | Semua app published. Filter: `?platform=mobile`, `?category=Cybersecurity` |
| `GET /api/v1/apps/[slug]` | Detail satu app beserta screenshot dan link |
| `GET /api/v1/banners` | Banner aktif |
| `GET /api/download/[slug]` | Menaikkan `download_count`, lalu redirect ke file rilis atau URL eksternal |

---

## Struktur

```
src/
  app/
    page.tsx                  Server Component, fetch app + banner
    admin/
      login/                  Halaman login (di luar guard)
      (protected)/            Semua halaman admin, dijaga layout
    api/v1/, api/download/    Route handler
  components/
    Storefront.tsx            Menyatukan header + grid, memegang state tab
    MobileHeader.tsx          Carousel banner + tab platform
    AppStoreGrid.tsx          Kartu app + panel detail
    admin/                    Form dan komponen admin
  lib/
    supabase/                 Client browser & server, config, helper upload
    actions/                  Server Actions (apps, banners, auth)
    queries.ts                Query baca untuk storefront
    constants.ts              Platform, kategori, gradient, helper YouTube
  proxy.ts                    Refresh session + guard /admin
```

> Next.js 16 mengganti nama `middleware` menjadi `proxy`, dan `cookies()` / `params` /
> `searchParams` sekarang hanya bisa diakses secara async.
