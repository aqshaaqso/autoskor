# 05 — Menambah atau Mengubah Fitur

Panduan membuat modul fitur baru atau mengubah fitur existing di `src/features/`.

---

## Apa Itu "Fitur" di Proyek Ini?

Satu fitur = satu domain bisnis dengan folder sendiri di `src/features/`:

| Fitur existing | Domain |
|----------------|--------|
| `auth` | Login, session, route guard |
| `upload` | Pilih & unggah file RAT |
| `preview` | Tampilkan file PDF/DOCX |
| `documents` | Antrian, selesai, hasil skor, PDF |
| `engine` | Monitoring worker (admin) |
| `admin` | Aktivitas pengguna (admin) |

---

## Anatomi Folder Fitur

```
features/namaFitur/
├── api/              ← Fungsi async pemanggilan backend
├── components/       ← UI spesifik fitur
├── pages/            ← Halaman route
├── store/            ← Zustand store (jika state kompleks)
├── utils/            ← Helper non-UI
├── hooks/            ← Custom hooks (opsional, lihat engine)
├── constants.js      ← Konstanta fitur
└── index.js          ← Public API (barrel export)
```

**Tidak semua subfolder wajib** — `preview` tidak punya store; `admin` tidak punya store.

---

## Kapan Membuat Fitur Baru vs Mengedit Existing

| Situasi | Tindakan |
|---------|----------|
| Ubah tampilan tabel antrian | Edit `features/documents/` |
| Tambah kolom di hasil skor | Edit `features/documents/components/results/` |
| Fitur laporan terpisah | Buat `features/laporan/` baru |
| Komponen dipakai 2+ fitur | Pindah ke `shared/ui/` |
| Logic mapping API | Taruh di `shared/api/`, bukan feature |

---

## Template: Fitur Baru Lengkap

### 1. `constants.js`

```js
export const LAPORAN_REFRESH_MS = 30_000
```

### 2. `api/laporanApi.js`

```js
import { api } from '@/shared/api/client'

export async function fetchLaporan(params) {
  const { data } = await api.get('/laporan', { params })
  return data
}
```

### 3. `store/useLaporanStore.js`

```js
import { create } from 'zustand'
import { fetchLaporan } from '../api/laporanApi'
import { getApiErrorMessage } from '@/shared/api/client'

export const useLaporanStore = create((set) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async () => {
    set({ isLoading: true, error: null })
    try {
      const items = await fetchLaporan()
      set({ items, isLoading: false })
    } catch (err) {
      set({
        error: getApiErrorMessage(err, 'Gagal memuat laporan.'),
        isLoading: false,
      })
    }
  },
}))
```

### 4. `pages/LaporanPage.js`

```js
import { createElement as h, useEffect } from 'react'
import { useLaporanStore } from '../store/useLaporanStore'

export function LaporanPage() {
  const { items, isLoading, error, fetchItems } = useLaporanStore()

  useEffect(() => {
    void fetchItems()
  }, [fetchItems])

  if (isLoading) return h('p', null, 'Memuat...')
  if (error) return h('p', { className: 'text-danger-600' }, error)

  return h('div', { className: 'mx-auto max-w-5xl px-6 py-8' },
    h('h1', { className: 'text-2xl font-bold' }, 'Laporan'),
    // render items...
  )
}
```

### 5. `index.js`

```js
export { LaporanPage } from './pages/LaporanPage'
export { useLaporanStore } from './store/useLaporanStore'
export { fetchLaporan } from './api/laporanApi'
```

Lalu hubungkan ke routing (lihat [04-mengubah-halaman-dan-routing.md](./04-mengubah-halaman-dan-routing.md)).

---

## Mengubah Fitur Existing — Panduan per Lapisan

### Mengubah komponen UI fitur

1. Buka `features/<fitur>/components/<Komponen>.js`
2. Edit struktur `h(...)` dan props
3. Jika komponen menerima data baru, update pemanggil di `pages/` atau komponen parent

### Mengubah logic bisnis fitur

