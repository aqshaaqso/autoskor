# 08 — Komponen UI & Styling

Panduan mengubah tampilan, menambah komponen UI, dan bekerja dengan Tailwind CSS.

---

## Sistem Styling

Proyek memakai **Tailwind CSS v4** dengan plugin Vite (`@tailwindcss/vite`).

- Entry CSS: `src/index.css`
- **Tidak ada** file CSS per komponen
- Semua styling via `className` string di `h('div', { className: '...' })`

---

## Tema Warna Global

Didefinisikan di `src/index.css` blok `@theme`:

| Token | Penggunaan |
|-------|------------|
| `primary-*` | Tombol utama, link aktif, brand |
| `success-*` | Status sukses, predikat SEHAT |
| `warning-*` | Peringatan, status antrian |
| `danger-*` | Error, gagal, hapus |
| `slate-*` | Netral (bawaan Tailwind) |

### Contoh pemakaian

```js
h('button', {
  className: 'rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700',
}, 'Simpan')

h('p', { className: 'text-danger-600 text-sm' }, pesanError)
```

### Mengubah warna brand

Edit nilai `--color-primary-*` di `src/index.css` → `@theme`.

---

## Layout Halaman Standar

```js
h('div', { className: 'mx-auto max-w-5xl px-6 py-8' },
  h('div', { className: 'mb-8' },
    h('h1', { className: 'text-2xl font-bold text-slate-900' }, 'Judul Halaman'),
    h('p', { className: 'mt-2 text-slate-500' }, 'Deskripsi singkat.'),
  ),
  // konten...
)
```

| Halaman | max-width umum |
|---------|----------------|
| Upload | `max-w-5xl` |
| Antrian, Selesai | `max-w-6xl` |
| Engine dashboard | `max-w-7xl` |

---

## Komponen Shared UI

Lokasi: `src/shared/ui/`

| Komponen | File | Kapan dipakai |
|----------|------|---------------|
| `Toast` | `Toast.js` | Notifikasi global (via `useUiStore`) |
| `PageLoader` | `PageLoader.js` | Fallback lazy loading halaman |
| `StatCard` | `StatCard.js` | Kartu angka di engine dashboard |
| `ConfirmDialog` | `ConfirmDialog.js` | Konfirmasi hapus/destructive action |
| `TablePagination` | `TablePagination.js` | Pagination tabel dokumen |
| `DocumentStatusBadge` | `DocumentStatusBadge.js` | Badge status di tabel |
| `AppErrorBoundary` | `AppErrorBoundary.js` | Tangkap crash React |

### Export

```js
import { Toast, ConfirmDialog, TablePagination } from '@/shared/ui'
```

### Menambah komponen shared baru

1. Buat `src/shared/ui/NamaKomponen.js`
2. Export di `src/shared/ui/index.js`
3. Pastikan komponen **generik** — tanpa logic bisnis spesifik fitur

---

## DocumentStatusBadge

Komponen penting — dipakai di tabel antrian, selesai, engine.

```js
import { DocumentStatusBadge } from '@/shared/ui'

h(DocumentStatusBadge, { status: document.status })
```

`status` = kode internal UI: `queued`, `processing`, `done`, `failed`

Label & warna dari `documentStatusLabels.js` — **jangan** hardcode di pemanggil.

### Mengubah tampilan badge

Edit `src/shared/ui/DocumentStatusBadge.js` dan/atau `documentStatusLabels.js`.

---

## Sidebar & Layout

| File | Ubah untuk |
|------|------------|
| `MainLayout.js` | Struktur sidebar + konten + watcher + toast |
| `Sidebar.js` | Menu items, logo, collapse |
| `SidebarMenuItem.js` | Style item aktif/nonaktif |
| `UserMenu.js` | Dropdown user, tombol logout |

### Sidebar collapse

State di `useUiStore.sidebarCollapsed`. Toggle via tombol chevron di `Sidebar.js`.

---

## Tabel Dokumen

