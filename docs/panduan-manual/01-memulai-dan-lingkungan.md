# 01 — Memulai & Lingkungan Kerja

Panduan setup dan menjalankan proyek sebelum mulai mengedit.

---

## Prasyarat

| Tool | Versi minimum | Catatan |
|------|---------------|---------|
| Node.js | 18+ (disarankan 20 LTS) | https://nodejs.org |
| npm | 9+ | Ikut bundel Node.js |
| Git | — | Untuk version control |
| PowerShell | — | Untuk script uji middleware (Windows) |

Proyek ini **bukan Python** — tidak ada `requirements.txt`. Semua dependensi ada di `package.json`.

---

## Instalasi Pertama Kali

```bash
cd autoskor
npm install
```

**Windows — cara cepat:**

```bash
setup.bat
```

Script `setup.bat` menjalankan `npm install` dan menyalin `.env.example` → `.env` jika belum ada.

---

## Environment Variables (`.env`)

Salin dari `.env.example`:

```bash
# Windows
copy .env.example .env

# Linux / macOS
cp .env.example .env
```

### Variabel yang perlu Anda pahami

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK_AUTH=true
VITE_USE_MOCK_ADMIN=true
VITE_SCORING_JOBS_LIST_LIMIT=100
```

| Variable | Fungsi | Kapan diubah |
|----------|--------|--------------|
| `VITE_API_BASE_URL` | Alamat middleware sampai `/api` | Saat pindah server / VPN / staging |
| `VITE_USE_MOCK_AUTH` | `true` = login pakai data palsu lokal | Set `false` saat `/auth/*` sudah tersedia di middleware |
| `VITE_USE_MOCK_ADMIN` | `true` = aktivitas admin pakai mock | Set `false` saat `/admin/*` sudah tersedia |
| `VITE_SCORING_JOBS_LIST_LIMIT` | Limit maksimal fetch scoring jobs | Jika antrian besar, naikkan (maks. 100 di API) |

**Penting:**
- URL **harus** berakhir di `/api` tanpa trailing slash tambahan.
- Di kode JS, path relatif saja: `api.get('/scoring-jobs')` — **bukan** `/api/scoring-jobs`.
- **Restart dev server** setiap kali mengubah `.env` — Vite tidak hot-reload env.

### Kredensial login mock

Saat `VITE_USE_MOCK_AUTH=true`:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@koperasi.id` | `admin123` |
| User | `user@koperasi.id` | `user123` |

Data mock ada di `src/shared/api/mock/authMock.js`.

---

## Menjalankan Development Server

```bash
npm run dev
```

Buka browser: `http://localhost:5173`

Dev server Vite menyediakan **hot module replacement (HMR)** — perubahan file JS/CSS langsung terlihat tanpa refresh penuh (kecuali perubahan `.env`).

---

## Scripts NPM

| Command | Kegunaan | Kapan dijalankan |
|---------|----------|------------------|
| `npm run dev` | Development + HMR | Saat coding |
| `npm run build` | Build production ke `dist/` | Sebelum deploy / cek error build |
| `npm run preview` | Preview build production lokal | Setelah `npm run build` |
| `npm test` | Unit test (Vitest) | Setelah ubah mapper/utils |
| `npm run test:watch` | Test mode watch | Saat menulis test baru |

### Uji koneksi middleware (PowerShell)

```powershell
.\scripts\test-middleware.ps1
```

Butuh akses jaringan ke server middleware (LAN/VPN). Script mengecek health check dan list scoring jobs.

---

## Path Alias `@/`

Semua import dari `src/` memakai alias:

```js
import { UploadPage } from '@/features/upload'
import { api } from '@/shared/api/client'
```

Dikonfigurasi di:
- `vite.config.js` → `resolve.alias`
- `jsconfig.json` → untuk IntelliSense di VS Code/Cursor

**Jangan** pakai path relatif panjang lintas fitur — selalu `@/features/...` atau `@/shared/...`.

---

## Editor yang Disarankan

**VS Code / Cursor** dengan ekstensi:
- ESLint (jika ditambahkan nanti)
- Tailwind CSS IntelliSense — autocomplete class Tailwind

Buka folder root `autoskor/` sebagai workspace agar alias `@/` dikenali.

---

## Workflow Edit Manual

### Siklus harian

```
1. git pull                    → ambil perubahan terbaru
2. npm install                 → jika package.json berubah
3. npm run dev                 → jalankan dev server
4. Edit file di src/
5. Cek di browser
6. npm test                    → jika ubah logic
7. npm run build               → sebelum commit besar
```

### Setelah mengubah dependensi

```bash
npm install nama-paket
```

Hanya tambah paket jika benar-benar diperlukan. Stack saat ini sudah lengkap (lihat `TECH_STACK.md`).

### Setelah mengubah routing atau env

1. Restart `npm run dev`
2. Hard refresh browser (Ctrl+Shift+R)
3. Cek console browser (F12) untuk error

---

## Build Production

```bash
npm run build
```

Output di folder `dist/`:
- `index.html`
- `assets/*.js` — chunk per halaman (lazy loaded)
- `assets/*.css`

Deploy `dist/` ke web server statis (Nginx, IIS, S3, dll.). Pastikan server mengarahkan semua route ke `index.html` (SPA fallback) agar React Router berfungsi.

---

## File yang Jangan Diedit Sembarangan

| File / folder | Alasan |
|---------------|--------|
| `node_modules/` | Generated oleh npm — jangan edit manual |
| `dist/` | Output build — akan ditimpa |
| `package-lock.json` | Hanya berubah lewat `npm install` |
| `.git/` | Metadata git |

---

## Langkah Berikutnya

- Pahami di mana file berada → [02-peta-struktur-folder.md](./02-peta-struktur-folder.md)
- Pelajari gaya kode proyek → [03-konvensi-kode.md](./03-konvensi-kode.md)
