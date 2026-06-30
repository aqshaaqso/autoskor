# 03 — Konvensi Kode

Aturan penulisan kode yang harus diikuti agar perubahan Anda konsisten dengan codebase existing.

---

## JavaScript Murni — Tanpa JSX, Tanpa TypeScript

Proyek ini **tidak memakai JSX** dan **tidak memakai TypeScript**. Semua UI dirender dengan `React.createElement`.

### Pola standar

```js
import { createElement as h, useEffect, useState } from 'react'

export function NamaKomponen({ propA, propB }) {
  return h(
    'div',
    { className: 'mx-auto max-w-5xl px-6 py-8' },
    h('h1', { className: 'text-2xl font-bold text-slate-900' }, 'Judul'),
    h(NamaKomponenAnak, { propA }),
  )
}
```

**Alias `h`** adalah konvensi proyek — selalu import sebagai:

```js
import { createElement as h } from 'react'
```

### Conditional rendering

```js
// Kondisi boolean — child ke-3 hanya dirender jika truthy
h('div', null,
  isLoading && h(Loader2, { className: 'h-4 w-4 animate-spin' }),
  !isLoading && h('p', null, 'Selesai'),
)

// List
items.map((item) =>
  h(ListItem, { key: item.id, item }),
)
```

### Event handler

```js
h('button', {
  type: 'button',
  onClick: () => void handleClick(),
  className: 'rounded-lg bg-primary-600 px-4 py-2 text-white',
}, 'Klik')
```

Gunakan `type: 'button'` pada tombol yang bukan submit form — mencegah reload halaman.

---

## Penamaan File & Export

| Jenis | Konvensi file | Export |
|-------|---------------|--------|
| Halaman | `NamaPage.js` | `export function NamaPage()` |
| Komponen | `PascalCase.js` | `export function NamaKomponen()` |
| Store Zustand | `useNamaStore.js` | `export const useNamaStore = create(...)` |
| API | `namaApi.js` | `export async function namaFungsi()` |
| Utilitas | `camelCase.js` | `export function namaFungsi()` |
| Konstanta | `constants.js` atau `namaKonstanta.js` | `export const NAMA_KONSTANTA = ...` |
| Test | `namaModul.test.js` | Berdampingan dengan modul |

**Satu komponen utama per file** — jangan gabungkan banyak komponen besar dalam satu file kecuali helper kecil (< 20 baris).

---

## Import — Aturan Path

### Dari luar fitur → barrel `@/features/...`

```js
import { useAuthStore, ProtectedRoute } from '@/features/auth'
import { useDocumentStore, DocumentTable } from '@/features/documents'
import { UploadPage } from '@/features/upload'
```

### Dari shared → barrel `@/shared/...`

```js
import { MainLayout } from '@/shared/layout'
import { Toast, DocumentStatusBadge } from '@/shared/ui'
import { useUiStore } from '@/shared/store'
import { api, getApiErrorMessage } from '@/shared/api/client'
import { formatDateTime } from '@/shared/utils/format'
import { ASPEK } from '@/shared/constants'
```

### Di dalam fitur yang sama → path relatif

```js
import { useDocumentStore } from '../store/useDocumentStore'
import { DocumentTable } from '../components/DocumentTable'
import { uploadDocument } from '../api/documentsApi'
```

### Urutan import (disarankan)

1. React / library eksternal
2. `@/features/...`
3. `@/shared/...`
4. Import relatif (`../`)

---

## Barrel Export (`index.js`)

Setiap fitur punya `index.js` yang mengekspor **hanya API publik**:

```js
// features/documents/index.js
export { QueuePage } from './pages/QueuePage'
export { useDocumentStore } from './store/useDocumentStore'
export { DocumentTable } from './components/DocumentTable'
// ...
```

**Saat menambah komponen/halaman baru yang perlu diakses fitur lain:**
1. Buat file di folder yang tepat
2. Tambahkan `export` di `index.js` fitur tersebut

---

## Async / Error Handling

### Di store (pola standar)

```js
fetchData: async () => {
  set({ isLoading: true, error: null })
  try {
    const data = await getDataFromApi()
    set({ data, isLoading: false })
  } catch (err) {
    const message = getApiErrorMessage(err, 'Gagal memuat data.')
    set({ error: message, isLoading: false })
  }
},
```

### Di komponen

```js
useEffect(() => {
  void fetchData()
}, [fetchData])
```

Prefix `void` pada async di `useEffect` — konvensi proyek untuk mengabaikan Promise return.

### Pesan error ke user

Selalu pakai `getApiErrorMessage` dari `@/shared/api/client` — membaca `message`, `detail`, atau `error` dari response Axios.

---

## State Management — Selector Zustand

Prefer selector spesifik agar re-render minimal:

```js
// Baik — hanya re-render saat role berubah
const userRole = useAuthStore((state) => state.user?.role)

// Kurang optimal — re-render saat state apapun di store berubah
const store = useAuthStore()
```

---

## Styling — Tailwind CSS

- Class ditulis langsung di prop `className` string
- Pakai warna tema: `primary-*`, `success-*`, `warning-*`, `danger-*` (didefinisikan di `src/index.css`)
- Layout halaman umum: `mx-auto max-w-5xl px-6 py-8` atau `max-w-6xl`
- Tombol sekunder umum: `inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm ...`

**Jangan** buat file CSS terpisah per komponen — proyek ini full Tailwind utility.

---

## Icon — lucide-react

```js
import { Upload, Loader2, RefreshCw } from 'lucide-react'

h(Upload, { className: 'h-4 w-4' })
```

Cari icon di https://lucide.dev/icons

---

## Komentar Kode

- Komentar **hanya** untuk logika non-obvious (mapping bisnis, workaround API)
- **Jangan** komentar yang hanya mengulang nama fungsi
- File kontrak (`middlewareContract.js`) boleh punya JSDoc blok penjelasan

---

## Unit Test (Vitest)

```js
import { describe, it, expect } from 'vitest'
import { normalizeBobot } from './resultDetail'

describe('normalizeBobot', () => {
  it('mengembalikan 0 untuk nilai invalid', () => {
    expect(normalizeBobot(null)).toBe(0)
  })
})
```

Tulis test untuk:
- Mapper API (`scoringJobsMapper.js`)
- Utilitas transform data (`resultDetail.js`, `extractedIndicators.js`)
- Logic bisnis murni (tanpa DOM)

---

## Anti-Pattern (Jangan Lakukan)

| Anti-pattern | Kenapa salah | Alternatif benar |
|--------------|--------------|------------------|
| `api.get()` langsung di komponen | Melanggar lapisan arsitektur | Store → feature API |
| Hardcode `'Antrian'` di badge status | Label tidak terpusat | `documentStatusLabels.js` |
| Duplikasi mapping `waiting` → `queued` | Inkonsistensi | `middlewareContract.js` |
| Import `../../features/documents/components/X` | Coupling langsung | `@/features/documents` |
| Pakai JSX (`<div>`) | Tidak kompatibel dengan setup proyek | `createElement as h` |
| Tambah `.tsx` / TypeScript | Di luar stack proyek | `.js` murni |

---

## Langkah Berikutnya

- Ubah halaman → [04-mengubah-halaman-dan-routing.md](./04-mengubah-halaman-dan-routing.md)
- Ubah fitur → [05-menambah-atau-mengubah-fitur.md](./05-menambah-atau-mengubah-fitur.md)