`DocumentTable.js` — komponen reusable untuk antrian & selesai.

Props umum:
- `documents` — array dari store
- `variant` — `'queue'` atau `'processed'`
- `onCancel`, `onViewResult`, dll.

### Menambah kolom tabel

1. Edit header di `DocumentTable.js`
2. Edit cell render per baris
3. Pastikan field tersedia di objek dokumen (mapper)
4. Untuk kolom admin-only (mis. Pengupload), cek `isAdmin` prop

---

## Icon (lucide-react)

```js
import { Upload, Trash2, Eye, Download } from 'lucide-react'

h(Upload, { className: 'h-5 w-5 text-slate-400' })
```

Ukuran umum: `h-4 w-4` (inline), `h-5 w-5` (tombol), `h-8 w-8` (loading).

---

## Tombol — Pola Class Umum

```js
// Primary
'inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50'

// Secondary
'inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50'

// Danger
'inline-flex items-center gap-2 rounded-lg bg-danger-600 px-3 py-1.5 text-sm text-white hover:bg-danger-700'

// Icon only
'flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100'
```

Beberapa halaman mendefinisikan constant string di atas file (mis. `btnSecondary` di `QueuePage.js`) — ikuti pola yang sama di halaman baru.

---

## Modal & Dialog

| Komponen | File |
|----------|------|
| Detail dokumen | `DocumentDetailModal.js` |
| Preview PDF hasil | `ResultPdfPreviewModal.js` |
| Konfirmasi umum | `ConfirmDialog.js` (shared) |

Pola modal: state `isOpen` di komponen parent + render conditional.

```js
const [isModalOpen, setIsModalOpen] = useState(false)

// ...
isModalOpen && h(DocumentDetailModal, {
  document,
  onClose: () => setIsModalOpen(false),
})
```

---

## Loading States

| Konteks | Komponen/pola |
|---------|---------------|
| Lazy page load | `PageLoader` (Suspense fallback) |
| Fetch data halaman | `Loader2` dari lucide + `animate-spin` |
| Tombol async | `disabled` + spinner kecil di dalam tombol |
| Inisialisasi auth | Full-screen spinner di `ProtectedRoute` |

---

## Responsive Design

Proyek utama untuk desktop dashboard. Tailwind breakpoint tersedia (`sm:`, `md:`, `lg:`) tapi sebagian besar layout belum mobile-first.

Jika menambah responsive:
- Sidebar: pertimbangkan hide di `md:` ke bawah
- Tabel: `overflow-x-auto` wrapper

---

## Font

```css
/* index.css */
font-family: "Inter", system-ui, ...
```

Pastikan font Inter di-load — cek `index.html` untuk link Google Fonts jika ada.

---

## Preview Dokumen (Khusus)

| Tipe | Render |
|------|--------|
| PDF | `<iframe src={blobUrl}>` |
| DOCX | `docx-preview` library render ke div |

File: `features/preview/pages/FilePreviewPage.js`

---

## PDF Hasil Penilaian (jsPDF)

Generate client-side — **bukan** styling Tailwind.

File: `features/documents/utils/generateResultPdf.js`

Mengubah layout PDF (header, tabel, font) → edit fungsi `buildResultPdfDoc` di file tersebut.

---

## Checklist Perubahan UI

- [ ] Pakai token warna tema (`primary-*`, bukan hex random)
- [ ] Konsisten spacing (`px-6 py-8`, `gap-2`, `mb-8`)
- [ ] Label Bahasa Indonesia
- [ ] State loading & error ter-handle
- [ ] Tombol `type="button"` jika bukan submit
- [ ] `aria-label` pada tombol icon-only
- [ ] Cek tampilan dengan role admin dan user biasa

---

## Langkah Berikutnya

- Label & konstanta penilaian → [09-konstanta-penilaian-dan-label.md](./09-konstanta-penilaian-dan-label.md)
- Panduan per fitur → [11-panduan-per-fitur.md](./11-panduan-per-fitur.md)