1. Cek apakah logic ada di `utils/` — edit di sana
2. Jika logic terkait API response, mungkin harus edit `shared/api/scoringJobs/scoringJobsMapper.js`

### Menambah action baru di store

Contoh menambah `exportDocument` di `useDocumentStore`:

1. Tambah fungsi API di `documentsApi.js`
2. Tambah state (`isExporting`, `exportError`) di store
3. Tambah action `exportDocument: async (id) => { ... }`
4. Panggil dari komponen via `useDocumentStore`

### Menambah komponen ke fitur existing

```
features/documents/components/NamaBaru.js   ← buat file
features/documents/index.js                 ← export jika perlu di luar fitur
```

Import relatif dari halaman:

```js
import { NamaBaru } from '../components/NamaBaru'
```

---

## Kapan Memindah ke `shared/`

Pindahkan ke `shared/` jika:

- Komponen dipakai **2 fitur atau lebih** (contoh: `DocumentStatusBadge`)
- Utilitas generik (`formatDateTime`, `getFileExtension`)
- Konstanta global (`ASPEK`, `fileTypes`)
- HTTP client & mapper

**Jangan** pindahkan ke shared hanya karena "mungkin dipakai nanti" — tunggu sampai benar-benar dipakai lintas fitur.

---

## Dependensi Antar Fitur

### Diperbolehkan

```js
// upload → documents (setelah upload sukses, refresh antrian)
import { useDocumentStore } from '@/features/documents'

// documents → preview (buka preview file server)
import { openUploadedDocumentPreview } from '@/features/documents'
// atau dari preview barrel
```

### Dihindari

```js
// SALAH — import langsung ke file dalam
import { DocumentTable } from '@/features/documents/components/DocumentTable'

// BENAR
import { DocumentTable } from '@/features/documents'
```

### Circular dependency

Jika fitur A butuh B dan B butuh A:
1. Ekstrak logic bersama ke `shared/utils/`
2. Atau buat callback/event via store `shared`

---

## Fitur dengan Mock Backend

Hanya **auth** dan **admin** punya mock. Pola di `authApi.js`:

```js
import { USE_MOCK_AUTH } from '@/shared/api/config'
import { mockLogin } from '@/shared/api/mock/authMock'

export async function login(email, password) {
  if (USE_MOCK_AUTH) {
    return mockLogin(email, password)
  }
  const { data } = await api.post('/auth/login', { email, password })
  return data
}
```

Saat menambah fitur yang **belum punya endpoint middleware**, Anda bisa:
1. Buat mock di `shared/api/mock/namaMock.js`
2. Switch di feature API mirip `authApi.js`
3. Tambah flag di `config.js` dan `.env.example`

**Jangan** mock scoring jobs — fitur dokumen selalu real API.

---

## Komponen Hasil Skor (Khusus `documents`)

Komponen penilaian ada di `features/documents/components/results/`:

| Komponen | Fungsi |
|----------|--------|
| `ScoreSummary` | Ringkasan skor parsial, predikat |
| `ResultsTable` | Tabel detail per komponen |
| `TidakDapatDihitungPanel` | Panel aspek Manajemen (bobot 15) |

Ini **bukan fitur terpisah** — semua terkait tampilan hasil dokumen.

---

## Checklist Fitur Baru

- [ ] Folder `features/<nama>/` dengan struktur standar
- [ ] `index.js` barrel export
- [ ] Tidak ada circular import
- [ ] API lewat `client.js`, bukan fetch manual
- [ ] Error handling pakai `getApiErrorMessage`
- [ ] Halaman terhubung ke routing + lazy load
- [ ] Label UI Bahasa Indonesia
- [ ] `npm run build` sukses

---

## Langkah Berikutnya

- Integrasi API → [06-mengubah-api-dan-backend.md](./06-mengubah-api-dan-backend.md)
- State Zustand detail → [07-state-management-zustand.md](./07-state-management-zustand.md)
- Panduan tiap fitur existing → [11-panduan-per-fitur.md](./11-panduan-per-fitur.md)