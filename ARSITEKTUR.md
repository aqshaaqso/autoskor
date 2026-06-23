# Arsitektur — AutoSkor

Penjelasan alur, komponen, dan tanggung jawab sistem.

---

## Gambaran Besar

AutoSkor adalah SPA frontend untuk upload dokumen RAT koperasi, memantau antrian proses, dan menampilkan hasil penilaian kesehatan koperasi (KSP/USP) berdasarkan **Permen KUKM No. 14/2009**.

Peran frontend: **autentikasi, upload dokumen, notifikasi, pantau antrian, tampilkan hasil, monitoring engine (admin)**.

### Pemisahan tanggung jawab

| Lapisan | Tugas |
|---------|-------|
| **Frontend** | Upload file, notifikasi, tampilkan list & hasil skor, dashboard admin |
| **Middleware** | Terima file, validasi, simpan, kelola scoring jobs & status |
| **Engine** | OCR, ekstrak data, hitung skor, callback hasil ke middleware |

Frontend **tidak** menghitung skor — hanya mengirim file dan membaca status/hasil.

---

## Diagram Arsitektur

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              USER (Browser)                             │
└─────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     FRONTEND — AutoSkor (React SPA)                     │
│  ┌──────────┐  ┌─────────────────────────────────────────────────────┐  │
│  │ Sidebar  │  │              Area Konten (Outlet)                   │  │
│  │ Upload   │  │  Upload · Antrian · Selesai · Detail · Engine     │  │
│  │ Antrian  │  └─────────────────────────────────────────────────────┘  │
│  │ Selesai  │                                                           │
│  │ Engine*  │  Zustand · Axios · React Router · Lazy pages              │
│  └──────────┘                                                           │
└─────────────────────────────────────────────────────────────────────────┘
            │ POST /scoring-jobs/upload
            │ GET  /scoring-jobs
            │ GET  /scoring-jobs/{id}
            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         MIDDLEWARE API                                  │
│   Terima file → Validasi → Simpan → Kelola scoring jobs                 │
│                                      │                                  │
│                                      ▼                                  │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                    ENGINE (via callback)                        │   │
│   │         OCR / Ekstrak data / Hitung skor / Kirim hasil          │   │
│   └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘

* Engine & Aktivitas Pengguna hanya untuk role admin
```

---

## Layout & Routing

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER — AutoSkor                              [UserMenu]       │
├────────────┬─────────────────────────────────────────────────────┤
│  SIDEBAR   │  <Outlet /> — halaman aktif                         │
│            │                                                     │
│  Upload    │   /upload                                           │
│  Antrian   │   /queue                                            │
│  Selesai   │   /processed                                        │
│  Engine*   │   /processed/:id  (detail skor)                     │
│  Aktivitas*│   /preview/:previewId                               │
│            │   /engine                                           │
│            │   /admin/activity                                   │
└────────────┴─────────────────────────────────────────────────────┘
```

| Path | Halaman | Guard |
|------|---------|-------|
| `/login` | LoginPage | Publik |
| `/` | Redirect → `/upload` | ProtectedRoute |
| `/upload` | UploadPage | ProtectedRoute |
| `/preview/:previewId` | FilePreviewPage | ProtectedRoute |
| `/queue` | QueuePage | ProtectedRoute |
| `/processed` | ProcessedPage | ProtectedRoute |
| `/processed/:id` | ProcessedDetailPage | ProtectedRoute |
| `/engine` | EngineDashboardPage | AdminRoute |
| `/admin/activity` | UserActivityPage | AdminRoute |

Halaman di-load lazy via `src/app/lazyPages.js` dengan fallback `PageLoader`.

### Struktur routing

```
main.js
  └── BrowserRouter
        └── App (Routes)
              ├── /login → LoginPage
              ├── /preview/:previewId → ProtectedRoute → FilePreviewPage
              └── / → ProtectedRoute → MainLayout
                    ├── Sidebar + DocumentWatcher
                    └── Outlet
                          ├── /upload        → UploadPage
                          ├── /queue         → QueuePage
                          ├── /processed     → ProcessedPage
                          ├── /processed/:id → ProcessedDetailPage
                          ├── /engine        → AdminRoute → EngineDashboardPage
                          └── /admin/activity → AdminRoute → UserActivityPage
```

---

## Siklus Hidup Scoring Job

```
      ┌─────────────┐
      │ User pilih  │
      │  file(s)    │
      └──────┬──────┘
             │ lolos validasi (format + 20MB)
             ▼
      ┌─────────────┐
      │ FE upload   │◄── progress bar HANYA di sini
      │ ke middleware│
      └──────┬──────┘
             │ sukses → toast "Berhasil diupload"
             ▼
      ┌─────────────────────────────────────────┐
      │  Middleware: uploading → uploaded →     │
      │  waiting (antrian)                      │
      └──────┬──────────────────────────────────┘
             ▼
      ┌─────────────────────────────────────────┐
      │  Engine: running (diproses)             │
      └──────┬──────────────────────────────────┘
             ▼
      ┌─────────────────────────────────────────┐
      │  Selesai: completed_success             │
      │  Hasil di result.result_data            │
      └─────────────────────────────────────────┘
             │
             └──► failed / canceled (opsional)
```

