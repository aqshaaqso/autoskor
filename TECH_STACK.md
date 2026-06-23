# Tech Stack — AutoSkor

Penjelasan teknologi, alasan pemilihan, dan kegunaan di proyek ini.

---

## Gambaran Besar

AutoSkor adalah SPA frontend untuk:

1. Upload dokumen RAT koperasi (multi-file, max 20 MB total)
2. Memantau antrian scoring jobs di middleware
3. Menampilkan hasil penilaian kesehatan koperasi (KSP/USP)
4. Monitoring engine & aktivitas user (admin)

Frontend **tidak** memproses/hitung skor — hanya upload, monitoring, dan tampil hasil.

```
Browser (React + Router)
     │
     ├── Upload Page     → POST /scoring-jobs/upload
     ├── Queue Page      → GET /scoring-jobs (antrian)
     ├── Processed Page  → GET /scoring-jobs (selesai)
     ├── Detail Page     → GET /scoring-jobs/{id}
     └── Engine Page     → GET /scoring-jobs (agregasi, admin)
     │
     ▼
Axios  →  Middleware API  →  Engine (callback)
```

---

## Daftar Teknologi

| Teknologi | Versi | Kategori |
|-----------|-------|----------|
| JavaScript (ES2022+) | — | Bahasa |
| React | 19.x | UI Library |
| React DOM | 19.x | UI Renderer |
| React Router DOM | 7.6.x | Routing |
| Vite | 6.x | Build Tool |
| Tailwind CSS | 4.x | Styling |
| @tailwindcss/vite | 4.x | Tailwind + Vite |
| Zustand | 5.x | State Management |
| Axios | 1.x | HTTP Client |
| react-dropzone | 14.x | File Upload |
| lucide-react | 0.511.x | Icons |
| docx-preview | 0.3.x | Preview dokumen Word |
| jspdf | 4.x | Generate laporan hasil PDF |
| jspdf-autotable | 5.x | Tabel skor di laporan PDF |
| @vitejs/plugin-react | 4.x | Dev Tool |

---

## React 19 — UI

Komponen dirender dengan `React.createElement` (alias `h`), **bukan JSX**.

| Komponen / Halaman | Fungsi |
|--------------------|--------|
| `UploadPage` | Upload multi-file |
| `QueuePage` | Antrian dokumen |
| `ProcessedPage` | Daftar selesai |
| `ProcessedDetailPage` | Detail hasil skor |
| `FilePreviewPage` | Preview dokumen |
| `LoginPage` | Autentikasi |
| `EngineDashboardPage` | Dashboard engine (admin) |
| `UserActivityPage` | Log aktivitas (admin) |
| `DocumentTable` | Tabel list dokumen + hapus antrian |
| `DocumentDetailModal` | Detail metadata + preview file upload |
| `DocumentWatcher` | Polling status background |
| `DownloadResultPdfButton` | Pratinjau & unduh laporan PDF |
| `ResultsTable` / `TidakDapatDihitungPanel` | Tampilan hasil skor |
| `Toast` / `PageLoader` / `ConfirmDialog` | Notifikasi, loading, konfirmasi |

Halaman utama di-load lazy via `lazyPages.js`.

---

## React Router DOM 7 — Navigasi

| Path | Halaman |
|------|---------|
| `/login` | Login |
| `/upload` | Upload |
| `/preview/:previewId` | Preview file |
| `/queue` | Antrian |
| `/processed` | Selesai |
| `/processed/:id` | Detail skor |
| `/engine` | Engine dashboard |
| `/admin/activity` | Aktivitas user |

Komponen: `BrowserRouter`, `Routes`, `Route`, `NavLink`, `Outlet`, `Navigate`, `useParams`.

Guard: `ProtectedRoute` (user login), `AdminRoute` (role admin).

---

## Zustand — State Management

State dipisah per fitur, bukan satu store besar:

| Store | Isi utama |
|-------|-----------|
| `useAuthStore` | User, token, login/logout |
| `useUploadStore` | File terpilih, progress upload |
| `useDocumentStore` | Antrian, selesai, hasil, polling |
| `useUiStore` | Toast, sidebar collapsed |

Actions utama dokumen: `uploadFiles()`, `fetchQueueDocuments()`, `fetchProcessedDocuments()`, `fetchDocumentResults()`, `checkDocumentStatusUpdates()`.

---

## Axios — HTTP Client

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| POST | `/scoring-jobs/upload` | Upload multi-file |
| GET | `/scoring-jobs` | List jobs (filter status) |
| GET | `/scoring-jobs/{id}` | Detail + hasil skor |
| GET | `/scoring-jobs/{id}/file` | File asli (preview) |
| POST | `/scoring-jobs/{id}/cancel` | Batalkan job |

Layer: `scoringJobsApi.js` → `documentsApi.js` → `useDocumentStore`.

Mock per domain dikontrol `config.js` (`VITE_USE_MOCK`, `VITE_USE_MOCK_AUTH`, dll.).

Kontrak: [API_CONTRACT.md](./API_CONTRACT.md)

---

## react-dropzone — Upload

- Multi-file drag & drop
- Validasi PDF, DOCX
- Validasi total 20 MB di frontend
- Disable saat upload berjalan

---

## Tailwind CSS 4

Layout sidebar + konten, tabel, toast, color grading (Hijau/Kuning/Merah). Tema custom di `index.css`.

---

## Yang Sengaja Tidak Dipakai

| Tech | Alasan |
|------|--------|
| TypeScript | Requirement: JavaScript murni |
| JSX | Requirement: `createElement` langsung |
| Redux | Zustand cukup ringan |
| UI library (MUI, dll.) | Tailwind + komponen custom |
| Next.js | Pure client SPA |
| React Query | Polling manual via DocumentWatcher |
| WebSocket | Polling HTTP cukup |

---

## Alur Kerja Stack

### Upload
1. `UploadPage` → `UploadDropzone` / `UploadArea`
2. Validasi 20 MB
3. `useUploadStore` → `documentsApi` → `POST /scoring-jobs/upload`
4. Toast: "Dokumen berhasil diupload"

### Antrian & notifikasi
5. `QueuePage` → `GET /scoring-jobs` (filter antrian)
6. `DocumentWatcher` polling 3 detik → toast selesai
7. Auto-refresh antrian (5 detik) & list selesai

### Hasil
8. `ProcessedPage` → list selesai
9. Klik → `ProcessedDetailPage` → `GET /scoring-jobs/{id}`
10. Tampil `ScoreSummary` + `ResultsTable` + `TidakDapatDihitungPanel`
11. **Pratinjau PDF** → modal iframe (`generateResultPdf.js`)
12. **Unduh PDF** → `doc.save()` via jsPDF

---

## Dokumen Terkait

- [ARSITEKTUR.md](./ARSITEKTUR.md) — Diagram alur sistem
- [API_CONTRACT.md](./API_CONTRACT.md) — Kontrak middleware
- [README.md](./README.md) — Instalasi & ringkasan
- [STRUKTUR_PROYEK.md](./STRUKTUR_PROYEK.md) — Struktur folder
- [TIDAK_DAPAT_DIHITUNG.md](./TIDAK_DAPAT_DIHITUNG.md) — Aspek Manajemen