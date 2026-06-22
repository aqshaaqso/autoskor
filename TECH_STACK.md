# Tech Stack — AutoSkor

Penjelasan teknologi, alasan pemilihan, dan kegunaan di proyek ini.

---

## Gambaran Besar

AutoSkor adalah Single Page Application (SPA) frontend untuk:

1. Upload dokumen RAT koperasi (multi-file, max 20MB total)
2. Memantau antrian dokumen di backend
3. Menampilkan hasil penilaian kesehatan koperasi (KSP/USP)

Frontend **tidak** memproses/hitung skor — hanya upload, monitoring, dan tampil hasil. Proses engine ada di backend.

### Diagram arsitektur

```
Browser (React + Router)
     │
     ├── Upload Page    → POST dokumen ke backend
     ├── Queue Page     → GET dokumen antrian
     └── Processed Page → GET dokumen selesai + hasil skor
     │
     ▼
Axios  →  Backend API  →  Queue  →  Engine
```

---

## Daftar Teknologi

| No | Teknologi | Versi Terinstall | Kategori |
|----|-----------|------------------|----------|
| 1 | JavaScript (ES2022+) | — | Bahasa |
| 2 | React | 19.2.7 | UI Library |
| 3 | React DOM | 19.2.7 | UI Renderer |
| 4 | React Router DOM | 7.6.2 | Routing / Navigasi |
| 5 | Vite | 6.4.3 | Build Tool |
| 6 | Tailwind CSS | 4.3.1 | Styling |
| 7 | @tailwindcss/vite | 4.3.1 | Tailwind + Vite |
| 8 | Zustand | 5.0.14 | State Management |
| 9 | Axios | 1.18.0 | HTTP Client |
| 10 | react-dropzone | 14.4.1 | File Upload |
| 11 | lucide-react | 0.511.0 | Icons |
| 12 | @vitejs/plugin-react | 4.7.0 | Dev Tool (React) |

---

## 1. JavaScript (ES2022+) — Bahasa Utama

**Apa itu:** Bahasa pemrograman yang dijalankan di browser.

**Kenapa dipilih:**
- Requirement: JavaScript murni, tanpa TypeScript
- Tidak perlu compile type checking terpisah
- Cukup untuk dashboard dengan logika menengah

**Kegunaan di AutoSkor:**
- Semua komponen UI, halaman, layout, sidebar
- State management (Zustand store)
- Service API & mock backend
- Utility (formatters, color grading)

**Catatan:** UI dirender dengan `React.createElement` (alias `h`), **bukan JSX**.

---

## 2. React 19 — Library UI

**Apa itu:** Library berbasis komponen untuk membangun antarmuka interaktif.

**Kenapa dipilih:**
- Standar industri untuk dashboard & portal web
- Component-based — mudah pisahkan Upload, Antrian, Selesai
- UI reaktif — otomatis update saat state berubah
- Ekosistem luas (router, dropzone, icon)

**Kegunaan di AutoSkor:**

| Komponen / Halaman | Fungsi |
|--------------------|--------|
| `UploadPage` | Halaman upload multi-file |
| `QueuePage` | Halaman antrian dokumen |
| `ProcessedPage` | Daftar dokumen selesai |
| `ProcessedDetailPage` | Detail hasil skor |
| `UploadArea` | Drag & drop + validasi 20MB |
| `DocumentTable` | Tabel list dokumen |
| `ScoreSummary` | Ringkasan skor parsial |
| `ResultsTable` | Tabel skor per aspek |
| `NonProcessAble` | Panel Manajemen tidak dapat dihitung |
| `Toast` | Popup notifikasi |
| `DocumentWatcher` | Polling status dokumen di background |

**React DOM:** Merender komponen React ke HTML di browser.

---

## 3. React Router DOM 7 — Navigasi & Routing

**Apa itu:** Library routing untuk SPA — mengatur halaman berdasarkan URL tanpa reload browser.

**Kenapa dipilih:**
- Sidebar punya 3 halaman terpisah (Upload, Antrian, Selesai)
- URL bisa di-bookmark (`/upload`, `/queue`, `/processed`)
- Tombol back browser berfungsi
- Detail hasil punya URL sendiri (`/processed/:id`)

**Route yang dipakai:**

| Path | Halaman |
|------|---------|
| `/upload` | Upload dokumen |
| `/queue` | Antrian dokumen |
| `/processed` | Dokumen selesai (list) |
| `/processed/:id` | Detail hasil penilaian |

