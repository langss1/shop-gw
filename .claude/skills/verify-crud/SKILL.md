---
name: verify-crud
description: Menjalankan pengecekan end-to-end CRUD App dan Banner di /admin (create, edit, delete) lewat browser sungguhan, memastikan hasilnya muncul di storefront publik dan /api/v1, lalu membersihkan data uji coba. Pakai sebelum merilis perubahan admin/database, atau saat diminta "verifikasi CRUD" / "test panel admin".
---

# Verifikasi CRUD

Tujuan: membuktikan bahwa create/edit/delete untuk App dan Banner benar-benar jalan
dari ujung ke ujung — UI admin → Server Action → Supabase (RLS) → storefront/API —
bukan cuma memastikan kodenya bisa di-build. Selalu bersihkan data uji coba di akhir,
baik hasilnya lolos maupun gagal.

## 0. Prasyarat

- Muat dulu tool Chrome: `ToolSearch` dengan query
  `select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__tabs_close_mcp,mcp__claude-in-chrome__form_input,mcp__claude-in-chrome__read_console_messages`.
- Pastikan `npm run dev` sudah jalan (cek dulu apakah sudah ada proses di port 3000;
  kalau belum, jalankan lewat Bash dengan `run_in_background: true` dan tunggu sampai
  muncul "Ready" di outputnya sebelum lanjut).
- Butuh sesi admin yang sudah login. Cek dulu apakah `TEST_ADMIN_EMAIL` /
  `TEST_ADMIN_PASSWORD` ada di `.env.local`. Kalau ada, pakai itu untuk login lewat
  form `/admin/login`. Kalau tidak ada, buka `/admin/login` di tab baru dan minta user
  login manual, lalu tunggu konfirmasi sebelum lanjut — jangan pernah minta user
  menempelkan password di chat, dan jangan hardcode kredensial ke dalam skill atau repo.

## 1. Baseline storefront

1. Buka `http://localhost:3000/` di tab baru, pastikan render dengan benar (carousel
   banner, grid app) dan tidak ada error di console (`read_console_messages`).
2. Catat jumlah app/banner yang tampil sekarang, supaya nanti bisa dipastikan data uji
   coba benar-benar muncul saat dibuat, dan hilang lagi setelah dibersihkan.

## 2. CRUD App

1. Buka `/admin/apps/new`. Isi data sekali-pakai: nama seperti
   `CRUD Test <unix-timestamp>`, slug unik, kategori, platform, dan field lain yang
   wajib diisi. Kalau status di-set `published`, harus memenuhi constraint
   `apps_published_needs_download` (isi `download_url` atau upload file kecil untuk
   tes). Paling simpel: biarkan status `draft` kecuali memang perlu mengecek jalur yang
   tampil di storefront — dalam hal itu, set `published` dengan `download_url`.
2. Submit, pastikan redirect ke `/admin/apps` dan baris baru muncul di tabel.
3. Buka halaman edit app tersebut, ubah tagline-nya, simpan, pastikan perubahan
   tersimpan (buka lagi halaman edit atau cek di tabel).
4. Kalau statusnya `published`, pastikan sekarang muncul di `/` dan di
   `GET /api/v1/apps` serta `GET /api/v1/apps/[slug]` (pakai `read_network_requests`
   atau langsung buka URL API tersebut di tab dan baca JSON-nya).
5. Hapus app uji coba dari `/admin/apps`, pastikan hilang dari tabel, dari `/`, dan
   `GET /api/v1/apps/[slug]` sekarang mengembalikan 404.

## 3. CRUD Banner

1. Buka `/admin/banners/new`, buat banner sekali-pakai (judul `CRUD Test <ts>`),
   submit, pastikan muncul di `/admin/banners` dan — kalau ditandai aktif — juga di
   carousel storefront serta `GET /api/v1/banners`.
2. Edit (ubah subtitle-nya), pastikan perubahan tersimpan.
3. Hapus, pastikan hilang dari daftar admin, carousel, dan API.

## 4. Alur download (opsional, hanya kalau ada file/URL rilis di app sungguhan)

Akses `/api/download/[slug]` untuk app published yang sungguhan, pastikan redirect
terjadi dan `download_count` bertambah (cek di `/admin/apps` atau response API app
tersebut). Jangan lakukan ini terhadap app uji coba kecuali memang diberi target
download yang valid.

## 5. Laporan

Rangkum pass/fail per langkah dalam daftar singkat. Untuk setiap kegagalan, sertakan:
apa yang dilakukan, apa yang diharapkan, apa yang sebenarnya terjadi (pesan error,
output console, atau screenshot lewat tool `computer`). Jangan mencoba memperbaiki kode
dari dalam skill ini kecuali diminta — laporkan temuan, lalu biarkan user yang
memutuskan.

## 6. Bersih-bersih (selalu, walau gagal)

Hapus semua App/Banner uji coba yang dibuat, termasuk dari langkah yang gagal.
Meninggalkan baris `CRUD Test *` di database tidak boleh dibiarkan — kalau ternyata
penghapusan lewat UI-nya rusak, sebutkan itu secara eksplisit di laporan alih-alih
membiarkan data uji coba menggantung.
