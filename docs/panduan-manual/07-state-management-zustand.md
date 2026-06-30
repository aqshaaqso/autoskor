# 07 — State Management (Zustand)

Panduan mengubah dan menambah state global/lokal menggunakan Zustand di proyek AutoSkor.

---

## Store yang Ada

| Store | File | Scope |
|-------|------|-------|
| `useAuthStore` | `features/auth/store/useAuthStore.js` | User, token, login/logout |
| `useUploadStore` | `features/upload/store/useUploadStore.js` | File terpilih, progress upload |
| `useDocumentStore` | `features/documents/store/useDocumentStore.js` | Antrian, selesai, detail hasil, polling |
| `useUiStore` | `shared/store/useUiStore.js` | Toast, sidebar collapsed |

**Prinsip:** state milik satu fitur → store di fitur tersebut. State lintas fitur UI → `shared/store`.

---

## Pola Dasar Zustand

```js
import { create } from 'zustand'

export const useNamaStore = create((set, get) => ({
  // State
  items: [],
  isLoading: false,
  error: null,

  // Actions
  fetchItems: async () => {
    set({ isLoading: true, error: null })
    try {
      const items = await getItemsFromApi()
      set({ items, isLoading: false })
    } catch (err) {
      set({ error: getApiErrorMessage(err), isLoading: false })
    }
  },

  // Sync action
  clearItems: () => set({ items: [], error: null }),

  // Action yang baca state lain
  getItemById: (id) => get().items.find((item) => item.id === id),
}))
```

---

## Cara Membaca State di Komponen

```js
// Selector tunggal — re-render minimal
const isLoading = useDocumentStore((state) => state.isLoadingQueue)

// Multiple values — OK untuk halaman
const {
  queueDocuments,
  fetchQueueDocuments,
} = useDocumentStore()
```

---

## useAuthStore — Detail

### State

| Field | Tipe | Keterangan |
|-------|------|------------|
| `user` | object \| null | `{ id, name, email, role }` |
| `token` | string \| null | JWT / token mock |
| `isLoading` | boolean | Saat proses login |
| `isInitializing` | boolean | Saat validasi token di awal |
| `loginError` | string \| null | Pesan error login |

### Actions

| Action | Fungsi |
|--------|--------|
| `initialize()` | Validasi token di localStorage via `GET /auth/me` |
| `login(email, password)` | Login, simpan token |
| `logout()` | Hapus token & user |

Token disimpan di `localStorage` key `autoskor_auth_token` — helper di `client.js`.

### Mengubah behavior login

1. Edit `authApi.js` untuk format request/response
2. Edit `useAuthStore.login` jika perlu field state tambahan
3. Edit `LoginPage.js` untuk UI form

---

## useUploadStore — Detail

### State utama

- `selectedFiles` — array File object browser
- `uploadProgress` — persentase per file
- `isUploading` — flag proses upload
- `uploadError` — pesan error

### Flow upload

```
User pilih file → addFiles()
Validasi (format, 20MB) → constants upload
User klik upload → uploadFiles()
  → uploadDocument(file, onProgress) per file
  → toast sukses via useUiStore
  → clear selected files
```

### Mengubah validasi upload

- Batas ukuran: `shared/constants/upload.js` atau `features/upload/constants.js`
- Format file: `shared/constants/fileTypes.js`

---

## useDocumentStore — Detail (Paling Kompleks)

### State list

| Field | Keterangan |
|-------|------------|
| `queueDocuments` | Dokumen di antrian |
| `processedDocuments` | Dokumen selesai/gagal |
| `queuePagination` / `processedPagination` | `{ offset, limit, total }` |
| `isLoadingQueue` / `isLoadingProcessed` | Loading flag |
| `queueListError` / `processedListError` | Error message |

### State detail hasil

| Field | Keterangan |
|-------|------------|
| `documentResult` | Objek hasil skor lengkap |
| `isLoadingResult` | Loading detail |
| `resultError` | Error fetch detail |

