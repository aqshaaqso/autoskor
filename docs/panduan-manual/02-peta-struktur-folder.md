# 02 — Peta Struktur Folder

Panduan navigasi lengkap struktur `src/` agar Anda langsung tahu file mana yang harus dibuka.

---

## Gambaran Arsitektur Folder

```
autoskor/
├── docs/panduan-manual/     ← Anda di sini
├── public/                  ← Asset statis (favicon, dll.)
├── scripts/                 ← Script utilitas (test middleware)
├── src/                     ← SEMUA kode aplikasi
│   ├── app/                 ← Entry routing
│   ├── features/            ← Modul bisnis per domain
│   └── shared/              ← Kode lintas fitur
├── .env                     ← Konfigurasi lokal (gitignored)
├── .env.example             ← Template env
├── index.html               ← HTML shell Vite
├── package.json
└── vite.config.js
```

---

## `src/app/` — Routing & Entry Aplikasi

| File | Tanggung jawab |
|------|----------------|
| `App.js` | Definisi semua `<Route>` React Router |
| `lazyPages.js` | Lazy import setiap halaman (code splitting) |

**Ubah jika:** menambah/menghapus route, mengubah guard (ProtectedRoute/AdminRoute), mengubah redirect default.

`main.js` (di `src/`) adalah bootstrap React — jarang perlu diubah.

---

## `src/features/` — Modul Per Domain

Setiap fitur punya struktur standar:

```
features/namaFitur/
├── api/           ← Pemanggilan HTTP / wrapper API
├── components/    ← Komponen khusus fitur ini
├── pages/         ← Halaman penuh (1 route = 1 page umumnya)
├── store/         ← Zustand store (jika butuh state)
├── utils/         ← Helper khusus fitur
├── constants.js   ← Konstanta fitur (opsional)
└── index.js       ← Barrel export (public API fitur)
```

### `features/auth/` — Autentikasi

| Path | Isi |
|------|-----|
| `api/authApi.js` | Login, logout, getCurrentUser (+ switch mock/real) |
| `components/ProtectedRoute.js` | Guard halaman user login |
| `components/AdminRoute.js` | Guard halaman khusus admin |
| `pages/LoginPage.js` | Form login |
| `store/useAuthStore.js` | State user, token, login/logout |
| `index.js` | Export public |

### `features/upload/` — Unggah Dokumen

| Path | Isi |
|------|-----|
| `components/UploadArea.js` | Container utama area upload |
| `components/UploadDropzone.js` | Drag & drop (react-dropzone) |
| `components/SelectedFilesList.js` | Daftar file terpilih + tombol preview |
| `pages/UploadPage.js` | Halaman `/upload` |
| `store/useUploadStore.js` | File terpilih, progress upload |
| `constants.js` | Batas ukuran, pesan validasi |

### `features/preview/` — Preview File

| Path | Isi |
|------|-----|
| `pages/FilePreviewPage.js` | Render PDF (iframe) / DOCX (docx-preview) |
| `utils/previewSession.js` | Session in-memory file lokal |
| `utils/openLocalFilePreview.js` | Buka tab preview file belum diupload |
| `utils/downloadPreviewFile.js` | Unduh file dari session preview |

Route:
- `/preview/:previewId` — file lokal
- `/preview/document/:documentId` — file dari server

### `features/documents/` — Antrian, Selesai, Hasil Skor

| Path | Isi |
|------|-----|
| `api/documentsApi.js` | Wrapper scoring jobs (upload, list, detail, cancel) |
| `store/useDocumentStore.js` | State antrian, selesai, detail hasil, polling map |
| `pages/QueuePage.js` | Halaman `/queue` |
| `pages/ProcessedPage.js` | Halaman `/processed` |
| `pages/ProcessedDetailPage.js` | Halaman `/processed/:id` |
| `components/DocumentTable.js` | Tabel dokumen reusable |
| `components/DocumentDetailModal.js` | Modal metadata dokumen |
| `components/DocumentWatcher.js` | Polling 5 detik + toast selesai |
| `components/ClearAllDocumentsButton.js` | Hapus semua (cancel antrian aktif) |
| `components/DownloadResultPdfButton.js` | Tombol PDF hasil |
| `components/ResultPdfPreviewModal.js` | Modal preview PDF hasil |
| `components/results/` | `ScoreSummary`, `ResultsTable`, `TidakDapatDihitungPanel` |
| `utils/generateResultPdf.js` | Generate PDF client-side (jsPDF) |
| `utils/documentDetailFields.js` | Field metadata modal detail |
| `utils/openUploadedDocumentPreview.js` | Preview file ter-upload |
| `constants.js` | Konstanta khusus dokumen |

### `features/engine/` — Dashboard Engine (Admin)

| Path | Isi |
|------|-----|
| `api/engineApi.js` | Agregasi status engine + scoring jobs |
| `api/mapDocumentsToEngineStatus.js` | Fallback agregat status dari scoring jobs |
| `pages/EngineDashboardPage.js` | Halaman `/engine` |
| `components/` | `ClusterStatusPanel`, `EngineStatsGrid`, `WorkerSection`, `RecentActivityList` |
| `utils/clusterStatus.js` | Facade label status cluster |
| `utils/workerStatus.js` | Facade label status worker |
| `utils/buildEngineStatusFromDocuments.js` | Fallback agregat dari dokumen |

