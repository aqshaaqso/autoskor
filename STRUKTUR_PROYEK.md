# Struktur Proyek — AutoSkor

```
autoskor/
├── public/                           # Asset statis (vite.svg)
├── scripts/
│   └── test-middleware.ps1           # Uji endpoint middleware
├── src/
│   ├── app/
│   │   ├── App.js                    # Definisi routing
│   │   └── lazyPages.js              # Lazy import halaman
│   ├── features/                     # Modul per domain bisnis
│   │   ├── auth/
│   │   │   ├── api/authApi.js
│   │   │   ├── components/           # ProtectedRoute, AdminRoute
│   │   │   ├── pages/LoginPage.js
│   │   │   ├── store/useAuthStore.js
│   │   │   └── index.js
│   │   ├── upload/
│   │   │   ├── components/           # UploadArea, UploadDropzone, SelectedFilesList, ...
│   │   │   ├── pages/UploadPage.js
│   │   │   ├── store/useUploadStore.js
│   │   │   ├── constants.js
│   │   │   └── index.js
│   │   ├── preview/
│   │   │   ├── pages/FilePreviewPage.js
│   │   │   ├── utils/                # previewSession, openLocalFilePreview, downloadPreviewFile
│   │   │   └── index.js
│   │   ├── documents/
│   │   │   ├── api/documentsApi.js
│   │   │   ├── components/
│   │   │   │   ├── DocumentTable.js
│   │   │   │   ├── DocumentDetailModal.js
│   │   │   │   ├── DocumentWatcher.js
│   │   │   │   ├── ClearAllDocumentsButton.js
│   │   │   │   ├── DownloadResultPdfButton.js
│   │   │   │   ├── ResultPdfPreviewModal.js
│   │   │   │   └── results/          # ScoreSummary, ResultsTable, ...
│   │   │   ├── pages/                # QueuePage, ProcessedPage, ProcessedDetailPage
│   │   │   ├── store/useDocumentStore.js
│   │   │   ├── utils/
│   │   │   │   ├── generateResultPdf.js
│   │   │   │   ├── documentDetailFields.js
│   │   │   │   └── openUploadedDocumentPreview.js
│   │   │   ├── constants.js
│   │   │   └── index.js
│   │   ├── engine/
│   │   │   ├── api/                  # engineApi.js, engineStatusMapper.js
│   │   │   ├── components/           # ClusterStatusPanel, EngineStatsGrid, WorkerSection, ...
│   │   │   ├── hooks/
│   │   │   ├── pages/EngineDashboardPage.js
│   │   │   ├── utils/                # clusterStatus.js, workerStatus.js (facade → shared)
│   │   │   └── index.js
│   │   └── admin/
│   │       ├── api/adminApi.js
│   │       ├── components/           # UserStatsTable, ActivityLogTable
│   │       ├── pages/UserActivityPage.js
│   │       ├── utils/badges.js
│   │       └── index.js
│   ├── shared/
│   │   ├── api/
│   │   │   ├── client.js             # Axios instance + token
│   │   │   ├── config.js             # Flag mock auth/admin dari .env
│   │   │   ├── middlewareContract.js # Mapping status middleware ↔ UI
│   │   │   ├── scoringJobs/          # scoringJobsApi, scoringJobsMapper, constants
│   │   │   └── mock/                 # authMock, adminMock, activityMock
│   │   ├── constants/                # aspek, indikator, fileTypes, upload, pagination
│   │   ├── layout/                   # MainLayout, Sidebar, UserMenu
│   │   ├── ui/                       # Toast, PageLoader, DocumentStatusBadge, ...
│   │   ├── store/                    # useUiStore
│   │   └── utils/                    # format, file, resultDetail, extractedIndicators, ...
│   ├── main.js
│   └── index.css
├── dist/                             # Build production (gitignored)
├── API_CONTRACT.md
├── ARSITEKTUR.md
├── TECH_STACK.md
├── TIDAK_DAPAT_DIHITUNG.md
├── STRUKTUR_PROYEK.md
├── README.md
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

---

## Konvensi Modular

### Lapisan `features/`

Setiap fitur punya **public API** lewat `index.js`. File di luar fitur mengimpor dari barrel:

```js
import { QueuePage, useDocumentStore } from '@/features/documents'
import { openLocalFilePreview } from '@/features/preview'
import { useAuthStore } from '@/features/auth'
```

File **di dalam** fitur yang sama memakai path relatif:

```js
import { useDocumentStore } from '../store/useDocumentStore'
import { ScoreSummary } from '../components/results'
```

### Lapisan `shared/`

Kode lintas fitur: layout, HTTP client, mock, utilitas, UI atomik.

```js
import { MainLayout } from '@/shared/layout'
import { DocumentStatusBadge } from '@/shared/ui'
import { useUiStore } from '@/shared/store'
import { api } from '@/shared/api/client'
import { normalizeBobot } from '@/shared/utils'
import { ASPEK } from '@/shared/constants'
```

### Ketergantungan antar fitur

| Dari | Ke | Alasan |
|------|-----|--------|
| `upload` | `documents` | Upload memanggil API & store dokumen |
| `upload` | `preview` | Preview file lokal sebelum upload |
| `documents` | `preview` | Halaman render file (`FilePreviewPage`) |
| `preview` | `documents` | Fetch file server di tab preview |
| `engine` | `shared` | `DocumentStatusBadge` di `shared/ui` |
| `shared/layout` | `auth`, `documents` | Sidebar auth + `DocumentWatcher` |

Komponen hasil skor (`ScoreSummary`, `ResultsTable`, dll.) ada di `documents/components/results/` — bukan feature terpisah.

### Preview & unduh file

| Alur | Modul | Route / trigger |
|------|-------|-----------------|
| File lokal (pre-upload) | `preview` | `/preview/:previewId` |
| File server (sudah diunggah) | `documents` + `preview` | `/preview/document/:documentId` |
| PDF hasil skor (jsPDF) | `documents` | Modal/tombol di `/processed/:id` |

### Aturan API

Halaman React → Store Zustand → Feature API → `scoringJobsApi` → Axios.

Dokumen & engine **selalu** memakai middleware nyata. Mock hanya untuk `auth` dan `admin`.

Detail: [API_CONTRACT.md](./API_CONTRACT.md#panduan-developer-frontend).

### Label status (terpusat)

| Lapisan | File | Isi |
|---------|------|-----|
| API ↔ kode | `shared/api/middlewareContract.js` | Mapping status & filter |
| Label dokumen | `shared/utils/documentStatusLabels.js` | Label Indonesia badge & modal |
| Label engine | `shared/utils/engineStatusLabels.js` | Label Indonesia cluster/worker |
| Badge dokumen | `shared/ui/DocumentStatusBadge.js` | Komponen badge reusable |
| Facade engine | `features/engine/utils/*.js` | Komponen engine import facade fitur |

### Unit test

File test berdampingan dengan modul yang diuji:

```
src/shared/utils/resultDetail.test.js
src/shared/utils/extractedIndicators.test.js
src/shared/api/scoringJobs/scoringJobsMapper.test.js
```

Jalankan: `npm test`

---

## Path Alias

Import menggunakan alias `@/` yang mengarah ke `src/`:

```js
import { UploadPage } from '@/features/upload'
import { formatDateTime } from '@/shared/utils/format'
```

Dikonfigurasi di `vite.config.js` dan `jsconfig.json`.

---

## Dokumen Terkait

- [README.md](./README.md) — Instalasi & ringkasan
- [API_CONTRACT.md](./API_CONTRACT.md) — Kontrak middleware & panduan API
- [ARSITEKTUR.md](./ARSITEKTUR.md) — Alur kerja & diagram
- [TECH_STACK.md](./TECH_STACK.md) — Penjelasan teknologi
- [TIDAK_DAPAT_DIHITUNG.md](./TIDAK_DAPAT_DIHITUNG.md) — Aspek Manajemen