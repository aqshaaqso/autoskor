# API Contract — AutoSkor Frontend ↔ Backend

Dokumen ini untuk **tim backend**. Berisi kontrak API yang harus diimplementasikan agar frontend AutoSkor bisa terintegrasi tanpa perubahan kode.

Frontend sudah siap — cukup set `VITE_USE_MOCK=false` di `.env` setelah backend berjalan.

---

## Daftar Isi

- [Gambaran Integrasi](#gambaran-integrasi)
- [Konfigurasi](#konfigurasi)
- [Status Dokumen](#status-dokumen)
- [Endpoint](#endpoint)
- [Skema Response](#skema-response)
- [Aturan Upload](#aturan-upload)
- [Polling & Perilaku Frontend](#polling--perilaku-frontend)
- [Skor Parsial & Manajemen](#skor-parsial--manajemen)
- [Error Handling](#error-handling)
- [CORS](#cors)
- [Checklist Integrasi](#checklist-integrasi)
- [Di Luar Scope (Phase 2)](#di-luar-scope-phase-2)

---

## Gambaran Integrasi

```
Frontend (React SPA)
    │
    ├── POST /documents/upload        → kirim file RAT
    ├── GET  /documents?status=...  → baca antrian & selesai
    └── GET  /documents/:id/results   → baca hasil skor
    │
    ▼
Backend
    ├── Terima & simpan file
    ├── Kelola antrian & status dokumen
    └── Engine: OCR → ekstrak data → hitung skor → simpan hasil
```

**Frontend tidak menghitung skor.** Backend/engine bertanggung jawab penuh atas proses dan hasil penilaian.

---

## Konfigurasi

### Environment variable frontend

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK=false
```

| Variable | Default | Deskripsi |
|----------|---------|-----------|
| `VITE_API_BASE_URL` | `http://localhost:8000/api` | Base URL backend (tanpa trailing slash) |
| `VITE_USE_MOCK` | `true` | `false` = pakai backend nyata |

Restart dev server setelah mengubah `.env`.

### HTTP client frontend

- Library: **Axios**
- Timeout: **120 detik**
- Base URL: dari `VITE_API_BASE_URL`

---

## Status Dokumen

Backend **wajib** menggunakan nilai status berikut (lowercase):

| Status | Label di UI | Keterangan |
|--------|-------------|------------|
| `queued` | Menunggu | Dokumen masuk antrian, belum diproses |
| `processing` | Sedang Diproses | Engine sedang memproses |
| `done` | Selesai | Hasil skor tersedia |
| `failed` | Gagal | Proses gagal (opsional) |

### Siklus status

```
queued → processing → done
                   ↘ failed (opsional)
```

Frontend mendeteksi perubahan status lewat **polling** (bukan WebSocket). Backend cukup update status di database — frontend akan membaca perubahan pada poll berikutnya.

---

## Endpoint

### 1. Upload dokumen

```
POST /documents/upload
Content-Type: multipart/form-data
```

**Request body:**

| Field | Tipe | Wajib | Keterangan |
|-------|------|-------|------------|
| `files` | File[] | Ya | Multi-file. Nama field harus `files` (bukan `file`) |

**Response `200 OK`:**

```json
{
  "documents": [
    {
      "id": "doc-1",
      "fileName": "RAT-2024.pdf",
      "fileSize": 1048576,
      "status": "queued",
      "uploadedAt": "2026-06-22T10:30:00.000Z"
    }
  ],
  "message": "Dokumen berhasil diupload"
}
```

**Catatan:**
- Setiap file yang diupload harus langsung berstatus `queued`
- Frontend menampilkan progress upload via `onUploadProgress` Axios
- Setelah sukses, frontend menampilkan toast — **tidak menunggu** engine selesai

---

### 2. List dokumen

```
GET /documents?status={status}
```

**Query parameter `status`:**

| Nilai | Fungsi |
|-------|--------|
| `queue` | Dokumen `queued` + `processing` (digabung) |
| `done` | Dokumen selesai |
| *(kosong)* | Semua dokumen (dipakai polling global) |

**Response `200 OK`:** array dokumen

```json
[
  {
    "id": "doc-1",
    "fileName": "RAT-2024.pdf",
    "fileSize": 1048576,
    "status": "processing",
    "uploadedAt": "2026-06-22T10:30:00.000Z"
  }
]
```

**Urutan antrian (disarankan):**
1. `processing` di atas
2. `queued` di bawah (FIFO)

---

### 3. Hasil penilaian

```
GET /documents/:id/results
```

Hanya tersedia jika `status === 'done'`.

**Response `200 OK`:**

```json
{
  "document": {
    "id": "doc-1",
    "fileName": "RAT-2024.pdf",
    "fileSize": 1048576,
    "status": "done",
    "uploadedAt": "2026-06-22T10:30:00.000Z"
  },
  "results": {
    "totalSkorParsial": 64.35,
    "persentaseParsial": 75.7,
    "bobotDapatDihitung": 85,
    "predikat": "CUKUP SEHAT",
    "tidakDapatDihitung": {
      "aspek": "Manajemen",
      "bobot": 15,
      "skor": 0,
      "flag": "Tidak Dapat Dihitung - Data Manajemen Tidak Tersedia",
      "catatan": "Penilaian aspek manajemen memerlukan data non-keuangan yang tidak ditemukan dalam dokumen.",
      "komponen": [
        { "nama": "Manajemen Umum", "jumlahPertanyaan": 12 },
        { "nama": "Kelembagaan", "jumlahPertanyaan": 6 },
        { "nama": "Manajemen Permodalan", "jumlahPertanyaan": 5 },
        { "nama": "Manajemen Aktiva", "jumlahPertanyaan": 10 },
        { "nama": "Manajemen Likuiditas", "jumlahPertanyaan": 5 }
      ]
    },
    "detail": [
      {
        "aspek": "Permodalan",
        "komponen": "Rasio Modal Sendiri terhadap Total Asset",
        "nilaiRasio": 45.67,
        "nilai": 50,
        "bobot": 6,
        "skor": 3.0,
        "persentaseMaks": 50,
        "status": "Kuning"
      }
    ]
  }
}
```

**Response jika belum selesai:** `404` atau error message yang bisa dibaca frontend.

---

## Skema Response

### Objek `document`

| Field | Tipe | Wajib | Keterangan |
|-------|------|-------|------------|
| `id` | string | Ya | ID unik dokumen |
| `fileName` | string | Ya | Nama file asli |
| `fileSize` | number | Ya | Ukuran dalam bytes |
| `status` | string | Ya | `queued` / `processing` / `done` / `failed` |
| `uploadedAt` | string (ISO 8601) | Ya | Waktu upload |

### Objek `results`

| Field | Tipe | Wajib | Keterangan |
|-------|------|-------|------------|
| `totalSkorParsial` | number | Ya | Total skor dari aspek dapat dihitung |
| `persentaseParsial` | number | Ya | Persentase dari 85 bobot |
| `bobotDapatDihitung` | number | Ya | Biasanya `85` |
| `predikat` | string | Ya | `SEHAT` / `CUKUP SEHAT` / `KURANG SEHAT` / `TIDAK SEHAT` |
| `tidakDapatDihitung` | object | Ya | Aspek Manajemen (lihat bawah) |
| `detail` | array | Ya | Baris skor per komponen |

### Objek `detail[]`

| Field | Tipe | Wajib | Keterangan |
|-------|------|-------|------------|
| `aspek` | string | Ya | Nama aspek penilaian |
| `komponen` | string | Ya | Nama komponen/rasio |
| `nilaiRasio` | number | Ya | Nilai rasio terhitung |
| `nilai` | number | Ya | Nilai skor komponen |
| `bobot` | number | Ya | Bobot komponen |
| `skor` | number | Ya | Skor terbobot |
| `persentaseMaks` | number | Ya | Persentase maksimal komponen |
| `status` | string | Ya | `Hijau` / `Kuning` / `Merah` |

### Predikat kesehatan

| Predikat | Kondisi (contoh) |
|----------|------------------|
| `SEHAT` | Persentase parsial tinggi |
| `CUKUP SEHAT` | Persentase parsial menengah-atas |
| `KURANG SEHAT` | Persentase parsial menengah-bawah |
| `TIDAK SEHAT` | Persentase parsial rendah |

Logika predikat ditentukan engine backend — frontend hanya menampilkan string yang dikirim.

---

## Aturan Upload

Aturan ini sudah divalidasi di frontend. Backend disarankan validasi ulang:

| Aturan | Nilai |
|--------|-------|
| Jumlah file | Multi-file (tidak dibatasi 1) |
| Batas ukuran total | Maksimal **20 MB** (semua file digabung) |
| Format | PDF (utama), JPG, PNG, WEBP |
| Field name | `files` |

---

## Polling & Perilaku Frontend

Frontend menggunakan **polling HTTP**, bukan WebSocket.

| Polling | Interval | Endpoint | Tujuan |
|---------|----------|----------|--------|
| Global watcher | 3 detik | `GET /documents` (tanpa filter) | Deteksi dokumen selesai → toast |
| Halaman antrian | 5 detik | `GET /documents?status=queue` | Refresh tabel antrian |

### Trigger toast "selesai diproses"

Toast muncul jika status berubah:

```
queued      → done
processing  → done
```

Backend cukup update status — frontend yang mendeteksi perubahan.

### Implikasi untuk backend

- Tidak perlu endpoint khusus notifikasi
- Status harus konsisten di setiap `GET /documents`
- Hasil skor harus tersedia segera setelah status `done`

---

## Skor Parsial & Manajemen

Dokumen RAT biasanya hanya berisi angka keuangan — **aspek Manajemen (15 bobot) tidak dapat dihitung** dari dokumen saja.

Lihat [TIDAK_DAPAT_DIHITUNG.md](./TIDAK_DAPAT_DIHITUNG.md) untuk rincian.

### Yang diharapkan dari engine

| Aspek | Bobot | Dapat dihitung? |
|-------|-------|-----------------|
| Permodalan | 15 | Ya |
| Kualitas Aktiva Produktif | 25 | Ya |
| Manajemen | 15 | **Tidak** — set skor 0, isi `tidakDapatDihitung` |
| Efisiensi | 10 | Ya |
| Likuiditas | 15 | Ya |
| Kemandirian dan Pertumbuhan | 10 | Ya |
| Jatidiri Koperasi | 10 | Ya |

**Skor parsial = 85 bobot** (tanpa Manajemen).

---

## Error Handling

### Format error yang disarankan

Frontend membaca `err.message` dari Axios. Disarankan response error:

```json
{
  "message": "Ukuran file melebihi batas 20 MB"
}
```

atau HTTP status code standar dengan body yang bisa di-parse.

### Kode status HTTP

| Kode | Situasi |
|------|---------|
| `200` | Sukses |
| `400` | Validasi gagal (format, ukuran) |
| `404` | Dokumen/hasil tidak ditemukan |
| `413` | File terlalu besar |
| `500` | Error server/engine |

---

## CORS

Backend **wajib** mengizinkan origin frontend.

**Development:**

```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

Sesuaikan origin untuk staging/production.

---

## Checklist Integrasi

### Backend

- [ ] `POST /documents/upload` — terima multi-file, field `files`
- [ ] `GET /documents?status=queue` — return `queued` + `processing`
- [ ] `GET /documents?status=done` — return dokumen selesai
- [ ] `GET /documents` — return semua dokumen (untuk polling)
- [ ] `GET /documents/:id/results` — return skema hasil lengkap
- [ ] Status flow: `queued` → `processing` → `done`
- [ ] Engine menghitung skor parsial (85 bobot) + `tidakDapatDihitung`
- [ ] CORS dikonfigurasi untuk origin frontend
- [ ] Response JSON match skema di dokumen ini

### Frontend (sudah siap)

- [x] UI upload, antrian, selesai, detail hasil
- [x] Layer API di `src/services/api.js`
- [x] Polling status + toast notifikasi
- [x] Mock mode untuk testing tanpa backend
- [x] Switch ke backend via `VITE_USE_MOCK=false`

### Uji integrasi

1. Set `VITE_USE_MOCK=false` dan `VITE_API_BASE_URL` ke backend
2. Upload 1 file PDF → cek toast sukses + muncul di antrian
3. Tunggu engine selesai → cek toast "selesai diproses"
4. Buka halaman Selesai → klik dokumen → cek tabel skor
5. Upload 2+ file → cek antrian FIFO
6. Upload file > 20 MB → cek error handling

---

## Di Luar Scope (Phase 2)

Fitur berikut **belum** diimplementasi di frontend — tidak menghalangi integrasi dasar:

- Autentikasi / authorization
- Daftar koperasi
- Filter & search dokumen
- Export PDF / Excel
- Preview PDF
- WebSocket / push notification

---

## Dokumen Terkait

- [README.md](./README.md) — Dokumentasi proyek & instalasi
- [ARSITEKTUR.md](./ARSITEKTUR.md) — Diagram arsitektur sistem
- [TIDAK_DAPAT_DIHITUNG.md](./TIDAK_DAPAT_DIHITUNG.md) — Aspek Manajemen
- `src/services/api.js` — Implementasi HTTP client frontend

---

## Kontak & Catatan

Path endpoint final (`/api/documents/...` vs `/documents/...`) mengikuti konvensi tim backend — cukup sesuaikan `VITE_API_BASE_URL` agar base path-nya benar.

Contoh: jika backend expose `http://localhost:8000/api/v1/documents`, set:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Frontend akan memanggil `{baseURL}/documents/upload`, dst.