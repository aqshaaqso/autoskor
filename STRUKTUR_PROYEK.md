# Struktur Proyek — AutoSkor

```
autoskor/
├── public/
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
│   │   │   ├── components/           # UploadArea, UploadDropzone, UploadQueueList, ...
│   │   │   ├── pages/                # UploadPage, FilePreviewPage
│   │   │   ├── store/useUploadStore.js
│   │   │   ├── utils/                # filePreview, previewSession, openFilePreview
│   │   │   └── index.js
│   │   ├── documents/
│   │   │   ├── api/documentsApi.js
│   │   │   ├── components/
│   │   │   │   ├── DocumentTable.js
│   │   │   │   ├── DocumentDetailModal.js
│   │   │   │   ├── DocumentWatcher.js
│   │   │   │   ├── ClearAllDocumentsButton.js
│   │   │   │   ├── DownloadResultPdfButton.js
│   │   │   │   └── ResultPdfPreviewModal.js
│   │   │   ├── pages/                # QueuePage, ProcessedPage, ProcessedDetailPage
│   │   │   ├── store/useDocumentStore.js
│   │   │   ├── utils/
│   │   │   │   ├── generateResultPdf.js
│   │   │   │   ├── documentDetailFields.js
│   │   │   │   └── openUploadedDocumentPreview.js
│   │   │   └── index.js
│   │   ├── results/
│   │   │   ├── components/           # ResultsTable, ScoreSummary, StatusBadge, NonProcessAble
│   │   │   └── index.js
│   │   ├── engine/
│   │   │   ├── api/                  # engineApi.js, engineStatusMapper.js
│   │   │   ├── components/           # ClusterStatusPanel, EngineStatsGrid, WorkerSection, ...
│   │   │   ├── hooks/
│   │   │   ├── pages/EngineDashboardPage.js
│   │   │   ├── utils/
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
│   │   │   ├── config.js             # Feature flags mock/real API
│   │   │   ├── middlewareContract.js # Mapping status middleware ↔ UI
│   │   │   ├── scoringJobs/          # scoringJobsApi, scoringJobsMapper, constants
│   │   │   └── mock/                 # Mock per domain (auth, documents, admin, engine)
│   │   ├── layout/                   # MainLayout, Sidebar, UserMenu
│   │   ├── ui/                       # Toast, PageLoader, StatCard, ConfirmDialog
│   │   ├── store/                    # useUiStore
│   │   ├── utils/                    # colorGrading, format
│   │   └── constants/upload.js       # Batas ukuran file
│   ├── main.js
│   └── index.css
├── dist/                             # Build production
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
import { useAuthStore } from '@/features/auth'
```

File **di dalam** fitur yang sama memakai path relatif:

```js
import { useDocumentStore } from '../store/useDocumentStore'
```

### Lapisan `shared/`

Kode lintas fitur: layout, HTTP client, mock, utilitas, UI atomik.

```js
import { MainLayout } from '@/shared/layout'
import { useUiStore } from '@/shared/store'
import { api } from '@/shared/api/client'
```

### Ketergantungan antar fitur

| Dari | Ke | Alasan |
|------|-----|--------|
| `upload` | `documents` | Upload memanggil API & store dokumen |
| `documents` | `results` | Halaman detail menampilkan komponen skor |
| `engine` | `documents` | Agregasi status dari scoring jobs |
| `shared/layout` | `auth`, `documents` | Sidebar auth + DocumentWatcher |

### Aturan API

Halaman React → Store Zustand → Feature API → `scoringJobsApi` / mock → Axios.

Jangan panggil Axios langsung dari komponen. Detail: [API_CONTRACT.md](./API_CONTRACT.md#panduan-developer-frontend).

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