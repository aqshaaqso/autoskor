# 04 — Mengubah Halaman & Routing

Panduan lengkap untuk mengedit halaman existing, mengubah URL, atau menambah halaman baru.

---

## Peta Route Saat Ini

| Path | Komponen | Guard | Sidebar |
|------|----------|-------|---------|
| `/login` | `LoginPage` | Publik | — |
| `/` | Redirect → `/upload` | ProtectedRoute | — |
| `/upload` | `UploadPage` | ProtectedRoute | Unggah |
| `/preview/:previewId` | `FilePreviewPage` | ProtectedRoute | — |
| `/preview/document/:documentId` | `FilePreviewPage` | ProtectedRoute | — |
| `/queue` | `QueuePage` | ProtectedRoute | Antrian |
| `/processed` | `ProcessedPage` | ProtectedRoute | Selesai |
| `/processed/:id` | `ProcessedDetailPage` | ProtectedRoute | — |
| `/engine` | `EngineDashboardPage` | AdminRoute | Engine |
| `/admin/activity` | `UserActivityPage` | AdminRoute | Aktivitas Pengguna |
| `*` (404) | Redirect → `/upload` | — | — |

Definisi route ada di `src/app/App.js`.
Lazy loading ada di `src/app/lazyPages.js`.
Menu sidebar ada di `src/shared/layout/Sidebar.js`.

---

## Cara Mengedit Halaman Existing

### Langkah umum

1. Buka file di `src/features/<fitur>/pages/<NamaPage>.js`
2. Edit JSX-equivalent (`h(...)`) dan className Tailwind
3. Jika butuh data baru, tambahkan action di store fitur tersebut
4. Refresh browser — HMR akan update otomatis

### Contoh: mengubah judul halaman upload

File: `src/features/upload/pages/UploadPage.js`

```js
h('h1', { className: 'text-2xl font-bold text-slate-900' }, 'Upload Dokumen RAT'),
// Ubah teks di argumen ke-3
```

### Contoh: mengubah deskripsi halaman antrian

File: `src/features/documents/pages/QueuePage.js`

Cari elemen `h('p', ...)` di bawah `h('h1', ...)`.

### Halaman dengan data dari API

Pola umum di `QueuePage`, `ProcessedPage`, dll.:

```js
const { documents, isLoading, fetchDocuments } = useDocumentStore()

useEffect(() => {
  void fetchDocuments()
}, [fetchDocuments])
```

Jangan tambahkan `api.get()` langsung di halaman — extend store jika perlu fetch baru.

---

## Cara Mengubah Label Menu Sidebar

File: `src/shared/layout/Sidebar.js`

```js
const menuItems = [
  { label: 'Unggah', path: '/upload', icon: Upload },
  {
    label: UI_PAGE_FILTERS.queue.label,  // 'Antrian' — dari middlewareContract
    path: UI_PAGE_FILTERS.queue.path,
    icon: ListOrdered,
  },
  // ...
]
```

**Untuk halaman antrian/selesai:** ubah label di `src/shared/api/middlewareContract.js` → `UI_PAGE_FILTERS`, bukan hardcode di Sidebar.

**Untuk menu admin:** item punya `roles: ['admin']` — hanya tampil untuk role admin.

---

## Cara Menambah Halaman Baru

### Skenario: halaman user biasa di dalam layout

Misal: halaman `/laporan` untuk fitur baru.

#### Step 1 — Buat file halaman

```
src/features/laporan/pages/LaporanPage.js
```

```js
import { createElement as h } from 'react'

export function LaporanPage() {
  return h(
    'div',
    { className: 'mx-auto max-w-5xl px-6 py-8' },
    h('h1', { className: 'text-2xl font-bold text-slate-900' }, 'Laporan'),
  )
}
```

#### Step 2 — Export di barrel fitur

`src/features/laporan/index.js`:

```js
export { LaporanPage } from './pages/LaporanPage'
```

#### Step 3 — Lazy load

`src/app/lazyPages.js`:

