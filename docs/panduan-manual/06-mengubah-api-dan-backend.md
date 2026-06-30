# 06 — Mengubah API & Integrasi Backend

Panduan lengkap untuk mengubah pemanggilan API, menambah endpoint, mengubah mapping response, dan menghubungkan ke middleware.

---

## Lapisan API (Wajib Dipahami)

```
Komponen React
    ↓  (jangan lewati store)
Zustand Store
    ↓
Feature API          authApi.js, documentsApi.js, engineApi.js, adminApi.js
    ↓
Shared API           scoringJobsApi.js, engineStatusApi.js
    ↓  (+ mapper jika perlu)
scoringJobsMapper.js / engineStatusMapper.js
    ↓
client.js (Axios)
    ↓
Middleware (VITE_API_BASE_URL)
```

---

## File Kunci

| File | Peran |
|------|-------|
| `shared/api/client.js` | Axios instance, Bearer token, `getApiErrorMessage` |
| `shared/api/config.js` | `API_BASE_URL`, flag mock |
| `shared/api/middlewareContract.js` | Mapping status & filter halaman |
| `shared/api/scoringJobs/scoringJobsApi.js` | Semua HTTP ke `/scoring-jobs/*` |
| `shared/api/scoringJobs/scoringJobsMapper.js` | Response middleware → objek UI |
| `shared/api/engine/engineStatusApi.js` | `GET /engine/status` |
| `shared/api/engine/engineStatusMapper.js` | Response engine → UI worker |
| `features/documents/api/documentsApi.js` | Wrapper scoring jobs untuk fitur dokumen |
| `features/auth/api/authApi.js` | Auth + switch mock |
| `features/admin/api/adminApi.js` | Admin + switch mock |

---

## Aturan URL

| Lokasi | Format | Contoh |
|--------|--------|--------|
| `.env` | Host + `/api` | `http://localhost:8000/api` (sesuaikan environment) |
| Kode JS | Path relatif tanpa `/api` | `api.get('/scoring-jobs')` |

```js
// SALAH — double /api
api.get('/api/scoring-jobs')

// BENAR
api.get('/scoring-jobs')
```

Swagger UI: `{host}/swagger/index.html` — path di Swagger sudah include `/api` prefix di server, tapi di kode frontend tulis tanpa `/api`.

---

## Endpoint Middleware yang Dipakai Saat Ini

| Method | Path | Dipakai oleh |
|--------|------|--------------|
| GET | `/health` | Script test (bukan UI) |
| POST | `/scoring-jobs/upload` | Upload file |
| GET | `/scoring-jobs` | List antrian & selesai |
| GET | `/scoring-jobs/{id}` | Detail job + hasil |
| GET | `/scoring-jobs/{id}/file` | Preview/unduh file asli |
| POST | `/scoring-jobs/{id}/cancel` | Batalkan job antrian |
| GET | `/engine/status` | Engine dashboard |

Endpoint **belum tersedia** (masih mock): `/auth/*`, `/admin/*`

Detail kontrak: [API_CONTRACT.md](../../API_CONTRACT.md)

---

## Cara Mengubah Base URL / Environment

1. Edit `.env` → `VITE_API_BASE_URL=...`
2. Restart `npm run dev`
3. Uji dengan `.\scripts\test-middleware.ps1` atau upload file manual

Flag mock (tidak mempengaruhi scoring jobs):

```env
VITE_USE_MOCK_AUTH=true    # auth pakai authMock.js
VITE_USE_MOCK_ADMIN=true   # admin pakai adminMock.js
```

Baca flag di `shared/api/config.js`.

---

## Cara Menambah Endpoint Baru

### Contoh: endpoint `GET /scoring-jobs/stats`

#### Step 1 — HTTP function di shared API

`shared/api/scoringJobs/scoringJobsApi.js`:

```js
export async function fetchScoringJobStats() {
  const { data } = await api.get('/scoring-jobs/stats')
  return data
}
```

#### Step 2 — Mapper (jika response perlu transform)

`shared/api/scoringJobs/scoringJobsMapper.js`:

```js
export function mapStatsToUi(raw) {
  return {
    totalJobs: raw.total_jobs ?? raw.totalJobs ?? 0,
    // normalisasi snake_case / camelCase
  }
}
```

#### Step 3 — Wrapper di feature API

`features/documents/api/documentsApi.js`:

```js
export async function getDocumentStats() {
  const raw = await fetchScoringJobStats()
  return mapStatsToUi(raw)
}
```

#### Step 4 — Action di store

`useDocumentStore.js` — tambah state + `fetchStats`.

#### Step 5 — Hubungkan ke komponen

#### Step 6 — Update `API_CONTRACT.md` jika kontrak resmi berubah

---

## Mapping Status (middlewareContract.js)

**Satu sumber kebenaran** untuk status scoring job:

```js
// Status middleware → kode internal UI
export const JOB_STATUS_TO_UI = {
  uploading: 'queued',
  uploaded: 'queued',
  waiting: 'queued',
  running: 'processing',
  completed_success: 'done',
  failed: 'failed',
  canceled: 'canceled',
}

// Filter halaman → query param status
export const UI_STATUS_FILTER_TO_MIDDLEWARE = {
  queue: 'uploading,uploaded,waiting,running',
  processed: 'completed_success,failed',
}
```