**Komponen Router yang dipakai:**
- `BrowserRouter` → wrapper di `main.js`
- `Routes` / `Route` → definisi halaman di `App.js`
- `NavLink` → menu aktif di sidebar
- `Outlet` → area konten di `MainLayout`
- `useParams` → ambil ID dokumen di halaman detail
- `Navigate` → redirect default ke `/upload`

---

## 4. Vite 6 — Build Tool & Dev Server

**Apa itu:** Tool development (hot reload) dan build production.

**Kenapa dipilih:**
- Dev server sangat cepat (native ES modules)
- Config minimal (~15 baris)
- Build output optimal untuk deploy statis
- Standar modern untuk proyek React baru

**Scripts:**

| Command | Fungsi |
|---------|--------|
| `npm run dev` | localhost:5173 (hot reload) |
| `npm run build` | output ke folder `dist/` |
| `npm run preview` | preview build production |

**Fitur dipakai:**
- Path alias `@/` → `src/`
- Plugin React + Tailwind terintegrasi

---

## 5. Tailwind CSS 4 — Styling

**Apa itu:** Framework CSS utility-first. Styling lewat `className` di komponen.

**Kenapa dipilih:**
- Cepat untuk MVP — tanpa file CSS per komponen
- Konsisten (spacing, warna, typography)
- Responsive mudah (`sm:`, `lg:`)
- Cukup untuk dashboard tanpa UI library berat

**Kegunaan di AutoSkor:**
- Layout sidebar + konten utama
- Upload area, tabel dokumen, tabel skor
- Toast notifikasi (sukses/error)
- Color grading: Hijau / Kuning / Merah
- Custom theme di `index.css` (primary, success, warning, danger)

---

## 6. Zustand 5 — State Management

**Apa itu:** Library state global ringan. Semua komponen akses data sama tanpa prop drilling.

**Kenapa dipilih (bukan Redux):**
- Minimal boilerplate — satu file `useKoperasiStore.js`
- API sederhana, mirip `useState` global
- Cukup untuk state ukuran menengah
- Redux terlalu berat untuk kebutuhan ini

**State yang dikelola:**

| State | Isi |
|-------|-----|
| `selectedFiles` | File yang dipilih untuk upload |
| `isUploading` | Sedang upload atau tidak |
| `uploadProgress` | Progress upload 0–100% |
| `toast` | Notifikasi popup aktif |
| `queueDocuments` | List dokumen antrian |
| `processedDocuments` | List dokumen selesai |
| `documentStatusMap` | Tracking status untuk deteksi selesai |
| `documentResult` | Hasil skor dokumen yang dibuka |
| `sidebarCollapsed` | Sidebar ciut/perluas |

**Actions utama:**
- `uploadFiles()` → Upload multi-file ke backend
- `fetchQueueDocuments()` → Ambil list antrian
- `fetchProcessedDocuments()` → Ambil list selesai
- `fetchDocumentResults(id)` → Ambil hasil skor
- `checkDocumentStatusUpdates()` → Polling + notif selesai
- `showToast()` / `clearToast()` → Kelola popup notifikasi

---

## 7. Axios — HTTP Client

**Apa itu:** Library komunikasi HTTP ke backend API.

**Kenapa dipilih (bukan fetch native):**
- API ergonomis — `post()`, `get()`, error handling
- `onUploadProgress` — track progress upload file
- Timeout configurable (120 detik)
- Mudah tambah interceptor (auth token nanti)

**Endpoint yang dipakai:**

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| POST | `/documents/upload` | Upload multi-file |
| GET | `/documents?status=queue` | List antrian |
| GET | `/documents?status=done` | List selesai |
| GET | `/documents/:id/results` | Hasil skor dokumen |

**Mock mode:** Simulasi upload, antrian FIFO, engine proses satu-per-satu, dan hasil skor.

Detail kontrak API: [API_CONTRACT.md](./API_CONTRACT.md)

---

## 8. react-dropzone — File Upload

**Apa itu:** Library drag & drop upload file untuk React.

**Kenapa dipilih:**
- UX drag & drop lebih baik dari input file biasa
- Validasi built-in (tipe file, multiple)
- State visual: `isDragActive`, `isDragReject`

**Kegunaan di AutoSkor:**
- Multi-file upload (`multiple: true`)
- Validasi format: PDF, JPG, PNG, WEBP
- Validasi total ukuran max 20MB (di FE)
- Disable saat sedang upload