```js
export const LaporanPage = lazyNamed(
  () => import('@/features/laporan/pages/LaporanPage'),
  'LaporanPage',
)
```

#### Step 4 — Tambah route

`src/app/App.js` — di dalam nested route `MainLayout`:

```js
import { LaporanPage } from './lazyPages'

// Di dalam children route path '/':
h(Route, { path: 'laporan', element: suspensePage(LaporanPage) }),
```

#### Step 5 — Tambah menu sidebar (opsional)

`src/shared/layout/Sidebar.js`:

```js
import { FileText } from 'lucide-react'

{ label: 'Laporan', path: '/laporan', icon: FileText },
```

### Skenario: halaman khusus admin

Sama seperti di atas, tapi di `App.js` bungkus dengan `AdminRoute`:

```js
h(Route, {
  path: 'laporan-admin',
  element: h(AdminRoute, null, suspensePage(LaporanAdminPage)),
}),
```

Dan tambahkan `roles: ['admin']` di item sidebar.

### Skenario: halaman publik (tanpa login)

Letakkan di luar `ProtectedRoute` di `App.js`, seperti `/login`:

```js
h(Route, {
  path: '/kebijakan-privasi',
  element: suspensePage(KebijakanPrivasiPage),
}),
```

### Skenario: halaman fullscreen (tanpa sidebar)

Route di luar nested `MainLayout`, tapi masih `ProtectedRoute` — contoh: preview file.

```js
h(Route, {
  path: '/preview/:previewId',
  element: h(ProtectedRoute, null, suspensePage(FilePreviewPage)),
}),
```

---

## Parameter URL (Dynamic Route)

### Membaca parameter

```js
import { useParams, useNavigate } from 'react-router-dom'

export function ProcessedDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  // id = UUID dari /processed/:id
}
```

### Navigasi programmatic

```js
navigate('/processed')
navigate(`/processed/${documentId}`)
navigate(-1)  // kembali
```

Contoh navigasi "Lihat Hasil" ada di `DocumentTable.js`.

---

## Lazy Loading & Code Splitting

Setiap halaman di-import lazy via `lazyPages.js` agar bundle awal kecil.

**Jangan** import halaman langsung di `App.js`:

```js
// SALAH
import { UploadPage } from '@/features/upload/pages/UploadPage'

// BENAR
import { UploadPage } from './lazyPages'
```

Halaman dibungkus `Suspense` dengan fallback `PageLoader` lewat helper `suspensePage()` di `App.js`.

---

## Layout Global

`MainLayout` (`src/shared/layout/MainLayout.js`) berisi:
- `Sidebar` — navigasi kiri
- `<Outlet />` — tempat halaman aktif dirender
- `DocumentWatcher` — polling status dokumen
- `Toast` — notifikasi global

Komponen global yang harus tampil di semua halaman user → tambahkan di `MainLayout`, bukan di setiap halaman.

---

## Protected Route & Redirect Login

`ProtectedRoute` (`src/features/auth/components/ProtectedRoute.js`):
1. Panggil `initialize()` untuk validasi token
2. Tampilkan spinner saat `isInitializing`
3. Redirect ke `/login` jika tidak ada token
4. Simpan `location` di state untuk redirect balik setelah login

`AdminRoute` — sama + cek `user.role === 'admin'`.

---

## Checklist Menambah Halaman

- [ ] File halaman di `features/<nama>/pages/`
- [ ] Export di `features/<nama>/index.js`
- [ ] Entry di `lazyPages.js`
- [ ] Route di `App.js` dengan guard yang tepat
- [ ] Item sidebar (jika perlu navigasi)
- [ ] Store + API (jika butuh data dari server)
- [ ] Uji navigasi manual di browser
- [ ] `npm run build` sukses

---

## Langkah Berikutnya

- Struktur fitur lengkap → [05-menambah-atau-mengubah-fitur.md](./05-menambah-atau-mengubah-fitur.md)
- Panduan per halaman existing → [11-panduan-per-fitur.md](./11-panduan-per-fitur.md)