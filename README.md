# AutoSkor — Dashboard Penilaian Kesehatan Koperasi

Frontend SPA untuk upload dokumen RAT, memantau antrian penilaian, dan menampilkan skor kesehatan **Koperasi Simpan Pinjam (KSP)** / **Unit Simpan Pinjam (USP)** berdasarkan **Permen KUKM No. 14/Per/M.KUKM/XII/2009**.

Ditulis dengan **JavaScript murni** — tanpa TypeScript, tanpa JSX. UI dirender memakai `React.createElement`.

---

## Daftar Isi

- [Fitur](#fitur)
- [Tech Stack](#tech-stack)
- [Prasyarat & Instalasi](#prasyarat--instalasi)
- [Environment Variables](#environment-variables)
- [Halaman & Routing](#halaman--routing)
- [Integrasi Backend](#integrasi-backend)
- [Struktur Proyek](#struktur-proyek)
- [Scripts NPM](#scripts-npm)
- [Dokumentasi](#dokumentasi)

---

## Fitur

| Fitur | Deskripsi |
|-------|-----------|
| Login | Autentikasi user (mock — menunggu endpoint middleware) |
| Upload multi-file | Drag & drop dokumen RAT (PDF/DOCX, maks. 20 MB total) |
| Preview file | File lokal: `/preview/:previewId` · file ter-upload: `/preview/document/:documentId` |
| Antrian | Pantau dokumen menunggu/diproses; hapus per baris; detail metadata |
| Hasil selesai | Daftar dokumen sukses & gagal; **Lihat Hasil** (sukses) atau **Lihat Detail** (gagal) |
| Unduh / pratinjau PDF | Laporan hasil penilaian (ringkasan + tabel skor) di halaman detail |
| Skor parsial | Penilaian dari **85 bobot** — aspek Manajemen ditampilkan terpisah |
| Notifikasi | Toast saat upload sukses & dokumen selesai diproses |
| Engine dashboard | Monitoring cluster/worker (admin, data dari scoring jobs) |
| Aktivitas pengguna | Log aktivitas user (admin, mock) |
| Mock auth & admin | `VITE_USE_MOCK_AUTH` / `VITE_USE_MOCK_ADMIN` — dokumen & engine selalu middleware nyata |
| UI Bahasa Indonesia | Label navigasi & status terpusat (`shared/utils/*StatusLabels.js`) |
| Arsitektur modular | Fitur per domain di `features/` + shared layer (`api`, `layout`, `utils`) |

---

## Tech Stack

| Teknologi | Peran |
|-----------|-------|
| React 19 | UI komponen |
| React Router DOM 7 | Routing multi-halaman |
| Vite 6 | Dev server & build |
| Tailwind CSS 4 | Styling |
| Zustand 5 | State management |
| Axios | HTTP client ke middleware |
| react-dropzone | Upload drag & drop |
| lucide-react | Icon |
| docx-preview | Preview dokumen Word |
| jspdf + jspdf-autotable | Generate & unduh laporan hasil PDF |

Detail: [TECH_STACK.md](./TECH_STACK.md)

---

## Prasyarat & Instalasi

Proyek ini **Node.js** — tidak ada `requirements.txt` (itu khusus Python). Dependensi ada di `package.json`.

- **Node.js** 18+ (disarankan 20 LTS) — https://nodejs.org
- **npm** 9+ (otomatis ikut Node.js)

**Panduan lengkap + troubleshooting:** [PANDUAN_SETUP.md](./PANDUAN_SETUP.md)

```bash
cd autoskor
npm install
copy .env.example .env        # Windows
# cp .env.example .env        # Linux / macOS
npm run dev
```

Atau di Windows: jalankan `setup.bat` (otomatis install + buat `.env`).

Buka `http://localhost:5173`. Default `.env.example` mengarah ke middleware lokal — sesuaikan `VITE_API_BASE_URL` dengan server yang dapat diakses (lihat [PANDUAN_SETUP.md](./PANDUAN_SETUP.md)).

**Login mock** (`VITE_USE_MOCK_AUTH=true`):

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@koperasi.id` | `admin123` |
| User | `operator@koperasi.id` | `user123` |

---

## Environment Variables

Salin `.env.example` ke `.env`:

```env
# Mode middleware nyata (default tim)
VITE_API_BASE_URL=http://172.16.210.244:8000/api
VITE_USE_MOCK_AUTH=true
VITE_USE_MOCK_ADMIN=true
VITE_SCORING_JOBS_LIST_LIMIT=100
```

Konfigurasi auth/admin mock vs middleware nyata: [PANDUAN_SETUP.md](./PANDUAN_SETUP.md#dua-mode-konfigurasi).

| Variable | Default | Deskripsi |
|----------|---------|-----------|
| `VITE_API_BASE_URL` | `http://localhost:8000/api` | Base URL sampai `/api` (tanpa trailing slash) |
| `VITE_USE_MOCK_AUTH` | `true` (dev) | `false` = auth pakai backend nyata |
| `VITE_USE_MOCK_ADMIN` | `true` (dev) | `false` = admin pakai backend nyata |
| `VITE_SCORING_JOBS_LIST_LIMIT` | `100` | Limit pagination list scoring jobs |

Dokumen & engine **selalu** memakai middleware nyata di `VITE_API_BASE_URL`. Tidak ada flag mock global.

Restart dev server setelah mengubah `.env`.

---

## Halaman & Routing

| Path | Halaman (label sidebar) | Akses |
|------|-------------------------|-------|
| `/login` | Login | Publik |
| `/upload` | Unggah | User |
| `/preview/:previewId` | Preview file lokal | User |
| `/preview/document/:documentId` | Preview file ter-upload | User |
| `/queue` | Antrian | User |
| `/processed` | Selesai | User |
| `/processed/:id` | Detail hasil skor | User |
| `/engine` | Engine | Admin |
| `/admin/activity` | Aktivitas Pengguna | Admin |

Halaman di-load secara lazy lewat `src/app/lazyPages.js`.

---

## Integrasi Backend

Frontend terintegrasi dengan **Middleware API** (`/scoring-jobs`):

```
POST /scoring-jobs/upload       → upload file
GET  /scoring-jobs              → list antrian & selesai
GET  /scoring-jobs/{id}         → detail + hasil skor
GET  /scoring-jobs/{id}/file    → unduh file asli (preview)
POST /scoring-jobs/{id}/cancel  → batalkan job (antrian)
```

**Hapus Semua** di mode middleware hanya membatalkan dokumen **aktif di antrian** — dokumen selesai/gagal di halaman Hasil **tidak dihapus**.

Auth (`/auth/*`) dan admin (`/admin/*`) **belum tersedia** di middleware — masih memakai mock. Engine dashboard mengagregasi data dari `GET /scoring-jobs`.

Kontrak lengkap & panduan penulisan kode API: [API_CONTRACT.md](./API_CONTRACT.md)

---

## Struktur Proyek

Arsitektur modular berbasis `features/`:

```
src/
├── app/           App.js, lazyPages.js
├── features/      auth, upload, preview, documents, engine, admin
└── shared/        api, constants, layout, ui, store, utils
```

Setiap fitur punya `api/`, `components/`, `pages/`, `store/`, dan barrel `index.js`. Kode lintas fitur ada di `shared/`.

**Label status terpusat** (jangan duplikat di komponen):

| Lapisan | File |
|---------|------|
| Mapping API ↔ kode UI | `shared/api/middlewareContract.js` |
| Label dokumen (ID) | `shared/utils/documentStatusLabels.js` |
| Badge status dokumen | `shared/ui/DocumentStatusBadge.js` |
| Label engine/worker (ID) | `shared/utils/engineStatusLabels.js` |

Detail folder & konvensi import: [STRUKTUR_PROYEK.md](./STRUKTUR_PROYEK.md)

### Path alias

```js
import { UploadPage } from '@/features/upload'
import { api } from '@/shared/api/client'
```

Alias `@/` → `src/` dikonfigurasi di `vite.config.js`.

---

## Scripts NPM

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Development server (hot reload) |
| `npm run build` | Build production ke `dist/` |
| `npm run preview` | Preview build production |
| `npm test` | Unit test (mapper & utils) |
| `.\scripts\test-middleware.ps1` | Uji koneksi ke middleware (PowerShell, butuh LAN/VPN) |

---

## Dokumentasi

| File | Isi |
|------|-----|
| [API_CONTRACT.md](./API_CONTRACT.md) | Kontrak middleware API + panduan developer |
| [ARSITEKTUR.md](./ARSITEKTUR.md) | Diagram alur & tanggung jawab komponen |
| [TECH_STACK.md](./TECH_STACK.md) | Penjelasan teknologi & alasan pemilihan |
| [STRUKTUR_PROYEK.md](./STRUKTUR_PROYEK.md) | Struktur folder & konvensi modular |
| [TIDAK_DAPAT_DIHITUNG.md](./TIDAK_DAPAT_DIHITUNG.md) | Aspek Manajemen yang tidak dapat dihitung |
| [PANDUAN_SETUP.md](./PANDUAN_SETUP.md) | Setup laptop baru & troubleshooting |

---

## Lisensi

Proyek private — `private: true` di `package.json`.