### State operasi

| Field | Keterangan |
|-------|------------|
| `documentStatusMap` | Map `id → status` untuk deteksi perubahan (polling) |
| `hasPendingDocuments` | Ada job belum selesai |
| `isCancelingDocument` | Sedang cancel satu dokumen |
| `isClearingAllDocuments` | Sedang hapus semua antrian |

### Actions penting

| Action | API yang dipanggil |
|--------|-------------------|
| `fetchQueueDocuments` | `GET /scoring-jobs?status=queue...` |
| `fetchProcessedDocuments` | `GET /scoring-jobs?status=processed...` |
| `fetchDocumentResult(id)` | `GET /scoring-jobs/{id}` |
| `cancelQueueDocument(id)` | `POST /scoring-jobs/{id}/cancel` |
| `clearAllQueueDocuments` | Cancel semua job aktif |
| `setQueuePage` / `setProcessedPage` | Pagination |
| `syncFromPolling(jobs)` | Dipanggil `DocumentWatcher` |

### documentStatusMap — Kenapa Ada

`DocumentWatcher` polling setiap 5 detik. Store menyimpan status sebelumnya per `id`. Saat status berubah ke `done`, tampilkan toast "selesai diproses".

Jika menambah notifikasi untuk status lain, edit logic di `syncFromPolling` atau `DocumentWatcher`.

### Menambah field di list dokumen

1. Tambah mapping di `scoringJobsMapper.js` → `mapScoringJobToDocument`
2. Kolom baru di `DocumentTable.js`
3. (Opsional) field di `documentDetailFields.js` untuk modal

---

## useUiStore — Detail

### State

```js
{
  sidebarCollapsed: false,
  toast: null,  // { message, type: 'success' | 'error' | 'info' }
}
```

### Actions

```js
showToast(message, type = 'success')
hideToast()
toggleSidebar()
```

### Cara menampilkan toast dari mana saja

```js
const showToast = useUiStore((state) => state.showToast)
showToast('Berhasil diupload', 'success')
showToast('Gagal memuat data', 'error')
```

Komponen `Toast` di-render di `MainLayout` — otomatis tampil saat `toast` tidak null.

---

## Menambah Store Baru

1. Buat `features/<fitur>/store/useNamaStore.js`
2. Export di `features/<fitur>/index.js`
3. Panggil actions di `useEffect` halaman terkait
4. Jangan duplikasi state yang sudah ada di store lain

---

## Interaksi Antar Store

Contoh yang sudah ada:

```js
// useDocumentStore memanggil useUiStore untuk toast
import { useUiStore } from '@/shared/store'
const showToast = useUiStore.getState().showToast
showToast('Dokumen selesai diproses')
```

`getState()` dipakai di luar React component (di dalam action store).

---

## Anti-Pattern State

| Jangan | Lakukan |
|--------|---------|
| `useState` untuk data dari API yang dipakai banyak komponen | Zustand store |
| Duplikasi list dokumen di komponen | Baca dari `useDocumentStore` |
| Simpan token di state saja tanpa localStorage | Pakai `setStoredToken` di `client.js` |
| Fetch di setiap render | `useEffect` + action store |

`useState` lokal **tetap OK** untuk: modal open/close, input form sementara, tab aktif.

---

## Checklist Ubah State

- [ ] Loading & error state untuk setiap async action
- [ ] `getApiErrorMessage` untuk pesan error
- [ ] Action di-export & dipanggil via `void action()` di useEffect
- [ ] Tidak fetch duplikat (cek apakah `DocumentWatcher` sudah cover)
- [ ] Selector spesifik di komponen besar

---

## Langkah Berikutnya

- UI & styling → [08-komponen-ui-dan-styling.md](./08-komponen-ui-dan-styling.md)
- Panduan per fitur → [11-panduan-per-fitur.md](./11-panduan-per-fitur.md)