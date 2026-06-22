# AutoSkor — Portal Upload & Monitoring Penilaian Kesehatan Koperasi

Frontend SPA untuk upload dokumen RAT, memantau antrian proses, dan menampilkan hasil penilaian kesehatan **Koperasi Simpan Pinjam (KSP)** dan **Unit Simpan Pinjam (USP)** berdasarkan **Permen KUKM No. 14/Per/M.KUKM/XII/2009**.

Ditulis dengan **JavaScript murni** — tanpa TypeScript, tanpa JSX. UI dirender memakai `React.createElement`.

Frontend **hanya** upload & monitoring — proses hitung skor dilakukan oleh **backend/engine**, bukan di browser.

---

## Daftar Isi

- [Fitur](#fitur)
- [Halaman & Routing](#halaman--routing)
- [Autentikasi](#autentikasi)
- [Upload & Antrian Dokumen](#upload--antrian-dokumen)
- [Engine & Worker](#engine--worker)
- [Skor Parsial & Aspek Tidak Dapat Dihitung](#skor-parsial--aspek-tidak-dapat-dihitung)
- [Tech Stack](#tech-stack)
- [Prasyarat](#prasyarat)
- [Instalasi & Menjalankan](#instalasi--menjalankan)
- [Environment Variables](#environment-variables)
- [Struktur Proyek](#struktur-proyek)
- [Pendekatan JavaScript Murni](#pendekatan-javascript-murni)
- [Arsitektur & Alur Kerja](#arsitektur--alur-kerja)
- [State Management](#state-management)
- [Integrasi Backend](#integrasi-backend)
- [Skema Data Hasil](#skema-data-hasil)
- [Color Grading](#color-grading)
- [Scripts NPM](#scripts-npm)
- [Build & Deploy](#build--deploy)
- [Roadmap](#roadmap)

---

## Fitur

### MVP (Tersedia)

| Fitur | Deskripsi |
|-------|-----------|
| **Login wajib** | Dashboard hanya bisa diakses setelah login |
| **Role admin & operator** | Dua peran user dengan hak akses berbeda |
| **User menu** | Dropdown profile di sidebar (nama, email, role, logout) |
| **Sidebar + routing** | Upload, Antrian, Selesai (+ Engine untuk admin) |
| **Upload async** | Antrian upload di background — bisa tambah file sambil upload jalan |
| **Upload per file** | Satu request per file, berurutan (bukan batch sekaligus) |
| **Validasi file** | Hanya **PDF & DOCX**, maksimal **20 MB per file** |
| **Progress upload** | Progress bar per file + info antrian upload |
| **Polling on-demand** | Cek status dokumen hanya saat ada antrian aktif |
| **Toast notifikasi** | Popup sukses upload & dokumen selesai diproses |
| **Halaman antrian** | List dokumen `Menunggu` / `Sedang Diproses` + kolom worker |
| **Multi-worker mock** | 3 worker proses dokumen paralel dari satu antrian FIFO |
| **Engine dashboard** | Monitor cluster worker (admin only) |
| **Halaman selesai** | List dokumen selesai + detail hasil skor |
| **Skor parsial** | Persentase dari 85 bobot (tanpa Manajemen) |
| **Panel tidak dapat dihitung** | Aspek Manajemen terpisah, skor = 0 |
| **Color grading** | Status Hijau / Kuning / Merah per komponen |
| **Mock mode** | Testing UI tanpa backend nyata |
| **Struktur modular** | Feature-based folders (`features/` + `shared/`) |

### Phase 2 (Belum Tersedia)

- Daftar koperasi
- Filter & search dokumen
- Export hasil (PDF / Excel)
- Preview dokumen yang diupload
- Halaman profile & edit akun
- Integrasi backend production (auth + engine nyata)

---

## Halaman & Routing

| Route | Halaman | Akses | Fungsi |
|-------|---------|-------|--------|
| `/login` | Login | Publik | Masuk ke aplikasi |
| `/upload` | Upload | Auth | Pilih & upload dokumen RAT |
| `/queue` | Antrian | Auth | Dokumen menunggu / sedang diproses |
| `/processed` | Selesai | Auth | Daftar dokumen yang sudah jadi |
| `/processed/:id` | Detail Hasil | Auth | Tabel skor + ringkasan parsial |
| `/engine` | Engine Dashboard | **Admin** | Monitor cluster worker |

```
┌──────────────┬──────────────────────────────────┐
│  SIDEBAR     │  Konten halaman aktif (Outlet)   │
│              │                                  │
│  👤 Profile  │  /login     → LoginPage          │
│  ● Upload    │  /upload    → UploadPage         │
│    Antrian   │  /queue     → QueuePage          │
│    Selesai   │  /processed → ProcessedPage      │
│    Engine*   │  /processed/:id → Detail skor    │
│              │  /engine    → EngineDashboard    │
└──────────────┴──────────────────────────────────┘
  * menu Engine hanya tampil untuk role admin
```

---

## Autentikasi

### Route guard

- `ProtectedRoute` — semua halaman dashboard butuh login
- `AdminRoute` — halaman `/engine` hanya untuk role `admin`
- Token disimpan di `localStorage`, dikirim otomatis via Axios interceptor

### Akun demo (mock mode)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@koperasi.id` | `admin123` |
| Operator | `operator@koperasi.id` | `user123` |

Operator bisa upload & pantau dokumen, tetapi **tidak** melihat menu Engine.

---

## Upload & Antrian Dokumen

### Aturan upload

| Aturan | Nilai |
|--------|-------|
| Format file | PDF, DOCX |
| Ukuran maksimal | **20 MB per file** |
| Cara upload | Satu file per request HTTP, berurutan |
| UX | Konfirmasi upload → masuk antrian background → user bisa pilih file lagi |

### Alur upload

```
Pilih file → Konfirmasi Upload → Antrian upload (background)
                                      ↓
                              Upload file 1 → 2 → 3 ...
                                      ↓
                              Dokumen masuk antrian backend (queued)
```

### Polling status dokumen

| Kondisi | Perilaku |
|---------|----------|
| Tidak ada dokumen pending | Cek status **1x**, lalu berhenti |
| Ada dokumen `queued` / `processing` | Polling tiap **3 detik** |
| Semua selesai | Polling berhenti otomatis |

Polling dijalankan oleh `DocumentWatcher` di semua halaman dashboard.

---

## Engine & Worker

### Model worker pool (mock)

```
Antrian dokumen (queued)
        │
        ├── Worker 1 → processing
        ├── Worker 2 → processing
        └── Worker 3 → processing
```

- Satu antrian FIFO, **3 worker** paralel (mock)
- Dokumen berstatus `processing` memiliki field `workerId`
- Engine dashboard menampilkan status cluster + tabel worker (collapsible)

### Engine dashboard (admin)

- Status cluster: Siaga / Menunggu Antrian / Sedang Berjalan
- Statistik: antrian, sedang diproses, selesai hari ini, total selesai
- Tabel worker di bagian bawah (bisa dibuka/tutup)
- Polling on-demand saat engine aktif atau masih ada antrian

---

## Skor Parsial & Aspek Tidak Dapat Dihitung

Dokumen RAT biasanya hanya berisi angka — **tidak** memuat jawaban pertanyaan manajemen. Lihat [TIDAK_DAPAT_DIHITUNG.md](./TIDAK_DAPAT_DIHITUNG.md).

### Aspek yang tidak dapat dihitung (bobot 15)

| Komponen | Jumlah Pertanyaan |
|----------|-------------------|
| Manajemen Umum | 12 |
| Kelembagaan | 6 |
| Manajemen Permodalan | 5 |
| Manajemen Aktiva | 10 |
| Manajemen Likuiditas | 5 |

### Tampilan di halaman detail hasil

```
┌─────────────────────────────────────────────────────────────────┐
│  Ringkasan: Skor Parsial 64.35/85  ·  Persentase Parsial 75.7% │
├──────────────────────────────────────┬──────────────────────────┤
│  Tabel Hasil (dapat dihitung)        │  Panel Tidak Dapat       │
│  Permodalan, KAP, Efisiensi, ...     │  Dihitung (Manajemen)    │
└──────────────────────────────────────┴──────────────────────────┘
```

---

## Tech Stack

### Core

| Teknologi | Versi | Peran |
|-----------|-------|-------|
| [React](https://react.dev/) | 19.x | Library UI |
| [React Router DOM](https://reactrouter.com/) | 7.x | Routing, route guard |
| [Vite](https://vite.dev/) | 6.x | Dev server & build |
| JavaScript (ES2022+) | — | Bahasa pemrograman |

### Styling & UI

| Teknologi | Versi | Peran |
|-----------|-------|-------|
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | Utility-first styling |
| [lucide-react](https://lucide.dev/) | 0.511.x | Icon set |

### State, Upload & HTTP

| Teknologi | Versi | Peran |
|-----------|-------|-------|
| [Zustand](https://zustand.docs.pmnd.rs/) | 5.x | State management (multi-store) |
| [react-dropzone](https://react-dropzone.js.org/) | 14.x | Drag & drop upload |
| [Axios](https://axios-http.com/) | 1.x | HTTP client + auth interceptor |

---

## Prasyarat

- **Node.js** 18+ (disarankan 20 LTS)
- **npm** 9+

---

## Instalasi & Menjalankan

```bash
cd autoskor
npm install
copy .env.example .env        # Windows
# cp .env.example .env      # Linux / macOS
npm run dev
```

Buka `http://localhost:5173` — redirect ke `/login`.

### Cara Menggunakan (Mock Mode)

1. Login dengan akun demo (admin atau operator)
2. Buka **Upload** → drag & drop file PDF/DOCX (maks. 20 MB per file)
3. Klik **Konfirmasi Upload** → file masuk antrian upload background
4. (Opsional) Tambah file baru sambil upload masih berjalan
5. Buka **Antrian** → dokumen muncul (`Menunggu` → `Sedang Diproses`)
6. Saat selesai → toast notifikasi + dokumen pindah ke **Selesai**
7. Klik dokumen di **Selesai** → lihat skor parsial & tabel hasil
8. (Admin) Buka **Engine** → pantau worker & status cluster

---

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK=true
```

| Variable | Default | Deskripsi |
|----------|---------|-----------|
| `VITE_API_BASE_URL` | `http://localhost:8000/api` | Base URL backend API |
| `VITE_USE_MOCK` | `true` | `true` = mock, `false` = backend nyata |

---

## Struktur Proyek

Struktur **modular berbasis fitur**:

```
autoskor/
├── public/
├── src/
│   ├── app/
│   │   └── App.js                   # Definisi routing
│   ├── features/
│   │   ├── auth/                    # Login, guard, session
│   │   │   ├── api/authApi.js
│   │   │   ├── components/          # ProtectedRoute, AdminRoute
│   │   │   ├── pages/LoginPage.js
│   │   │   ├── store/useAuthStore.js
│   │   │   └── index.js
│   │   ├── upload/                  # Upload & antrian file
│   │   │   ├── components/          # UploadArea, UploadProgress
│   │   │   ├── pages/UploadPage.js
│   │   │   ├── store/useUploadStore.js
│   │   │   ├── constants.js
│   │   │   └── index.js
│   │   ├── documents/               # Antrian, selesai, polling
│   │   │   ├── api/documentsApi.js
│   │   │   ├── components/          # DocumentTable, DocumentWatcher, ...
│   │   │   ├── pages/               # QueuePage, ProcessedPage, ...
│   │   │   ├── store/useDocumentStore.js
│   │   │   └── index.js
│   │   ├── results/                 # Tampilan skor & tabel hasil
│   │   │   ├── components/
│   │   │   └── index.js
│   │   └── engine/                  # Engine dashboard (admin)
│   │       ├── api/engineApi.js
│   │       ├── components/          # WorkerTable, WorkerSection
│   │       ├── pages/EngineDashboardPage.js
│   │       └── index.js
│   ├── shared/
│   │   ├── api/
│   │   │   ├── client.js            # Axios + token interceptor
│   │   │   ├── config.js
│   │   │   └── mock/                # Simulasi auth, dokumen, engine
│   │   ├── layout/                  # MainLayout, Sidebar, UserMenu
│   │   ├── ui/Toast.js
│   │   ├── store/useUiStore.js      # Sidebar + toast
│   │   ├── utils/                   # format.js, colorGrading.js
│   │   └── constants/upload.js
│   ├── main.js
│   └── index.css
├── API_CONTRACT.md
├── ARSITEKTUR.md
├── TECH_STACK.md
├── TIDAK_DAPAT_DIHITUNG.md
├── STRUKTUR_PROYEK.md
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

### Path Alias

```js
import { LoginPage } from '@/features/auth'
import { UploadPage } from '@/features/upload'
import { MainLayout } from '@/shared/layout/MainLayout'
```

---

## Pendekatan JavaScript Murni

Tidak memakai TypeScript maupun JSX — semua UI dirender dengan `React.createElement`:

```js
import { createElement as h, Fragment } from 'react'

export default function App() {
  return h('div', { className: 'min-h-screen' }, 'Hello AutoSkor')
}
```

---

## Arsitektur & Alur Kerja

```
User → Login → Frontend (Upload / Antrian / Selesai / Engine*)
              │
              ├── POST /auth/login
              ├── GET  /auth/me
              ├── POST /documents/upload     (satu file per request)
              ├── GET  /documents?status=... (antrian & selesai)
              ├── GET  /documents/:id/results
              └── GET  /engine/status        (admin)
              │
              ▼
         Backend → Queue → Worker Pool → Engine
```

### Siklus dokumen

```
Upload → queued → processing → done
         (antrian)  (N worker)   (toast + lihat hasil)
```

### Peran frontend vs backend

| Lapisan | Tugas |
|---------|-------|
| **Frontend** | Auth, upload file, pantau antrian, tampilkan hasil, monitor engine |
| **Backend** | Terima file, kelola antrian & status, kelola worker |
| **Engine** | OCR, ekstrak data, hitung skor |

Detail lengkap: [ARSITEKTUR.md](./ARSITEKTUR.md)

---

## State Management

State global dipisah per domain (Zustand):

| Store | Lokasi | Tanggung jawab |
|-------|--------|----------------|
| `useAuthStore` | `features/auth/store` | Login, user, logout, session |
| `useUploadStore` | `features/upload/store` | File pilihan, antrian upload, progress |
| `useDocumentStore` | `features/documents/store` | List dokumen, polling, hasil skor |
| `useUiStore` | `shared/store` | Sidebar collapse, toast notifikasi |

### State utama

| Store | State / Action | Deskripsi |
|-------|----------------|-----------|
| `useAuthStore` | `user`, `token`, `login()`, `logout()` | Sesi user |
| `useUploadStore` | `selectedFiles`, `uploadQueue`, `processUploadQueue()` | Upload async |
| `useDocumentStore` | `queueDocuments`, `hasPendingDocuments`, `checkDocumentStatusUpdates()` | Dokumen & polling |
| `useUiStore` | `toast`, `showToast()`, `sidebarCollapsed` | UI global |

---

## Integrasi Backend

> Kontrak API lengkap untuk tim backend: [API_CONTRACT.md](./API_CONTRACT.md)

### Endpoint

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| `POST` | `/auth/login` | Login user |
| `GET` | `/auth/me` | Data user yang sedang login |
| `POST` | `/auth/logout` | Logout |
| `POST` | `/documents/upload` | Upload satu file (`multipart/form-data`) |
| `GET` | `/documents?status=queue` | List antrian (queued + processing) |
| `GET` | `/documents?status=done` | List dokumen selesai |
| `GET` | `/documents/:id/results` | Hasil penilaian skor |
| `GET` | `/engine/status` | Status cluster + daftar worker |

### Backend nyata

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK=false
```

Restart dev server setelah mengubah `.env`. Timeout Axios: **120 detik**.

---

## Skema Data Hasil

`GET /documents/:id/results` mengembalikan:

```js
{
  document: { id, fileName, fileSize, status, uploadedAt },
  results: {
    totalSkorParsial: 64.35,
    persentaseParsial: 75.7,
    bobotDapatDihitung: 85,
    predikat: 'CUKUP SEHAT',
    tidakDapatDihitung: { aspek, bobot, skor, flag, catatan, komponen[] },
    detail: [
      {
        aspek: 'Permodalan',
        komponen: 'Rasio Modal Sendiri terhadap Total Asset',
        nilaiRasio: 45.67,
        nilai: 50,
        bobot: 6,
        skor: 3.0,
        persentaseMaks: 50,
        status: 'Kuning'
      }
    ]
  }
}
```

---

## Color Grading

| Status | Kondisi |
|--------|---------|
| **Hijau** | ≥ 85% dari nilai maksimal komponen |
| **Kuning** | ≥ 50% dan < 85% |
| **Merah** | < 50% |
| **Tidak Dapat Dihitung** | Aspek Manajemen — data tidak tersedia |

### 7 Aspek Penilaian (Permen KUKM No. 14/2009)

| No | Aspek | Bobot | Keterangan |
|----|-------|-------|------------|
| 1 | Permodalan | 15 | Dapat dihitung |
| 2 | Kualitas Aktiva Produktif | 25 | Dapat dihitung |
| 3 | Manajemen | 15 | **Tidak dapat dihitung** dari RAT saja |
| 4 | Efisiensi | 10 | Dapat dihitung |
| 5 | Likuiditas | 15 | Dapat dihitung |
| 6 | Kemandirian dan Pertumbuhan | 10 | Dapat dihitung |
| 7 | Jatidiri Koperasi | 10 | Dapat dihitung |

**Skor parsial: 85 bobot** (tanpa Manajemen).

---

## Scripts NPM

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Development server (hot reload) |
| `npm run build` | Build production ke `dist/` |
| `npm run preview` | Preview build production |

---

## Build & Deploy

```bash
npm run build
npm run preview
```

Deploy folder `dist/` ke hosting statis (Vercel, Netlify, Nginx, dll.).

---

## Roadmap

- [x] Setup React + Vite + Tailwind (JavaScript murni)
- [x] Upload area dengan react-dropzone
- [x] Skor parsial & panel Tidak Dapat Dihitung
- [x] Sidebar + React Router
- [x] Halaman antrian & selesai
- [x] Toast notifikasi upload & selesai diproses
- [x] Polling on-demand (hanya saat ada antrian aktif)
- [x] Autentikasi user (login, guard, role admin/operator)
- [x] Upload async dengan antrian background
- [x] Validasi PDF/DOCX, 20 MB per file
- [x] Struktur modular (features + shared)
- [x] Engine dashboard + multi-worker mock
- [ ] Integrasi backend production
- [ ] Daftar koperasi
- [ ] Filter & search
- [ ] Export PDF / Excel
- [ ] Preview dokumen
- [ ] Halaman profile & edit akun

---

## Dokumen Terkait

- [API_CONTRACT.md](./API_CONTRACT.md) — Kontrak API untuk tim backend
- [ARSITEKTUR.md](./ARSITEKTUR.md) — Diagram arsitektur & alur sistem
- [TECH_STACK.md](./TECH_STACK.md) — Penjelasan teknologi lengkap
- [TIDAK_DAPAT_DIHITUNG.md](./TIDAK_DAPAT_DIHITUNG.md) — Aspek Manajemen tidak dapat dihitung
- [STRUKTUR_PROYEK.md](./STRUKTUR_PROYEK.md) — Struktur folder proyek

---

## Lisensi

Proyek private — `private: true` di `package.json`.