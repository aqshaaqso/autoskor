# AutoSkor — Dashboard Penilaian Kesehatan Koperasi

Frontend single-page dashboard untuk menghitung dan menampilkan skor penilaian kesehatan **Koperasi Simpan Pinjam (KSP)** dan **Unit Simpan Pinjam (USP)** berdasarkan **Permen KUKM No. 14/Per/M.KUKM/XII/2009**.

Ditulis dengan **JavaScript murni** — tanpa TypeScript, tanpa JSX. UI dirender memakai `React.createElement`. Struktur folder **flat** sesuai `fs.txt` (tanpa sidebar, routing, atau subfolder komponen).

---

## Daftar Isi

- [Fitur](#fitur)
- [Tech Stack](#tech-stack)
- [Prasyarat](#prasyarat)
- [Instalasi & Menjalankan](#instalasi--menjalankan)
- [Environment Variables](#environment-variables)
- [Struktur Proyek](#struktur-proyek)
- [Pendekatan JavaScript Murni](#pendekatan-javascript-murni)
- [Arsitektur & Alur Kerja](#arsitektur--alur-kerja)
- [State Management](#state-management)
- [Integrasi Backend](#integrasi-backend)
- [Skema Data Hasil](#skema-data-hasil)
- [Color Grading](#color-grading)
- [Scripts NPM](#scripts-npm)
- [Build & Deploy](#build--deploy)
- [Roadmap](#roadmap)

---

## Fitur

### MVP (Tersedia)

| Fitur | Deskripsi |
|-------|-----------|
| Single-page layout | Header sederhana + konten utama tanpa sidebar |
| Upload drag & drop | Single file upload (PDF, JPG, PNG, WEBP) |
| Preview file | Nama & ukuran file ditampilkan di area upload |
| Proses async | Tombol "Proses Sekarang" dengan loading non-blocking |
| Tabel hasil skor | Detail per aspek dan komponen/rasio |
| Ringkasan skor | Total skor, persentase, dan predikat kesehatan |
| Color grading | Status Hijau / Kuning / Merah per komponen |
| Mock mode | Testing UI tanpa backend |

### Phase 2 (Belum Tersedia)

- Riwayat upload
- Daftar koperasi
- Filter & search
- Export hasil (PDF / Excel)
- Preview PDF yang diupload
- Profile & autentikasi user

---

## Tech Stack

> Versi di bawah ini adalah versi **terinstall** saat ini (`npm list --depth=0`). Range di `package.json` memakai `^` sehingga minor/patch bisa ter-update saat `npm install`.

### Core

| Teknologi | Versi Terinstall | Range `package.json` | Peran |
|-----------|------------------|----------------------|-------|
| [React](https://react.dev/) | **19.2.7** | `^19.1.0` | Library UI |
| [React DOM](https://react.dev/) | **19.2.7** | `^19.1.0` | React renderer untuk browser |
| [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) | ES2022+ | — | Bahasa pemrograman |
| [Vite](https://vite.dev/) | **6.4.3** | `^6.3.5` | Dev server & build tool |

### Styling & UI

| Teknologi | Versi Terinstall | Range `package.json` | Peran |
|-----------|------------------|----------------------|-------|
| [Tailwind CSS](https://tailwindcss.com/) | **4.3.1** | `^4.1.8` | Utility-first styling |
| [@tailwindcss/vite](https://tailwindcss.com/docs/installation/using-vite) | **4.3.1** | `^4.1.8` | Integrasi Tailwind dengan Vite |
| [lucide-react](https://lucide.dev/) | **0.511.0** | `^0.511.0` | Icon set |

### State & HTTP

| Teknologi | Versi Terinstall | Range `package.json` | Peran |
|-----------|------------------|----------------------|-------|
| [Zustand](https://zustand.docs.pmnd.rs/) | **5.0.14** | `^5.0.5` | Global state management |
| [react-dropzone](https://react-dropzone.js.org/) | **14.4.1** | `^14.3.8` | Drag & drop file upload |
| [Axios](https://axios-http.com/) | **1.18.0** | `^1.9.0` | HTTP client ke backend |

### Dev Tools

| Teknologi | Versi Terinstall | Range `package.json` | Peran |
|-----------|------------------|----------------------|-------|
| [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) | **4.7.0** | `^4.5.1` | Fast Refresh & dukungan React di Vite |

---

## Prasyarat

- **Node.js** 18+ (disarankan 20 LTS)
- **npm** 9+

---

## Instalasi & Menjalankan

```bash
# Masuk ke direktori proyek
cd autoskor

# Install dependencies
npm install

# Salin environment variables
copy .env.example .env        # Windows
# cp .env.example .env      # Linux / macOS

# Jalankan development server
npm run dev
```

Buka browser di URL yang ditampilkan terminal (biasanya `http://localhost:5173`).

### Cara Menggunakan (Mock Mode)

1. Buka halaman utama
2. Drag & drop file PDF atau gambar ke area upload
3. Klik **Proses Sekarang**
4. Tunggu loading (~2.5 detik di mock mode)
5. Lihat tabel hasil skor dan ringkasan predikat

---

## Environment Variables

Buat atau edit file `.env` di root proyek:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK=true
```

| Variable | Default | Deskripsi |
|----------|---------|-----------|
| `VITE_API_BASE_URL` | `http://localhost:8000/api` | Base URL backend API |
| `VITE_USE_MOCK` | `true` | `true` = mock data, `false` = hit backend nyata |

> Semua env variable di Vite harus diawali `VITE_` agar bisa diakses di frontend.

---

## Struktur Proyek

Struktur flat sesuai `fs.txt` — semua komponen di satu folder `components/`, tanpa subfolder atau halaman terpisah.

```
autoskor/
├── public/
├── src/
│   ├── components/
│   │   ├── UploadArea.js       # upload + preview + tombol aksi
│   │   ├── ProcessingLoader.js
│   │   ├── ResultsTable.js     # tabel + ScoreRow inline
│   │   ├── ScoreSummary.js
│   │   └── StatusBadge.js
│   ├── store/
│   │   └── useKoperasiStore.js
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   └── colorGrading.js     # grading + formatters
│   ├── App.js                  # header + layout utama
│   ├── main.js
│   └── index.css
├── .env.example
├── fs.txt
├── index.html
├── jsconfig.json
├── package.json
└── vite.config.js
```

### Path Alias

Alias `@/` mengarah ke folder `src/`:

```js
import { UploadArea } from '@/components/UploadArea'
import { useKoperasiStore } from '@/store/useKoperasiStore'
```

---

## Pendekatan JavaScript Murni

Proyek ini **tidak memakai TypeScript maupun JSX**. Semua komponen UI dirender dengan `React.createElement`, di-import langsung sebagai `h`:

```js
import { createElement as h, Fragment } from 'react'

export default function App() {
  return h('div', { className: 'min-h-screen' }, 'Hello AutoSkor')
}
```

---

## Arsitektur & Alur Kerja

```
┌─────────────┐     upload file      ┌──────────────┐
│   Browser   │ ──────────────────►  │   Frontend   │
│   (User)    │                      │  React + JS  │
└─────────────┘                      └──────┬───────┘
       ▲                                    │
       │         JSON hasil penilaian       │ POST /penilaian/process
       └────────────────────────────────────┘
                                            │
                                     ┌──────▼───────┐
                                     │   Backend    │
                                     │ PDF/OCR +    │
                                     │ Perhitungan  │
                                     └──────────────┘
```

### Flow Upload

1. User membuka halaman utama → melihat area upload
2. User drag & drop atau pilih file (single file)
3. Info file ditampilkan (nama + ukuran) + tombol Hapus
4. User klik **Proses Sekarang**
5. UI menampilkan loading (non-blocking)
6. Frontend mengirim file ke backend secara async
7. Backend mengembalikan JSON hasil penilaian
8. Frontend merender tabel skor + ringkasan predikat

---

## State Management

State global dikelola dengan **Zustand** di `src/store/useKoperasiStore.js`.

| State | Tipe | Deskripsi |
|-------|------|-----------|
| `currentFile` | `File \| null` | File yang sedang dipilih |
| `isProcessing` | `boolean` | Status proses upload |
| `results` | `object \| null` | Hasil penilaian dari backend |
| `error` | `string \| null` | Pesan error |

| Action | Deskripsi |
|--------|-----------|
| `setFile(file)` | Set file yang dipilih |
| `clearFile()` | Hapus file terpilih |
| `processFile()` | Kirim file ke backend / mock |
| `resetResults()` | Reset hasil penilaian |

---

## Integrasi Backend

### Endpoint

```
POST {VITE_API_BASE_URL}/penilaian/process
Content-Type: multipart/form-data

Body:
  file: <File>
```

### Mengaktifkan Backend Nyata

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK=false
```

Restart dev server setelah mengubah `.env`.

### Timeout

Request timeout diset **120 detik** karena proses ekstraksi PDF/OCR bisa memakan waktu.

---

## Skema Data Hasil

Backend harus mengembalikan JSON dengan struktur berikut:

```js
{
  totalSkor: 72.45,
  persentase: 72.45,
  predikat: 'CUKUP SEHAT',  // SEHAT | CUKUP SEHAT | KURANG SEHAT | TIDAK SEHAT | SANGAT TIDAK SEHAT
  detail: [
    {
      aspek: 'Permodalan',
      komponen: 'Rasio Modal Sendiri terhadap Total Asset',
      nilaiRasio: 45.67,       // number atau string "Ya"/"Tidak"
      nilai: 50,
      bobot: 6,
      skor: 3.0,
      persentaseMaks: 50,
      status: 'Kuning'         // Hijau | Kuning | Merah
    }
  ]
}
```

---

## Color Grading

| Status | Kondisi |
|--------|---------|
| **Hijau** | ≥ 85% dari nilai maksimal komponen |
| **Kuning** | ≥ 50% dan < 85% |
| **Merah** | < 50% |

Logika ada di `src/utils/colorGrading.js`.

### 7 Aspek Penilaian (Permen KUKM No. 14/2009)

| No | Aspek | Bobot |
|----|-------|-------|
| 1 | Permodalan | 15 |
| 2 | Kualitas Aktiva Produktif | 25 |
| 3 | Manajemen | 15 |
| 4 | Efisiensi | 10 |
| 5 | Likuiditas | 15 |
| 6 | Kemandirian dan Pertumbuhan | 10 |
| 7 | Jatidiri Koperasi | 10 |

**Total bobot: 100**

---

## Scripts NPM

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Development server (hot reload) |
| `npm run build` | Build production ke folder `dist/` |
| `npm run preview` | Preview build production secara lokal |

---

## Build & Deploy

```bash
npm run build
npm run preview
```

Output build ada di folder `dist/`. Deploy ke hosting statis (Vercel, Netlify, Nginx, dll.).

### Environment Production

```
VITE_API_BASE_URL=https://api.example.com/api
VITE_USE_MOCK=false
```

---

## Roadmap

- [x] Setup project React + Vite + Tailwind (JavaScript murni)
- [x] Struktur flat sesuai `fs.txt`
- [x] Upload area dengan react-dropzone
- [x] Mock data & tabel hasil
- [x] Color grading & ringkasan skor
- [ ] Integrasi backend production
- [ ] Riwayat upload
- [ ] Daftar koperasi
- [ ] Filter & search
- [ ] Export PDF / Excel
- [ ] Preview PDF
- [ ] Autentikasi user

---

## Perbedaan dengan `koperasijs`

| Aspek | AutoSkor | koperasijs |
|-------|----------|------------|
| Struktur folder | Flat (`fs.txt`) | Nested per komponen |
| Navigasi | Single-page, header saja | Sidebar + React Router |
| Helper render | `createElement as h` langsung | Helper `src/utils/h.js` |
| Halaman | Satu halaman | Dashboard + Riwayat |

---

## Lisensi

Proyek private — `private: true` di `package.json`.