---

## 9. lucide-react — Icon Set

**Apa itu:** Kumpulan icon SVG sebagai komponen React.

**Kenapa dipilih:**
- Ringan, tree-shakeable
- Visual konsisten
- Tidak perlu file gambar terpisah

**Icon yang dipakai:**
`Upload`, `FileText`, `X`, `AlertCircle`, `Loader2`, `CheckCircle2`, `ListOrdered`, `Check`, `RefreshCw`, `ArrowLeft`, `ChevronLeft`, `ChevronRight`

---

## 10. @vitejs/plugin-react — Dev Tool

**Kegunaan:**
- Fast Refresh — edit kode, browser update tanpa hilang state
- Dukungan React di Vite tanpa JSX

---

## Yang Sengaja Tidak Dipakai

| Tech | Alasan |
|------|--------|
| TypeScript | Requirement: JavaScript murni |
| JSX | Requirement: `createElement` langsung |
| Redux | State cukup ditangani Zustand |
| UI library (MUI, dll) | Tailwind + komponen custom cukup |
| Next.js | Tidak perlu SSR — pure client SPA |
| Toast library | Komponen Toast custom sudah cukup |
| React Query | Polling manual via DocumentWatcher + Zustand |
| Backend di repo ini | Frontend terpisah, backend service sendiri |
| WebSocket | Polling HTTP cukup untuk MVP |

---

## Alur Kerja Stack

### Upload
1. `UploadPage` → `UploadArea` (react-dropzone)
2. Validasi total 20MB
3. Zustand `uploadFiles()` → Axios `POST /documents/upload`
4. `onUploadProgress` → progress bar upload saja
5. Toast: "Dokumen berhasil diupload"

### Antrian
6. Backend masukkan ke queue (mock: FIFO satu-per-satu)
7. `QueuePage` → Axios GET antrian → `DocumentTable`
8. Auto-refresh tiap 5 detik

### Notifikasi selesai
9. `DocumentWatcher` polling tiap 3 detik (semua halaman)
10. Status berubah ke `done` → Toast popup + link "Lihat Hasil"
11. Auto-refresh list Antrian & Selesai

### Hasil
12. `ProcessedPage` → list dokumen selesai
13. Klik dokumen → `ProcessedDetailPage`
14. Axios `GET /documents/:id/results`
15. Tampil `ScoreSummary` + `ResultsTable` + `NonProcessAble`

---

## Versi Terinstall

| Paket | Versi Terinstall | Range package.json |
|-------|------------------|-------------------|
| React | 19.2.7 | ^19.1.0 |
| React DOM | 19.2.7 | ^19.1.0 |
| React Router DOM | 7.6.2 | ^7.6.2 |
| Vite | 6.4.3 | ^6.3.5 |
| Tailwind CSS | 4.3.1 | ^4.1.8 |
| @tailwindcss/vite | 4.3.1 | ^4.1.8 |
| Zustand | 5.0.14 | ^5.0.5 |
| Axios | 1.18.0 | ^1.9.0 |
| react-dropzone | 14.4.1 | ^14.3.8 |
| lucide-react | 0.511.0 | ^0.511.0 |
| @vitejs/plugin-react | 4.7.0 | ^4.5.1 |

---

## Kalimat Pembuka untuk Mentor

> AutoSkor dibangun sebagai SPA dengan React 19 (JavaScript murni, tanpa TypeScript/JSX), di-bundle pakai Vite. Navigasi multi-halaman memakai React Router DOM — Upload, Antrian, dan Selesai — dengan sidebar. State global dikelola Zustand. Komunikasi backend lewat Axios dengan progress upload. Upload multi-file pakai react-dropzone (max 20MB total). Styling Tailwind CSS 4. Frontend hanya upload dan monitoring — proses skor di backend/engine. Notifikasi popup custom memberitahu user saat dokumen selesai diproses.

---

## Dokumen Terkait

- [ARSITEKTUR.md](./ARSITEKTUR.md) — Diagram alur & arsitektur sistem
- [API_CONTRACT.md](./API_CONTRACT.md) — Kontrak API untuk tim backend
- [README.md](./README.md) — Dokumentasi proyek
- [STRUKTUR_PROYEK.md](./STRUKTUR_PROYEK.md) — Struktur folder proyek
- [TIDAK_DAPAT_DIHITUNG.md](./TIDAK_DAPAT_DIHITUNG.md) — Aspek Manajemen tidak dapat dihitung