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
| Upload multi-file | Drag & drop dokumen RAT (PDF/JPG/PNG/WEBP, maks. 20 MB total) |
| Preview file | Pratinjau dokumen sebelum/sesudah upload |
| Antrian | Pantau dokumen yang sedang menunggu/diproses |
| Hasil selesai | Daftar & detail skor per dokumen |
| Skor parsial | Penilaian dari **85 bobot** — aspek Manajemen ditampilkan terpisah |
| Notifikasi | Toast saat upload sukses & dokumen selesai diproses |
| Engine dashboard | Monitoring cluster/worker (admin) |
| Aktivitas pengguna | Log aktivitas user (admin, mock) |
| Mock per domain | Auth, admin, dokumen, dan engine bisa di-switch independen |

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

Detail: [TECH_STACK.md](./TECH_STACK.md)

---

## Prasyarat & Instalasi

- **Node.js** 18+ (disarankan 20 LTS)
- **npm** 9+

```bash
cd autoskor
npm install
copy .env.example .env        # Windows
# cp .env.example .env        # Linux / macOS
npm run dev
```

Buka `http://localhost:5173`.

**Login mock** (`VITE_USE_MOCK_AUTH=true`):

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@koperasi.id` | `admin123` |
| User | `operator@koperasi.id` | `user123` |

---

## Environment Variables

Salin `.env.example` ke `.env`:

```env
VITE_API_BASE_URL=http://172.16.210.244:8000/api

# Dokumen — false = pakai middleware API
VITE_USE_MOCK=false

# Auth & admin — true = mock (belum ada di middleware)
VITE_USE_MOCK_AUTH=true
VITE_USE_MOCK_ADMIN=true

# Engine — false = agregasi dari GET /scoring-jobs
VITE_USE_MOCK_ENGINE=false

VITE_SCORING_JOBS_LIST_LIMIT=100
```

| Variable | Default | Deskripsi |
|----------|---------|-----------|
| `VITE_API_BASE_URL` | `http://localhost:8000/api` | Base URL sampai `/api` (tanpa trailing slash) |
| `VITE_USE_MOCK` | `true` | `false` = dokumen pakai middleware nyata |
| `VITE_USE_MOCK_AUTH` | `true` | `false` = auth pakai backend nyata |
| `VITE_USE_MOCK_ADMIN` | `true` | `false` = admin pakai backend nyata |
| `VITE_USE_MOCK_ENGINE` | `false` | `true` = engine dashboard pakai mock lokal |
| `VITE_SCORING_JOBS_LIST_LIMIT` | `100` | Limit pagination list scoring jobs |

Restart dev server setelah mengubah `.env`.

---

## Halaman & Routing

| Path | Halaman | Akses |
|------|---------|-------|
| `/login` | Login | Publik |
| `/upload` | Upload dokumen | User |
| `/preview/:previewId` | Preview file | User |
| `/queue` | Antrian dokumen | User |
| `/processed` | Dokumen selesai | User |
| `/processed/:id` | Detail hasil skor | User |
| `/engine` | Dashboard engine | Admin |
| `/admin/activity` | Aktivitas pengguna | Admin |

Halaman di-load secara lazy lewat `src/app/lazyPages.js`.

---

## Integrasi Backend

Frontend terintegrasi dengan **Middleware API** (`/scoring-jobs`):

```
POST /scoring-jobs/upload     → upload file
GET  /scoring-jobs            → list antrian & selesai
GET  /scoring-jobs/{id}       → detail + hasil skor
POST /scoring-jobs/{id}/cancel → batalkan job (belum di UI)
```

Auth (`/auth/*`), admin (`/admin/*`), dan engine status (`/engine/status`) **belum tersedia** di middleware — masih memakai mock.

Kontrak lengkap & panduan penulisan kode API: [API_CONTRACT.md](./API_CONTRACT.md)

---

## Struktur Proyek

Arsitektur modular berbasis `features/`:

```
src/
├── app/           App.js, lazyPages.js
├── features/      auth, upload, documents, results, engine, admin
└── shared/        api, layout, ui, store, utils
```

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

---

## Dokumentasi

| File | Isi |
|------|-----|
| [API_CONTRACT.md](./API_CONTRACT.md) | Kontrak middleware API + panduan developer |
| [ARSITEKTUR.md](./ARSITEKTUR.md) | Diagram alur & tanggung jawab komponen |
| [TECH_STACK.md](./TECH_STACK.md) | Penjelasan teknologi & alasan pemilihan |
| [STRUKTUR_PROYEK.md](./STRUKTUR_PROYEK.md) | Struktur folder & konvensi modular |
| [TIDAK_DAPAT_DIHITUNG.md](./TIDAK_DAPAT_DIHITUNG.md) | Aspek Manajemen yang tidak dapat dihitung |

---

## Lisensi

Proyek private — `private: true` di `package.json`.