### `features/admin/` — Aktivitas Pengguna (Admin)

| Path | Isi |
|------|-----|
| `api/adminApi.js` | Fetch overview aktivitas (+ mock) |
| `pages/UserActivityPage.js` | Halaman `/admin/activity` |
| `components/UserStatsTable.js` | Tabel statistik user |
| `components/ActivityLogTable.js` | Tabel log aktivitas |
| `utils/badges.js` | Badge status aktivitas |

---

## `src/shared/` — Kode Lintas Fitur

### `shared/api/` — Lapisan HTTP

| Path | Isi |
|------|-----|
| `client.js` | Axios instance, token Bearer, error helper |
| `config.js` | Baca flag mock dari `.env` |
| `middlewareContract.js` | **Sumber kebenaran** mapping status API ↔ UI |
| `scoringJobs/scoringJobsApi.js` | HTTP call ke `/scoring-jobs/*` |
| `scoringJobs/scoringJobsMapper.js` | Transform response middleware → format UI |
| `scoringJobs/constants.js` | Konstanta status scoring jobs |
| `engine/engineStatusApi.js` | `GET /engine/status` |
| `engine/engineStatusMapper.js` | Transform `GET /engine/status` → UI |
| `mock/authMock.js` | Data login palsu |
| `mock/adminMock.js` | Data admin palsu |
| `mock/activityMock.js` | Data aktivitas palsu |

### `shared/constants/` — Konstanta Global

| File | Isi |
|------|-----|
| `indikatorDetailPenilaian.json` | Daftar 17 komponen penilaian |
| `aspek.js` | Nama aspek penilaian (Permen KUKM) |
| `scoringIndicators.js` | Indikator penilaian |
| `scoringDetailIndicators.js` | Detail baris tabel skor |
| `extractedIndicators.js` | Indikator hasil ekstraksi OCR |
| `fileTypes.js` | MIME type & ekstensi file |
| `upload.js` | Batas upload global |
| `pagination.js` | Default page size tabel |

### `shared/layout/` — Layout Aplikasi

| File | Isi |
|------|-----|
| `MainLayout.js` | Sidebar + Outlet + DocumentWatcher + Toast |
| `Sidebar.js` | Menu navigasi |
| `SidebarMenuItem.js` | Item menu individual |
| `UserMenu.js` | Menu user + logout |

### `shared/ui/` — Komponen UI Atomik

| File | Isi |
|------|-----|
| `Toast.js` | Notifikasi toast |
| `PageLoader.js` | Spinner loading halaman lazy |
| `StatCard.js` | Kartu statistik (engine dashboard) |
| `ConfirmDialog.js` | Dialog konfirmasi |
| `TablePagination.js` | Pagination tabel |
| `DocumentStatusBadge.js` | Badge status dokumen |
| `AppErrorBoundary.js` | Tangkap error React global |
| `index.js` | Barrel export |

### `shared/store/` — State Global UI

| File | Isi |
|------|-----|
| `useUiStore.js` | Toast, sidebar collapsed |

### `shared/utils/` — Utilitas

| File | Isi |
|------|-----|
| `format.js` | Format tanggal, angka, ukuran file |
| `file.js` | Helper file (ekstensi, MIME) |
| `resultDetail.js` | Normalisasi baris skor, bobot, persentase |
| `extractedIndicators.js` | Mapping indikator ekstraksi |
| `documentStatusLabels.js` | Label Indonesia status dokumen |
| `engineStatusLabels.js` | Label Indonesia status engine |
| `documentFilters.js` | Filter dokumen client-side |
| `colorGrading.js` | Warna predikat skor (SEHAT, dll.) |

---

## Alur Data (File Mana Dipanggil)

```
Browser
  → main.js
    → App.js (routing)
      → Halaman (pages/*.js)
        → useXxxStore (Zustand)
          → featureApi.js (documentsApi, authApi, ...)
            → scoringJobsApi.js / authMock.js
              → scoringJobsMapper.js (jika perlu transform)
                → client.js (Axios)
                  → Middleware API
```

---

## File Test

Test berdampingan dengan modul:

```
src/shared/utils/resultDetail.test.js
src/shared/utils/format.test.js
src/shared/utils/extractedIndicators.test.js
src/shared/api/scoringJobs/scoringJobsMapper.test.js
src/shared/api/engine/engineStatusMapper.test.js
```

Jalankan: `npm test`

---

## Ketergantungan Antar Fitur (Yang Boleh Import ke Mana)

| Dari | Boleh import ke | Contoh |
|------|-----------------|--------|
| `features/upload` | `features/documents`, `features/preview` | Upload → API dokumen |
| `features/documents` | `features/preview` | Preview file server |
| `features/preview` | `features/documents` | Fetch file dari server |
| `features/engine` | `shared` saja | Badge status di shared |
| `shared/layout` | `features/auth`, `features/documents` | Sidebar + watcher |
| Semua fitur | `shared/*` | Layout, utils, API client |

**Hindari:** `features/A` import langsung file dalam `features/B/components/` — gunakan barrel `index.js`.

---

## Langkah Berikutnya

- Pelajari cara menulis kode sesuai proyek → [03-konvensi-kode.md](./03-konvensi-kode.md)
- Ubah halaman tertentu → [04-mengubah-halaman-dan-routing.md](./04-mengubah-halaman-dan-routing.md)