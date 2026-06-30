# 12 — Checklist Sebelum Commit

Gunakan checklist ini setiap kali selesai mengedit frontend secara manual.

---

## Checklist Umum (Semua Perubahan)

### Lingkungan & Build

- [ ] `npm run dev` berjalan tanpa error di terminal
- [ ] Tidak ada error merah di browser console (F12)
- [ ] `npm run build` sukses tanpa error
- [ ] Jika ubah `.env`, dev server sudah di-restart

### Kualitas Kode

- [ ] Mengikuti konvensi `createElement as h` — tidak ada JSX
- [ ] Import lintas fitur pakai `@/features/...` barrel
- [ ] Tidak ada `api.get/post` langsung di komponen halaman
- [ ] Pesan error pakai `getApiErrorMessage`
- [ ] Label status tidak di-hardcode di komponen

### UI & UX

- [ ] Teks UI dalam Bahasa Indonesia
- [ ] State loading ditampilkan saat fetch data
- [ ] State error ditampilkan ke user (bukan silent fail)
- [ ] Tombol destructive punya konfirmasi (jika applicable)

---

## Checklist Per Jenis Perubahan

### Mengubah Halaman / Routing

- [ ] Route ditambahkan di `App.js`
- [ ] Lazy import di `lazyPages.js`
- [ ] Export di `features/<nama>/index.js`
- [ ] Menu sidebar diupdate (jika halaman perlu navigasi)
- [ ] Guard benar: `ProtectedRoute` vs `AdminRoute` vs publik
- [ ] Navigasi manual diuji (buka URL langsung, tombol back)

### Mengubah API / Backend

- [ ] Path API tanpa double `/api`
- [ ] Mapper diupdate untuk field response baru
- [ ] Status baru di `middlewareContract.js`
- [ ] Label di `*StatusLabels.js`
- [ ] `npm test` lulus (jika ubah mapper/utils)
- [ ] Uji dengan middleware nyata atau `test-middleware.ps1`
- [ ] Pertimbangkan update `API_CONTRACT.md`

### Mengubah State (Zustand)

- [ ] `isLoading` + `error` untuk setiap async action
- [ ] Action dipanggil dengan `void action()` di useEffect
- [ ] Tidak duplikasi fetch yang sudah di-handle `DocumentWatcher`

### Mengubah Konstanta / Skor / Label

- [ ] Perubahan indikator → cek halaman `/processed/:id`
- [ ] Perubahan predikat → cek PDF preview & unduh
- [ ] Batas upload → koordinasi dengan validasi backend

### Mengubah Auth

- [ ] Uji login admin (`admin@koperasi.id`)
- [ ] Uji login user (`operator@koperasi.id`)
- [ ] User biasa tidak bisa akses `/engine` dan `/admin/activity`
- [ ] Refresh halaman — session tetap (jika token valid)
- [ ] Logout berfungsi

### Menambah Komponen Shared

- [ ] Export di `shared/ui/index.js`
- [ ] Komponen generik — tanpa logic bisnis spesifik satu fitur
- [ ] Dipakai minimal 2 tempat ATAU jelas akan dipakai lintas fitur

---

## Skenario Uji Manual (Regresi)

Jalankan minimal ini setelah perubahan besar:

| # | Skenario | Expected |
|---|----------|----------|
| 1 | Login sebagai user | Masuk ke `/upload` |
| 2 | Upload 1 file PDF valid | Toast sukses, muncul di `/queue` |
| 3 | Preview file lokal sebelum upload | Tab `/preview/:id` terbuka |
| 4 | Buka `/queue` | Tabel tampil, status badge benar |
| 5 | Hapus 1 dokumen dari antrian | Hilang dari list |
| 6 | Tunggu/tunjuk job selesai | Toast "selesai", muncul di `/processed` |
| 7 | Klik Lihat Hasil (sukses) | Halaman detail + tabel skor |
| 8 | Pratinjau / Unduh PDF hasil | PDF terbuka/terunduh |
| 9 | Klik Lihat Detail (gagal) | Modal + alasan gagal |
| 10 | Login sebagai admin → `/engine` | Dashboard tampil |
| 11 | Upload file > 20 MB | Pesan error jelas |
| 12 | `npm test` | Semua test lulus |

---

## File yang Sering Terlupa

Saat menambah halaman baru, pastikan **keempat** ini konsisten:

1. `features/<nama>/pages/<Page>.js`
2. `features/<nama>/index.js`
3. `app/lazyPages.js`
4. `app/App.js`

Saat menambah endpoint baru:

1. `shared/api/scoringJobs/scoringJobsApi.js` (atau layer tepat)
2. `features/<nama>/api/<nama>Api.js`
3. `features/<nama>/store/use<Nama>Store.js`
4. Komponen/halaman pemanggil

---

## Git — Sebelum Push

```bash
git status          # cek file yang berubah
git diff            # review perubahan
npm test            # jika ubah logic
npm run build       # pastikan build OK
```

### Jangan commit

- `.env` (berisi URL/credential lokal)
- `node_modules/`
- `dist/`
- File temporary (`agent-tools/`, screenshot debug)

---

## Dokumentasi — Kapan Update

| Perubahan | Update dokumen |
|-----------|----------------|
| Endpoint API baru/berubah | `API_CONTRACT.md` |
| Struktur folder baru | `STRUKTUR_PROYEK.md` |
| Fitur user-facing baru | `README.md` (ringkas) |
| Panduan edit manual | `docs/panduan-manual/` (file relevan) |

---

## Langkah Berikutnya

Jika ada masalah saat checklist → [13-troubleshooting.md](./13-troubleshooting.md)