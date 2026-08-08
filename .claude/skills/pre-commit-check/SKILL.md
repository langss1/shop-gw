---
name: pre-commit-check
description: Menjalankan lint dan production build, lalu mengecek tampilan storefront dan login admin secara visual di lebar mobile/tablet/desktop untuk mencari layout yang rusak dan error console, sebelum kode di-commit. Pakai saat diminta "cek sebelum commit", "pre-commit check", atau sebelum mengusulkan commit untuk perubahan UI/komponen.
---

# Cek sebelum commit

Tujuan: menangkap build yang rusak, error lint, dan regresi tampilan sebelum
ter-commit — bukan untuk melakukan commit itu sendiri. Skill ini hanya melaporkan;
commit tetap langkah terpisah yang harus diminta eksplisit oleh user.

## 1. Pengecekan statis

1. `npm run lint`. Laporkan setiap error/warning beserta file:baris.
2. `npm run build`. Ini juga menjalankan type checking Next.js. Laporkan kegagalan
   pertama secara lengkap — jangan meringkas begitu saja teks error
   TypeScript/Next yang sebenarnya.

Hentikan dan laporkan segera kalau salah satu gagal; lanjut ke pengecekan visual di
bawah hanya kalau keduanya bersih (build yang rusak membuat screenshot jadi tidak
berarti).

## 2. Pengecekan visual/responsif

1. Muat tool Chrome kalau belum: `ToolSearch` dengan query
   `select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__resize_window,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__read_console_messages`.
2. Pastikan `npm run dev` sudah jalan (jalankan di background kalau belum, tunggu
   sampai "Ready").
3. Untuk tiap lebar layar — **375** (mobile), **768** (tablet), **1440** (desktop) —
   resize window/viewport lalu screenshot:
   - `/` (storefront: header/carousel banner, grid app, panel detail kalau dibuka)
   - `/admin/login` (satu-satunya halaman admin yang bisa diakses tanpa sesi login)
   - Halaman admin apa pun yang tersentuh diff saat ini, kalau sesi login tersedia
     (lihat cara login di skill `verify-crud` — jangan bikin cara baru di sini).
4. Untuk tiap screenshot, cari khususnya: overflow horizontal/scrollbar, elemen yang
   tumpang tindih atau terpotong, teks yang keluar dari kontainernya, target tap yang
   kelihatan terlalu kecil di 375px, dan apa pun yang terlihat berubah dari yang
   seharusnya disentuh diff.
5. Baca pesan console yang tertangkap selama navigasi; tandai error apa pun (bukan
   sekadar warning) yang muncul di halaman yang tersentuh diff.

## 3. Laporan

Satu daftar: status lint, status build, lalu temuan visual per lebar layar/per halaman
(atau "tidak ada masalah"). Sebutkan kalau ada yang terlihat seperti regresi
dibandingkan masalah lama yang tidak terkait diff saat ini — jangan menahan commit
karena masalah lama yang tidak terkait, cukup catat terpisah. Jangan menjalankan
`git commit` atau `git push` sebagai bagian dari skill ini.
