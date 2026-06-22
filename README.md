# AutoSkor — Portal Upload & Monitoring Penilaian Kesehatan Koperasi

Frontend SPA untuk upload dokumen RAT, memantau antrian proses, dan menampilkan hasil penilaian kesehatan **Koperasi Simpan Pinjam (KSP)** dan **Unit Simpan Pinjam (USP)** berdasarkan **Permen KUKM No. 14/Per/M.KUKM/XII/2009**.

Ditulis dengan **JavaScript murni** — tanpa TypeScript, tanpa JSX. UI dirender memakai `React.createElement`.

Frontend **hanya** upload & monitoring — proses hitung skor dilakukan oleh **backend/engine**, bukan di browser.

---

## Daftar Isi

- [Fitur](#fitur)
- [Halaman & Routing](#halaman--routing)
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
| Sidebar + routing | 3 halaman: Upload, Antrian, Selesai |
| Upload multi-file | Drag & drop banyak file, **total maks. 20 MB** |
| Progress upload | Progress bar hanya saat upload ke backend |
| Toast notifikasi | Popup sukses upload & dokumen selesai diproses |
| Halaman antrian | List dokumen `Menunggu` / `Sedang Diproses`, auto-refresh |
| Proses FIFO | Engine mock memproses dokumen **satu per satu** |
| Halaman selesai | List dokumen selesai + detail hasil skor |
| Skor parsial | Persentase dari 85 bobot (tanpa Manajemen) |
| Panel tidak dapat dihitung | Aspek Manajemen terpisah, skor = 0 |
| Color grading | Status Hijau / Kuning / Merah per komponen |
| Mock mode | Testing UI tanpa backend nyata |

### Phase 2 (Belum Tersedia)

- Daftar koperasi
- Filter & search dokumen
- Export hasil (PDF / Excel)
- Preview PDF yang diupload
- Autentikasi user

---

## Halaman & Routing

| Route | Halaman | Fungsi |
|-------|---------|--------|
| `/upload` | Upload | Pilih & upload dokumen RAT |
| `/queue` | Antrian | Dokumen menunggu / sedang diproses |
| `/processed` | Selesai | Daftar dokumen yang sudah jadi |
| `/processed/:id` | Detail Hasil | Tabel skor + ringkasan parsial |

```
┌──────────────┬──────────────────────────────────┐
│  SIDEBAR     │  Konten halaman aktif (Outlet)   │
│              │                                  │
│  ● Upload    │  /upload    → UploadPage         │
│    Antrian   │  /queue     → QueuePage          │
│    Selesai   │  /processed → ProcessedPage      │
│              │  /processed/:id → Detail skor    │
└──────────────┴──────────────────────────────────┘
```

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

> Versi di bawah adalah versi **terinstall** (`npm list --depth=0`).

### Core

| Teknologi | Versi Terinstall | Range `package.json` | Peran |
|-----------|------------------|----------------------|-------|
| [React](https://react.dev/) | **19.2.7** | `^19.1.0` | Library UI |
| [React DOM](https://react.dev/) | **19.2.7** | `^19.1.0` | React renderer |
| [React Router DOM](https://reactrouter.com/) | **7.6.2** | `^7.6.2` | Routing & navigasi |
| [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) | ES2022+ | — | Bahasa pemrograman |
| [Vite](https://vite.dev/) | **6.4.3** | `^6.3.5` | Dev server & build |

### Styling & UI

| Teknologi | Versi Terinstall | Range `package.json` | Peran |
|-----------|------------------|----------------------|-------|
| [Tailwind CSS](https://tailwindcss.com/) | **4.3.1** | `^4.1.8` | Utility-first styling |
| [@tailwindcss/vite](https://tailwindcss.com/docs/installation/using-vite) | **4.3.1** | `^4.1.8` | Integrasi Tailwind + Vite |
| [lucide-react](https://lucide.dev/) | **0.511.0** | `^0.511.0` | Icon set |

### State, Upload & HTTP

| Teknologi | Versi Terinstall | Range `package.json` | Peran |
|-----------|------------------|----------------------|-------|
| [Zustand](https://zustand.docs.pmnd.rs/) | **5.0.14** | `^5.0.5` | Global state management |
| [react-dropzone](https://react-dropzone.js.org/) | **14.4.1** | `^14.3.8` | Multi-file drag & drop |
| [Axios](https://axios-http.com/) | **1.18.0** | `^1.9.0` | HTTP client ke backend |

### Dev Tools

| Teknologi | Versi Terinstall | Range `package.json` | Peran |
|-----------|------------------|----------------------|-------|
| [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) | **4.7.0** | `^4.5.1` | Fast Refresh & dukungan React |

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

Buka `http://localhost:5173` — otomatis redirect ke `/upload`.

### Cara Menggunakan (Mock Mode)

1. Buka halaman **Upload** → drag & drop satu atau beberapa PDF (total ≤ 20 MB)
2. Klik **Upload Dokumen** → lihat progress upload → toast *"Dokumen berhasil diupload"*
3. Buka **Antrian** → dokumen muncul (`Menunggu` → `Sedang Diproses`, satu per satu)
4. Saat selesai → popup notifikasi muncul di semua halaman + link **Lihat Hasil**
5. Buka **Selesai** → klik dokumen → lihat skor parsial & tabel hasil

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

```
autoskor/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.js
│   │   │   ├── SidebarMenuItem.js
│   │   │   └── MainLayout.js
│   │   ├── UploadArea.js
│   │   ├── UploadProgress.js
│   │   ├── DocumentTable.js
│   │   ├── DocumentStatusBadge.js
│   │   ├── DocumentWatcher.js      # polling + notif selesai
│   │   ├── Toast.js
│   │   ├── ResultsTable.js
│   │   ├── ScoreSummary.js
│   │   ├── StatusBadge.js
│   │   └── NonProcessAble.js
│   ├── pages/
│   │   ├── UploadPage.js
│   │   ├── QueuePage.js
│   │   ├── ProcessedPage.js
│   │   └── ProcessedDetailPage.js
│   ├── store/
│   │   └── useKoperasiStore.js
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   └── colorGrading.js
│   ├── App.js
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
import { UploadArea } from '@/components/UploadArea'
import { useKoperasiStore } from '@/store/useKoperasiStore'
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
User → Frontend (Upload / Antrian / Selesai)
              │
              ├── POST /documents/upload     (multi-file)
              ├── GET  /documents?status=... (antrian & selesai)
              └── GET  /documents/:id/results
              │
              ▼
         Backend → Queue → Engine (di luar scope FE)
```

### Siklus dokumen

```
Upload → queued → processing → done
         (antrian)  (1 per satu)  (notif popup + lihat hasil)
```

### Peran frontend vs backend

| Lapisan | Tugas |
|---------|-------|
| **Frontend** | Upload file, tampilkan antrian, tampilkan hasil, notifikasi |
| **Backend** | Terima file, kelola antrian & status |
| **Engine** | OCR, ekstrak data, hitung skor |

Detail lengkap: [ARSITEKTUR.md](./ARSITEKTUR.md)

---

## State Management

State global di `src/store/useKoperasiStore.js` (Zustand).

| State | Deskripsi |
|-------|-----------|
| `selectedFiles` | File yang dipilih untuk upload |
| `isUploading` / `uploadProgress` | Status & progress upload |
| `toast` | Notifikasi popup aktif |
| `queueDocuments` | List dokumen antrian |
| `processedDocuments` | List dokumen selesai |
| `documentStatusMap` | Tracking status untuk deteksi selesai |
| `documentResult` | Hasil skor dokumen yang dibuka |

| Action | Deskripsi |
|--------|-----------|
| `uploadFiles()` | Upload multi-file ke backend |
| `fetchQueueDocuments()` | Ambil list antrian |
| `fetchProcessedDocuments()` | Ambil list selesai |
| `fetchDocumentResults(id)` | Ambil hasil skor |
| `checkDocumentStatusUpdates()` | Polling status + popup selesai |

---

## Integrasi Backend

> Kontrak API lengkap untuk tim backend: [API_CONTRACT.md](./API_CONTRACT.md)

### Endpoint

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| `POST` | `/documents/upload` | Upload multi-file (`multipart/form-data`) |
| `GET` | `/documents?status=queue` | List antrian (queued + processing) |
| `GET` | `/documents?status=done` | List dokumen selesai |
| `GET` | `/documents/:id/results` | Hasil penilaian skor |

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
- [x] Sidebar + React Router (3 halaman)
- [x] Upload multi-file (max 20 MB total)
- [x] Halaman antrian & selesai
- [x] Proses antrian FIFO (satu per satu)
- [x] Toast notifikasi upload & selesai diproses
- [ ] Integrasi backend production
- [ ] Daftar koperasi
- [ ] Filter & search
- [ ] Export PDF / Excel
- [ ] Preview PDF
- [ ] Autentikasi user

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