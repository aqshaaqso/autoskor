# 13 — Troubleshooting

Solusi masalah umum saat mengedit dan menjalankan frontend AutoSkor.

---

## Dev Server & Instalasi

### `npm install` gagal

**Gejala:** error permission, EACCES, atau network timeout.

**Solusi:**
1. Pastikan Node.js 18+ terinstall: `node -v`
2. Hapus `node_modules` dan install ulang:
   ```bash
   rmdir /s /q node_modules
   del package-lock.json
   npm install
   ```
3. Jika di jaringan korporat, cek proxy npm

### `npm run dev` — port 5173 sudah dipakai

**Solusi:**
```bash
npx vite --port 5174
```
Atau tutup proses yang memakai port 5173.

### Perubahan `.env` tidak berlaku

**Penyebab:** Vite tidak hot-reload environment variables.

**Solusi:** Stop dev server (Ctrl+C) → `npm run dev` lagi.

---

## Koneksi API & Middleware

### Network Error / CORS

**Gejala:** Console browser: `CORS policy`, `Network Error`, `ERR_CONNECTION_REFUSED`.

**Solusi:**
1. Cek `VITE_API_BASE_URL` di `.env` — harus reachable dari laptop Anda
2. Pastikan middleware berjalan dan CORS mengizinkan `http://localhost:5173`
3. Jika server di LAN (`172.16.x.x`), pastikan VPN/koneksi kantor aktif
4. Uji dengan PowerShell: `.\scripts\test-middleware.ps1`

### 404 pada request API — path double `/api`

**Gejala:** Request ke `http://host:8000/api/api/scoring-jobs`

**Penyebab:** Path di kode sudah include `/api` padahal `baseURL` sudah berisi `/api`.

**Solusi:** Di kode JS gunakan `/scoring-jobs`, bukan `/api/scoring-jobs`.

### 401 Unauthorized — langsung redirect login

**Penyebab:** Token invalid/expired atau `VITE_USE_MOCK_AUTH=false` tapi backend belum siap.

**Solusi:**
1. Clear localStorage: DevTools → Application → Local Storage → hapus `autoskor_auth_token`
2. Login ulang
3. Atau set `VITE_USE_MOCK_AUTH=true` untuk development

### Upload gagal tanpa pesan jelas

**Cek:**
1. Ukuran file ≤ 20 MB per file
2. Format PDF atau DOCX
3. Field form `files` (bukan `file`)
4. Response error di Network tab — `getApiErrorMessage` membaca `message`/`detail`/`error`

---

## Tampilan & UI

### Halaman blank putih

**Cek:**
1. Console browser — error JavaScript?
2. `AppErrorBoundary` — apakah menampilkan pesan error?
3. Apakah route terdaftar di `App.js`?
4. Apakah lazy import export name benar di `lazyPages.js`?

### Import error — module not found

**Gejala:** `Failed to resolve import "@/features/..."`

**Solusi:**
1. Pastikan path alias `@/` benar di `vite.config.js`
2. Pastikan file di-export di `index.js` barrel fitur
3. Restart dev server

### Tailwind class tidak berlaku

**Solusi:**
1. Pastikan class ditulis di string `className` — bukan variable yang tidak ter-scan
2. Cek `src/index.css` memiliki `@import "tailwindcss"`
3. Warna custom pakai token `primary-*`, bukan nama yang tidak didefinisikan di `@theme`

### Sidebar menu tidak muncul (admin)

**Cek:**
1. Login sebagai `admin@koperasi.id` / `admin123`
2. `user.role` harus `'admin'` di store
3. Item menu punya `roles: ['admin']` di `Sidebar.js`

---

## Data & State

### Antrian tidak auto-refresh

**Cek:**
1. `DocumentWatcher` ter-mount di `MainLayout`
2. `hasPendingDocuments` true di store
3. Tab browser aktif (polling pause saat tab hidden)
4. Interval: `DOCUMENT_POLL_INTERVAL_MS` di `documents/constants.js`

### Toast tidak muncul

**Cek:**
1. `Toast` di-render di `MainLayout`
2. Pemanggilan `useUiStore.getState().showToast(...)` atau hook
3. Tidak ada error sebelum toast dipanggil

### Data tabel kosong padahal ada di API

**Cek:**
1. Filter status di `middlewareContract.js` — apakah status job cocok?
2. Job `canceled` disembunyikan di mapper — expected behavior
3. Network tab — response `data` array isinya?
4. Pagination offset — cek `queuePagination` di store

### Hasil skor tidak tampil di detail

**Cek:**
1. Status job harus `completed_success` (UI: `done`)
2. Field `result.result_data` ada di response middleware
3. Mapper `mapScoringJobResult` — cek normalisasi field
4. Console error saat render `ResultsTable`

---

## Build & Test

### `npm run build` gagal

**Solusi:**
1. Baca error message — biasanya import typo atau syntax error
2. Pastikan semua lazy import path valid
3. Jalankan `npm run build` untuk melihat error lengkap (bukan hanya dev)

### `npm test` gagal setelah ubah mapper

**Solusi:**
1. Baca test yang fail — update expected value di `*.test.js`
2. Jika behavior baru benar, update test — bukan skip test
3. Jalankan test spesifik: `npx vitest run src/shared/api/scoringJobs/scoringJobsMapper.test.js`

---

## Preview & PDF

### Preview PDF blank

**Cek:**
1. Response `GET /scoring-jobs/{id}/file` return binary valid
2. Blob URL dibuat dengan MIME type benar
3. Popup blocker — preview buka tab baru

### Preview DOCX rusak/format aneh

**Penyebab:** Keterbatasan library `docx-preview`.

**Solusi:** Coba file DOCX lain; untuk layout kompleks mungkin perlu unduh saja.

### PDF hasil penilaian kosong / error

**Cek:**
1. `documentResult` punya data `result` lengkap
2. `generateResultPdf.js` — error di console saat klik Unduh
3. Font/unicode karakter khusus di nama file

---

## Git & File

### Perubahan tidak terlihat di browser

1. Hard refresh: Ctrl+Shift+R
2. Cek apakah edit file yang benar (bukan duplikat di `dist/`)
3. Restart `npm run dev`

### `middlewareContract.js` modified tapi tidak yakin

File ini adalah **sumber kebenaran** status. Jika ragu, bandingkan dengan `API_CONTRACT.md` dan `JOB_STATUS_TO_UI` di file tersebut.

---

## Diagram Diagnosa Cepat

```
Ada masalah?
├── Dev server tidak jalan → npm install, cek Node version
├── Halaman blank → console error, cek routing
├── API gagal → .env URL, CORS, VPN, test-middleware.ps1
├── Data kosong → filter status, mapper, network response
├── UI salah → *StatusLabels.js, DocumentStatusBadge
└── Build gagal → npm run build, fix import/syntax
```

---

## Bantuan Lebih Lanjut

| Topik | Dokumen |
|-------|---------|
| Setup laptop baru | [PANDUAN_SETUP.md](../../PANDUAN_SETUP.md) |
| Kontrak API | [API_CONTRACT.md](../../API_CONTRACT.md) |
| Arsitektur alur | [ARSITEKTUR.md](../../ARSITEKTUR.md) |
| Struktur folder | [02-peta-struktur-folder.md](./02-peta-struktur-folder.md) |

---

## Kembali ke Indeks

[README.md](./README.md)