# Middleware API — Daftar & Kompatibilitas Frontend

Base URL: `http://172.16.210.244:8000/api`  
Swagger: `http://172.16.210.244:8000/swagger/index.html`

Branch implementasi: `feat/middleware-api`

---

## API yang ADA di middleware

| # | Method | Path | Untuk siapa | Frontend function |
|---|--------|------|-------------|-------------------|
| 1 | GET | `/health` | DevOps | — |
| 2 | GET | `/scoring-jobs` | Frontend | `getDocuments()` |
| 3 | POST | `/scoring-jobs/upload` | Frontend | `uploadDocument()` |
| 4 | GET | `/scoring-jobs/{id}` | Frontend | `getDocumentResults()` |
| 5 | POST | `/scoring-jobs/{id}/cancel` | Frontend (belum UI) | — |
| 6 | GET | `/scoring-jobs/{id}/file` | Frontend (belum UI) | download/preview |
| 7 | POST | `/engine-callback/.../progress` | Engine | — |
| 8 | POST | `/engine-callback/.../result` | Engine | — |
| 9 | POST | `/engine-callback/.../failed` | Engine | — |

---

## API yang BELUM ada (frontend pakai mock)

| Method | Path lama frontend | Mock flag | Kredensial mock |
|--------|-------------------|-----------|-----------------|
| POST | `/auth/login` | `VITE_USE_MOCK_AUTH=true` | `admin@koperasi.id` / `admin123` |
| GET | `/auth/me` | `VITE_USE_MOCK_AUTH=true` | — |
| POST | `/auth/logout` | `VITE_USE_MOCK_AUTH=true` | — |
| GET | `/engine/status` | `VITE_USE_MOCK_ENGINE=true` | — |
| GET | `/admin/overview` | `VITE_USE_MOCK_ADMIN=true` | — |

---

## Status job (enum resmi)

| Middleware `status` | UI frontend | Halaman |
|---------------------|-------------|---------|
| `uploading` | `queued` | Antrian |
| `uploaded` | `queued` | Antrian |
| `waiting` | `queued` | Antrian |
| `running` | `processing` | Antrian |
| `completed_success` | `done` | Selesai |
| `failed` | `failed` | Selesai |
| `canceled` | `failed` | Selesai |

---

## Query `GET /scoring-jobs`

| Param | Contoh | Keterangan |
|-------|--------|------------|
| `status` | `waiting,running` | Comma-separated, filter server-side |
| `limit` | `100` | Max 100 |
| `offset` | `0` | Pagination |

### Mapping filter halaman → query

| Halaman frontend | Query `status` |
|------------------|----------------|
| Antrian (`queue`) | `uploading,uploaded,waiting,running` |
| Selesai (`processed`) | `completed_success,failed,canceled` |
| Done only | `completed_success` |
| Failed only | `failed,canceled` |

---

## Upload `POST /scoring-jobs/upload`

| Item | Nilai |
|------|-------|
| Content-Type | `multipart/form-data` |
| Field name | `files` (bisa diulang untuk multi-file) |
| Format | PDF, DOC, DOCX |
| Response | `{ data: ScoringJob[], message }` |

---

## Response `ScoringJob` → field UI

| Middleware | Frontend |
|------------|----------|
| `id` | `id` |
| `status` | `status` (via adapter) |
| `file.original_filename` | `fileName` |
| `file.file_size_bytes` | `fileSize` |
| `file.uploaded_at` | `uploadedAt` |
| `error_message` | `failureReason` |
| `engine_job_id` | `workerId` |
| `result.result_data` | `results` (halaman detail) |

---

## Konfigurasi `.env` (hybrid mode)

```env
VITE_API_BASE_URL=http://172.16.210.244:8000/api

# Dokumen → middleware real
VITE_USE_MOCK=false

# Fitur yang belum ada di middleware → mock
VITE_USE_MOCK_AUTH=true
VITE_USE_MOCK_ENGINE=true
VITE_USE_MOCK_ADMIN=true

VITE_SCORING_JOBS_LIST_LIMIT=100
```

---

## File kode terkait

| File | Fungsi |
|------|--------|
| `src/shared/api/middlewareContract.js` | Daftar endpoint + mapping status |
| `src/shared/api/scoringJobs/scoringJobsMapper.js` | Job → format UI |
| `src/shared/api/scoringJobs/scoringJobsApi.js` | HTTP calls |
| `src/features/documents/api/documentsApi.js` | Switch mock / middleware |

---

## Checklist integrasi

- [x] List jobs + pagination
- [x] Filter status via query param
- [x] Upload field `files`
- [x] Detail job + `result_data`
- [x] Status enum resmi dari Swagger
- [x] Auth tetap mock
- [ ] Cancel job (endpoint ada, UI belum)
- [ ] Download file `/scoring-jobs/{id}/file`
- [ ] Auth real setelah backend siap