### Jika backend menambah status baru

1. Tambah di `JOB_STATUS_TO_UI`
2. Putuskan masuk filter `queue` atau `processed`
3. Tambah label di `documentStatusLabels.js`
4. Update `DocumentStatusBadge` jika perlu warna baru
5. Update test di `scoringJobsMapper.test.js`
6. Update `API_CONTRACT.md`

### Label tampilan (Bahasa Indonesia)

**Bukan** di `middlewareContract.js` — edit `shared/utils/documentStatusLabels.js`:

```js
export const UI_DOCUMENT_STATUS_LABELS = {
  queued: 'Antrian',
  processing: 'Diproses',
  done: 'Selesai',
  failed: 'Gagal',
  canceled: 'Dibatalkan',
}
```

---

## scoringJobsMapper — Transform Response

Mapper mengubah response mentah middleware menjadi objek yang dipakai komponen:

```js
// Output mapScoringJobToDocument(job):
{
  id: 'uuid',
  fileName: 'rat-2024.pdf',
  fileSize: 1024000,
  status: 'queued',        // sudah dimapping
  uploadedAt: '2026-01-15T10:00:00Z',
  failureReason: null,
  uploadedBy: { id, name, email, role },
  progressPercent: 45,
}
```

### Field hasil skor

Hasil penilaian dinormalisasi di `mapScoringJobResult` — mendukung camelCase dan snake_case dari engine.

Logic bobot & persentase: `shared/utils/resultDetail.js`

### Jika middleware mengubah struktur response

1. Buka `scoringJobsMapper.js`
2. Cari fungsi `pickFirstDefined` — pola proyek untuk field alternatif
3. Tambah varian field baru
4. Tulis/update test di `scoringJobsMapper.test.js`
5. Jalankan `npm test`

---

## Upload File

```js
const formData = new FormData()
formData.append('files', file)  // nama field HARUS 'files'

await api.post('/scoring-jobs/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  onUploadProgress: (event) => {
    const percent = Math.round((event.loaded * 100) / event.total)
  },
})
```

Implementasi: `uploadScoringJobFile` di `scoringJobsApi.js` → `uploadDocument` di `documentsApi.js` → `useUploadStore`.

---

## Download / Preview File Binary

```js
const response = await api.get(`/scoring-jobs/${id}/file`, {
  params: { disposition: 'inline' },  // atau 'attachment' untuk unduh paksa
  responseType: 'blob',
})
```

---

## Error Handling

### Format error yang dibaca frontend

```json
{ "message": "Ukuran file melebihi batas 20 MB" }
```

Juga didukung: `detail`, `error` (string).

### Helper

```js
import { getApiErrorMessage } from '@/shared/api/client'

const msg = getApiErrorMessage(err, 'Fallback pesan.')
```

### 401 Unauthorized

`client.js` interceptor otomatis:
- Hapus token dari localStorage
- Redirect ke `/login` (kecuali sudah di halaman login)

---

## Mock API (Auth & Admin)

| Mock file | Dipakai saat |
|-----------|--------------|
| `shared/api/mock/authMock.js` | `VITE_USE_MOCK_AUTH=true` |
| `shared/api/mock/adminMock.js` | `VITE_USE_MOCK_ADMIN=true` |
| `shared/api/mock/activityMock.js` | Data aktivitas admin |

### Mengubah user mock

Edit array user di `authMock.js` — tambah email/password/role.

### Migrasi ke API nyata

1. Set `VITE_USE_MOCK_AUTH=false` di `.env`
2. Pastikan middleware expose `/auth/login`, `/auth/me`, `/auth/logout`
3. Sesuaikan `authApi.js` jika response format berbeda
4. Uji login, refresh halaman (token persist), logout

---

## Polling (Bukan WebSocket)

`DocumentWatcher` memanggil `GET /scoring-jobs` setiap **5 detik** saat tab aktif.

- Interval: hardcoded di `DocumentWatcher.js`
- Deteksi selesai: bandingkan `documentStatusMap` di store
- Toast: via `useUiStore.showToast`

Jika ingin ubah interval polling, edit `DocumentWatcher.js` — jangan buat polling kedua di halaman terpisah.

---

## Checklist Perubahan API

- [ ] Path di kode tanpa prefix `/api` ganda
- [ ] Mapper menangani snake_case & camelCase
- [ ] Status baru masuk `middlewareContract.js`
- [ ] Label baru masuk `*StatusLabels.js`
- [ ] Store sebagai perantara (bukan Axios di komponen)
- [ ] Test mapper diupdate (`npm test`)
- [ ] Uji dengan middleware nyata atau script test
- [ ] Update `API_CONTRACT.md` jika kontrak berubah

---

## Langkah Berikutnya

- State management → [07-state-management-zustand.md](./07-state-management-zustand.md)
- Konstanta penilaian → [09-konstanta-penilaian-dan-label.md](./09-konstanta-penilaian-dan-label.md)