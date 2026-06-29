# API Contract — AutoSkor Frontend ↔ Middleware

Dokumen ini untuk **tim backend** dan **developer frontend**. Berisi kontrak Middleware API yang dipakai AutoSkor saat ini, plus panduan menulis kode pemanggilan API.

Swagger live: `http://172.16.210.244:8000/swagger/index.html`

---

## Daftar Isi

- [Gambaran Integrasi](#gambaran-integrasi)
- [Konfigurasi](#konfigurasi)
- [Endpoint Middleware](#endpoint-middleware)
- [Status Scoring Job](#status-scoring-job)
- [Skema Response UI](#skema-response-ui)
- [Aturan Upload](#aturan-upload)
- [Polling & Notifikasi](#polling--notifikasi)
- [Endpoint Belum di Middleware](#endpoint-belum-di-middleware)
- [Panduan Developer Frontend](#panduan-developer-frontend)
- [Error Handling & CORS](#error-handling--cors)
- [Checklist Integrasi](#checklist-integrasi)

---

## Gambaran Integrasi

```
Frontend (React SPA)
    │
    ├── POST /scoring-jobs/upload        → kirim file RAT
    ├── GET  /scoring-jobs               → list antrian & selesai
    ├── GET  /scoring-jobs/{id}          → detail job + hasil skor
    ├── GET  /scoring-jobs/{id}/file     → unduh / preview file asli
    └── POST /scoring-jobs/{id}/cancel   → batalkan job antrian
    │
    ▼
Middleware API
    ├── Terima & simpan file
    ├── Kelola antrian scoring jobs
    └── Engine callback → progress, result, failed
```

Endpoint `engine-callback/*` dipanggil oleh **engine**, bukan browser.

---

## Konfigurasi

### Environment variable frontend

```env
VITE_API_BASE_URL=http://172.16.210.244:8000/api
VITE_USE_MOCK_AUTH=true
VITE_USE_MOCK_ADMIN=true
VITE_SCORING_JOBS_LIST_LIMIT=100
```

| Variable | Default | Deskripsi |
|----------|---------|-----------|
| `VITE_API_BASE_URL` | `http://localhost:8000/api` | Base URL sampai `/api` |
| `VITE_USE_MOCK_AUTH` | `true` (dev) | Auth mock sampai `/auth/*` tersedia |
| `VITE_USE_MOCK_ADMIN` | `true` (dev) | Admin mock sampai `/admin/*` tersedia |
| `VITE_SCORING_JOBS_LIST_LIMIT` | `100` | Limit list scoring jobs |

Scoring jobs & engine dashboard **selalu** memakai middleware nyata — tidak ada `VITE_USE_MOCK` global.

Restart dev server setelah mengubah `.env`.

### HTTP client

- Library: **Axios** (`src/shared/api/client.js`)
- Timeout: **120 detik**
- Base URL: dari `VITE_API_BASE_URL`
- Auth token: Bearer header (jika login nyata aktif)

### Aturan URL

| Lokasi | Isi | Contoh |
|--------|-----|--------|
| `.env` | Base URL penuh sampai `/api` | `http://host:8000/api` |
| Kode JS | Path relatif saja | `api.get('/scoring-jobs')` |

Salah: `api.get('/api/scoring-jobs')` → menghasilkan `/api/api/scoring-jobs`

---

## Endpoint Middleware

### Health check

```
GET /health
```

Monitoring — tidak dipakai UI.

---

### List scoring jobs

```
GET /scoring-jobs?status={status}&limit={limit}&offset={offset}
```

| Query | Deskripsi |
|-------|-----------|
| `status` | Comma-separated status middleware (lihat tabel mapping) |
| `limit` | Maks. 100 |
| `offset` | Pagination offset |

**Filter yang dipakai frontend:**

| Halaman | Query `status` |
|---------|----------------|
| Antrian (`/queue`) | `uploading,uploaded,waiting,running` |
| Selesai (`/processed`) | `completed_success,failed` |
| Polling global | Tanpa filter (semua job) |

Job berstatus `canceled` **disembunyikan** di UI (filter client-side di `scoringJobsMapper.js`).

**Response:** `{ data: [...], pagination: { ... } }`

---

### Upload file

```
POST /scoring-jobs/upload
Content-Type: multipart/form-data
```

| Field | Tipe | Wajib | Keterangan |
|-------|------|-------|------------|
| `files` | File[] | Ya | Nama field harus `files` (bisa diulang) |

Frontend menampilkan progress upload via `onUploadProgress`. Setelah sukses, toast ditampilkan — **tidak menunggu** engine selesai.

---

### Detail scoring job

```
GET /scoring-jobs/{id}
```

`id` = UUID scoring job.

Digunakan untuk halaman detail hasil (`/processed/:id`). Hasil skor ada di `result.result_data` saat status `completed_success`.

---

### Cancel scoring job

```
POST /scoring-jobs/{id}/cancel
```

Dipakai UI untuk:
- Tombol **Hapus** per baris di halaman Antrian (`/queue`)
- Tombol **Hapus Semua** — hanya membatalkan job yang masih aktif (`uploading`, `uploaded`, `waiting`, `running`)

Di mode middleware nyata, **Hapus Semua tidak menghapus** dokumen selesai/gagal di halaman Hasil.

---

### Unduh file asli (preview)

```
GET /scoring-jobs/{id}/file?disposition=inline
```

Response: binary file (PDF/DOCX). Dipakai untuk:
- Preview di tab baru: `/preview/document/:documentId` (`FilePreviewPage`)
- Unduh dari `DocumentDetailModal` atau halaman preview
- Query `disposition=attachment` untuk unduh paksa

---

### Status engine

```
GET /engine/status
```

Response agregat status engine & worker dari Redis discovery:

```json
{
  "total": 2,
  "available": 2,
  "running": 2,
  "processing": 0,
  "stop": 0,
  "worker_active_total": 2,
  "worker_online_engines": 2,
  "status": "healthy",
  "engines": [
    {
      "name": "engine-1",
      "status": "running",
      "available": true,
      "worker_status": {
        "status": "online",
        "active_count": 1
      }
    }
  ]
}
```

`503` → `{ "error": "string" }`. Frontend memetakan `engines[]` ke tabel worker di Engine Dashboard.

---

### Engine callback (bukan untuk frontend)

| Method | Path | Pemanggil |
|--------|------|-----------|
| POST | `/engine-callback/scoring-jobs/{id}/progress` | Engine |
| POST | `/engine-callback/scoring-jobs/{id}/result` | Engine |
| POST | `/engine-callback/scoring-jobs/{id}/failed` | Engine |

---

## Status Scoring Job

### Status middleware

`uploading` · `uploaded` · `waiting` · `running` · `completed_success` · `failed` · `canceled`

### Mapping ke UI frontend

**Kode internal** didefinisikan di `src/shared/api/middlewareContract.js`:

| Middleware | UI |
|------------|-----|
| `uploading` | `queued` |
| `uploaded` | `queued` |
| `waiting` | `queued` |
| `running` | `processing` |
| `completed_success` | `done` |
| `failed` | `failed` |
| `canceled` | `canceled` (disembunyikan dari list) |

**Label tampilan** (Bahasa Indonesia) di `src/shared/utils/documentStatusLabels.js`. Komponen `DocumentStatusBadge` (`src/shared/ui/`) mengimpor label & kelas dari file tersebut — jangan hardcode string di komponen.

### Siklus status

```
uploading → uploaded → waiting → running → completed_success
                                        ↘ failed
                                        ↘ canceled
```

Frontend mendeteksi perubahan lewat **polling HTTP** (bukan WebSocket).

---

## Skema Response UI

Mapper di `src/shared/api/scoringJobs/scoringJobsMapper.js` mengubah response middleware ke format yang dipakai komponen React.

### Objek dokumen (setelah mapping)

| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | string | UUID scoring job |
| `fileName` | string | Nama file asli |
| `fileSize` | number | Ukuran bytes |
| `status` | string | `queued` / `processing` / `done` / `failed` |
| `uploadedAt` | string (ISO) | Waktu upload |
| `failureReason` | string? | Pesan error jika gagal |
| `uploadedBy` | object? | `{ id, name, email, role }` — diisi mapper jika middleware mengirim field uploader |
| `progressPercent` | number? | Progress engine |

**Field uploader yang dikenali mapper** (`normalizeUploadedBy`):

`uploaded_by`, `uploadedBy`, `created_by`, `user`, `owner`, `file.uploaded_by`, serta varian flat (`uploaded_by_id`, `uploaded_by_name`, `uploaded_by_email`, dll.). Jika middleware belum mengirim data uploader, kolom **Pengupload** (admin) menampilkan `-`.

### Objek hasil skor

Lihat [TIDAK_DAPAT_DIHITUNG.md](./TIDAK_DAPAT_DIHITUNG.md) untuk penjelasan skor parsial.

| Field | Tipe | Keterangan |
|-------|------|------------|
| `totalSkorParsial` | number | Skor dari aspek dapat dihitung |
| `persentaseParsial` | number | Persentase dari 85 bobot |
| `bobotDapatDihitung` | number | Biasanya `85` |
| `predikat` | string | `SEHAT` / `CUKUP SEHAT` / `KURANG SEHAT` / `TIDAK SEHAT` |
| `tidakDapatDihitung` | object | Aspek Manajemen (bobot 15, skor 0) |
| `detail` | array | Baris skor per komponen |

Engine boleh mengirim camelCase atau snake_case — mapper menormalisasi keduanya.

---

## Aturan Upload

| Aturan | Nilai |
|--------|-------|
| Jumlah file | Multi-file |
| Batas ukuran total | Maksimal **20 MB** |
| Format | PDF, DOCX |
| Field name | `files` |

Validasi ada di frontend; backend disarankan validasi ulang.

---

## Polling & Notifikasi

| Polling | Interval | Endpoint | Tujuan |
|---------|----------|----------|--------|
| `DocumentWatcher` | 5 detik | `GET /scoring-jobs` (semua job) | Deteksi selesai → toast + refresh store |

Polling hanya berjalan saat tab browser aktif (`document.visibilityState`). Halaman antrian/selesai tidak punya interval sendiri — refresh lewat `DocumentWatcher` atau tombol **Muat Ulang**.

Toast "selesai diproses" muncul saat status berubah ke `done` (`completed_success` di middleware).

---

## Ekspor PDF Hasil Penilaian

Fitur **client-side** di halaman detail (`/processed/:id`) — tidak memanggil endpoint middleware tambahan.

| Tombol | Fungsi |
|--------|--------|
| Pratinjau PDF | Buka modal dalam halaman (iframe blob URL) |
| Unduh PDF | Simpan file `{nama-dokumen}-hasil-penilaian.pdf` |

Generator: `src/features/documents/utils/generateResultPdf.js` (jsPDF + jspdf-autotable).

Isi laporan PDF:
- Header AutoSkor + referensi Permen KUKM No. 14/2009
- Metadata dokumen (nama file, tanggal upload)
- Ringkasan penilaian (skor parsial, persentase, predikat)
- Tabel detail penilaian (sama seperti `ResultsTable`)
- Bagian Tidak Dapat Dihitung (aspek Manajemen)

Hanya tersedia untuk dokumen berstatus **selesai** (`done`) yang punya `result.result_data`.

---

## Endpoint Belum di Middleware

Fitur berikut masih memakai **mock lokal**:

| Method | Path | Mock flag |
|--------|------|-----------|
| POST | `/auth/login` | `VITE_USE_MOCK_AUTH` |
| GET | `/auth/me` | `VITE_USE_MOCK_AUTH` |
| POST | `/auth/logout` | `VITE_USE_MOCK_AUTH` |
| GET | `/admin/overview` | `VITE_USE_MOCK_ADMIN` |

Engine dashboard memanggil `GET /engine/status` untuk status worker/engine, lalu menggabungkannya dengan agregat `GET /scoring-jobs` (antrian, aktivitas terbaru, statistik dokumen). Jika `/engine/status` gagal (mis. `503`), UI fallback ke data scoring jobs saja.

---

## Panduan Developer Frontend

### Lapisan kode (bawah → atas)

```
shared/api/client.js              → Axios instance
shared/api/config.js              → Flag mock auth/admin dari .env
shared/api/middlewareContract.js  → Mapping status API ↔ kode UI
shared/api/scoringJobs/
  scoringJobsApi.js               → HTTP call middleware
  scoringJobsMapper.js            → Response → format UI (+ uploadedBy)
shared/api/engine/
  engineStatusApi.js              → GET /engine/status
  engineStatusMapper.js           → Response → worker UI + merge scoring jobs
shared/utils/documentStatusLabels.js → Label Indonesia dokumen
shared/utils/engineStatusLabels.js   → Label Indonesia engine
features/documents/api/documentsApi.js  → Wrapper scoring jobs
features/documents/store/useDocumentStore.js → State Zustand
Halaman React                     → Panggil store, BUKAN Axios langsung
```

Ubah teks status di UI → edit `*StatusLabels.js`. Ubah logika filter/status → edit `middlewareContract.js` + mapper.

### Menambah endpoint baru

1. Tulis fungsi HTTP di layer yang tepat (`scoringJobsApi.js`, `authApi.js`, dll.)
2. Path di kode = path Swagger **minus** `/api`
3. Tambah mapper jika format response berbeda dari UI
4. Bungkus di feature API (+ mock di `authApi`/`adminApi` bila endpoint belum ada)
5. Panggil dari store Zustand
6. Hubungkan ke komponen/halaman
7. Update dokumen ini jika kontrak berubah

### Contoh pemanggilan

```js
import { api } from '@/shared/api/client'

// List
const { data } = await api.get('/scoring-jobs', {
  params: { status: 'waiting,running', limit: 100 },
})

// Detail
const { data } = await api.get(`/scoring-jobs/${id}`)

// Upload
const formData = new FormData()
formData.append('files', file)
await api.post('/scoring-jobs/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  onUploadProgress: (e) => { /* progress bar */ },
})
```

---

## Error Handling & CORS

### Format error

Frontend membaca `err.message` dari Axios. Disarankan:

```json
{ "message": "Ukuran file melebihi batas 20 MB" }
```

| Kode | Situasi |
|------|---------|
| `200` | Sukses |
| `400` | Validasi gagal |
| `404` | Job/hasil tidak ditemukan |
| `413` | File terlalu besar |
| `500` | Error server/engine |

### CORS

Backend wajib mengizinkan origin frontend (development: `http://localhost:5173`).

---

## Checklist Integrasi

### Middleware (wajib)

- [ ] `POST /scoring-jobs/upload` — terima multi-file, field `files`
- [ ] `GET /scoring-jobs` — filter status comma-separated
- [ ] `GET /scoring-jobs/{id}` — detail job + `result.result_data` saat selesai
- [ ] Status flow: `waiting` → `running` → `completed_success`
- [ ] Engine mengisi skor parsial (85 bobot) + `tidakDapatDihitung`
- [ ] CORS dikonfigurasi

### Frontend (sudah siap)

- [x] UI upload, antrian, selesai, detail hasil
- [x] Layer API + mapper middleware
- [x] Polling status + toast notifikasi
- [x] Mock auth & admin (`VITE_USE_MOCK_AUTH`, `VITE_USE_MOCK_ADMIN`)
- [x] Dokumen & engine memakai middleware nyata
- [x] Hapus dari antrian (`POST /scoring-jobs/{id}/cancel`)
- [x] Preview file upload (`GET /scoring-jobs/{id}/file`)
- [x] Unduh & pratinjau laporan hasil PDF (client-side)
- [x] Label status terpusat (modular per domain)
- [x] Detail dokumen gagal via modal di halaman Selesai
- [x] Unit test mapper & utils (`npm test`)

### Uji integrasi

1. Set `VITE_API_BASE_URL` ke middleware yang dapat diakses
2. Upload 1 file PDF → cek toast sukses + muncul di antrian
3. Tunggu engine selesai → cek toast "selesai diproses"
4. Buka halaman Selesai → klik **Lihat Hasil** → cek tabel skor
5. Klik **Pratinjau PDF** / **Unduh PDF** di halaman detail hasil
6. Untuk dokumen gagal → klik **Lihat Detail** → cek `failureReason` di modal
7. Hapus 1 dokumen dari antrian → cek hilang dari `/queue`
8. **Hapus Semua** → cek antrian kosong, dokumen selesai tetap ada
9. Upload file > 20 MB → cek error handling
10. `npm run build` → pastikan build sukses
11. `.\scripts\test-middleware.ps1` → uji health + list jobs (PowerShell)

---

## Dokumen Terkait

- [README.md](./README.md) — Instalasi & ringkasan proyek
- [ARSITEKTUR.md](./ARSITEKTUR.md) — Diagram alur sistem
- [TIDAK_DAPAT_DIHITUNG.md](./TIDAK_DAPAT_DIHITUNG.md) — Aspek Manajemen
- [STRUKTUR_PROYEK.md](./STRUKTUR_PROYEK.md) — Struktur folder & konvensi import