# Ideas

Tampungan ide tulisan untuk kesatria.dev. Repo ini public, jadi jangan simpan ide yang sensitif di sini.

Pilar: `web` · `seo` · `iot` · `ai` · `arch` · `life-eng`

## Alur

1. **Inbox** — satu baris, bebas format, tanpa disaring.
2. **Backlog** — wajib punya pilar, angle, dan bahan. Ide tanpa bahan jarang jadi post.
3. **Planned** — sudah dapat slot Jumat 19:00 WIB. Buat stub `src/content/blog/<slug>.md` dengan `draft: true` dan `pubDate` final.
4. **Published** — pindahkan ke tabel beserta tanggal dan link.

Ritual bulanan (minggu terakhir, ±15 menit): proses Inbox, pilih 4 ide dari Backlog dengan pilar seimbang, buat stub draft-nya.

## Inbox

- Kenapa redirect kesatriakeyboard.com sempat 522
- Migrasi post blog lama (Laravel 5) ke Astro

## Backlog

### Scheduled post di Astro SSG tanpa server
- pilar: `web`, `arch`
- angle: jadwal ditentukan konten (`pubDate`), bukan infra. Worker cron vs GitHub Actions (scheduled workflow mati setelah 60 hari tanpa aktivitas di repo public).
- bahan: `src/lib/posts.ts`, `workers/publish-cron/`

### Konsolidasi domain dan hosting ke Cloudflare
- pilar: `arch`, `life-eng`
- angle: 3 provider jadi 1, biaya per tahun sebelum vs sesudah, aturan "jangan beli domain dari host".
- bahan: `docs/MIGRATION.md`

## Planned — Oktober 2026

- [ ] **2026-10-09** · Kenapa kesatria.dev ada, dan kenapa Astro · `web`
  - Tentang apa blog ini dan untuk siapa. Alasan Astro SSG dibanding Next/Hugo.
  - Keputusan kecil di awal: `astro check` + TS 6, dependabot blokir major TS, robots.txt, 404.
  - Bahan: commit `d5ab7be`, `f061ce0`, `2295622`.
- [ ] **2026-10-16** · JSON-LD untuk blog personal: Person, WebSite, BlogPosting · `seo`
  - Graph dengan `@id`; `sameAs` di-scope per entity; akun private sengaja dikeluarkan (SEO sebagai batas privasi).
  - Escape `<` jadi `<` di `set:html`; OG image di `public/` agar URL stabil.
  - Bahan: `src/layouts/BaseLayout.astro`, `src/consts.ts`, commit `3ab5ed5`, `8b3c488`.
- [ ] **2026-10-23** · Membawa bunyi "ding" lift ke rumah: Arduino, NFC, buzzer · `iot`
  - Motivasi: anak suka bunyi "ding" lift di apartemen; setelah pindah ke rumah, liftnya hilang.
  - v1: tap kartu NFC, bunyi "ding" (dua nada turun, mis. E5 659 Hz lalu C5 523 Hz).
  - v2: tiap tap rotasi ke lagu berikutnya. Bukan MIDI asli, tapi array frekuensi + durasi.
  - Inti: buzzer pasif + `tone()` cuma tahu frekuensi. Ritme butuh BPM ke ms (`60000 / BPM`), panjang not (1/4, 1/8, bertitik ×1,5), jeda artikulasi ±10%, rest = frekuensi 0, dan `delay()` karena `tone()` tidak memblokir.
  - "Sengaja sederhana": `delay()` bikin tap di tengah lagu terlewat, indeks lagu reset saat listrik mati, buzzer tanpa kontrol volume.
  - Dokumentasi asli hilang: tulis sebagai rekonstruksi, rakit ulang untuk foto/video, anak cukup disebut "anak saya".
- [ ] **2026-10-30** · AI di workflow engineering harian · `ai`
  - Di mana AI agent membantu (refactor, review, dokumentasi) dan di mana tidak.
  - Batasan yang dipegang: selective staging, commit tetap dikontrol manusia.
  - Penutup bulan: rangkuman 4 post, teaser bulan depan.

## Published

| Tanggal | Judul | Pilar | Link |
|---|---|---|---|