### Status: middleware → UI

| Middleware | UI |
|------------|-----|
| `uploading`, `uploaded`, `waiting` | `queued` |
| `running` | `processing` |
| `completed_success` | `done` |
| `failed`, `canceled` | `failed` |

Mapping di `src/shared/api/middlewareContract.js`, diterapkan di `scoringJobsMapper.js`.

---

## Alur Per Halaman

### Upload (`/upload`)

1. User drag & drop multi-file
2. Validasi total ≤ 20 MB, format PDF/JPG/PNG/WEBP
3. `POST /scoring-jobs/upload` dengan `onUploadProgress`
4. Toast sukses — FE tidak menunggu engine

### Antrian (`/queue`)

1. `GET /scoring-jobs?status=uploading,uploaded,waiting,running`
2. Tabel: nama file, tanggal, status
3. Auto-refresh 5 detik + refresh manual

### Selesai (`/processed`)

1. `GET /scoring-jobs?status=completed_success,failed,canceled`
2. Klik dokumen → `/processed/:id`
3. `GET /scoring-jobs/{id}` → tampilkan `ScoreSummary`, `ResultsTable`, `NonProcessAble`

### Engine (`/engine`, admin)

Dashboard mengagregasi data dari `GET /scoring-jobs` (middleware tidak punya `/engine/status`). Komponen: `ClusterStatusPanel`, `EngineStatsGrid`, `RecentActivityList`, `WorkerSection`.

### Login (`/login`)

Auth memakai mock (`VITE_USE_MOCK_AUTH=true`) sampai middleware menyediakan `/auth/*`. Token disimpan di `useAuthStore`, route dilindungi `ProtectedRoute` / `AdminRoute`.

---

## Lapisan API Frontend

```
Halaman React
    ↓
Zustand Store (useDocumentStore, useUploadStore, useAuthStore, ...)
    ↓
Feature API (documentsApi, authApi, engineApi, adminApi)
    ↓ switch mock/real (config.js)
scoringJobsApi / mock/*
    ↓
scoringJobsMapper (middleware → format UI)
    ↓
Axios client (client.js)
    ↓
Middleware API
```

Jangan panggil Axios langsung dari komponen — selalu lewat store → feature API.

---

## Polling & Notifikasi

| Komponen | Interval | Tujuan |
|----------|----------|--------|
| `DocumentWatcher` | 3 detik | Deteksi job selesai → toast + refresh list |
| `QueuePage` | 5 detik | Refresh tabel antrian |

Toast muncul saat status berubah ke `done`. Tidak perlu WebSocket.

---

## Skor Parsial

Hasil di `/processed/:id` memisahkan:

- `detail[]` — aspek dapat dihitung (**85 bobot**)
- `tidakDapatDihitung` — aspek Manajemen (**15 bobot**, skor 0)

Detail: [TIDAK_DAPAT_DIHITUNG.md](./TIDAK_DAPAT_DIHITUNG.md)

---

## Endpoint

| Endpoint | Method | Pemanggil | Fungsi |
|----------|--------|-----------|--------|
| `/scoring-jobs/upload` | POST | Frontend | Upload file |
| `/scoring-jobs` | GET | Frontend | List jobs |
| `/scoring-jobs/{id}` | GET | Frontend | Detail + hasil |
| `/scoring-jobs/{id}/cancel` | POST | Frontend | Cancel (belum di UI) |
| `/engine-callback/...` | POST | Engine | Progress, result, failed |
| `/auth/*` | — | Frontend | Mock — belum di middleware |
| `/admin/*` | — | Frontend | Mock — belum di middleware |

Kontrak lengkap: [API_CONTRACT.md](./API_CONTRACT.md)

---

## Tech Stack

| Tech | Peran |
|------|-------|
| React 19 | UI multi-halaman |
| React Router DOM 7 | Routing + lazy loading |
| Zustand | State per fitur + UI global |
| Axios | HTTP ke middleware |
| react-dropzone | Multi-file upload |
| Tailwind CSS 4 | Layout sidebar, tabel, toast |
| Vite 6 | Build & dev server |

Detail: [TECH_STACK.md](./TECH_STACK.md)

---

## Dokumen Terkait

- [API_CONTRACT.md](./API_CONTRACT.md) — Kontrak middleware & panduan developer
- [TECH_STACK.md](./TECH_STACK.md) — Penjelasan teknologi
- [TIDAK_DAPAT_DIHITUNG.md](./TIDAK_DAPAT_DIHITUNG.md) — Aspek Manajemen
- [README.md](./README.md) — Instalasi & ringkasan
- [STRUKTUR_PROYEK.md](./STRUKTUR_PROYEK.md) — Struktur folder