# Panduan Setup — AutoSkor

Panduan ini untuk menjalankan proyek di laptop baru. Proyek ini **bukan Python** — tidak ada `requirements.txt`. Dependensi ada di `package.json` + `package-lock.json` (ekosistem **Node.js / npm**).

---

## Yang Harus Diinstall Dulu

| Software | Versi minimum | Download |
|----------|---------------|----------|
| **Node.js** | 18+ (disarankan **20 LTS**) | https://nodejs.org |
| **npm** | 9+ (otomatis ikut Node.js) | — |
| **Git** | apa saja | https://git-scm.com |

Cek sudah terinstall:

```bash
node -v    # contoh: v20.x.x
npm -v     # contoh: 10.x.x
git -v
```

Kalau `node` tidak dikenali → install Node.js dulu, **restart terminal**, lalu coba lagi.

---

## Langkah Menjalankan (Pertama Kali)

### 1. Clone repo

```bash
git clone https://github.com/aqshaaqso/autoskor.git
cd autoskor
```

### 2. Install dependensi

```bash
npm install
```

> Wajib dijalankan sekali. Folder `node_modules/` tidak ikut di Git — harus di-generate di laptop masing-masing.

### 3. Buat file `.env`

```bash
# Windows (CMD / PowerShell)
copy .env.example .env

# Linux / macOS
cp .env.example .env
```

**Tanpa file `.env`, app bisa error atau tidak jalan normal.**

Default `.env.example` sudah diset **mode middleware nyata**. Kalau laptop belum bisa akses server, ubah ke **mode mock** (lihat [Dua Mode Konfigurasi](#dua-mode-konfigurasi)).

### 4. Jalankan dev server

```bash
npm run dev
```

Buka browser: **http://localhost:5173**

### 5. Login

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@koperasi.id` | `admin123` |
| User | `operator@koperasi.id` | `user123` |

---

## Shortcut Setup (Windows)

Double-click atau jalankan di terminal:

```bash
setup.bat
```

Script ini otomatis: cek Node.js → `npm install` → salin `.env` jika belum ada.

---

## Dua Mode Konfigurasi

### Mode A — Middleware nyata (default tim)

Dipakai jika laptop bisa akses server middleware (VPN / LAN kantor). Ini konfigurasi aktif di `.env.example`.

```env
VITE_API_BASE_URL=http://172.16.210.244:8000/api
VITE_USE_MOCK=false
VITE_USE_MOCK_AUTH=true
VITE_USE_MOCK_ADMIN=true
VITE_USE_MOCK_ENGINE=false
```

> Kalau `VITE_USE_MOCK=false` tapi laptop **tidak bisa ping** ke `172.16.210.244` → upload & antrian akan gagal / loading terus. Ubah ke Mode B.

### Mode B — Lokal / mock (laptop baru tanpa middleware)

Tidak butuh koneksi ke server. Semua data simulasi (termasuk 3 dokumen dummy di halaman Hasil).

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK=true
VITE_USE_MOCK_AUTH=true
VITE_USE_MOCK_ADMIN=true
VITE_USE_MOCK_ENGINE=true
```

Setelah ubah `.env`, **wajib restart** dev server (`Ctrl+C` lalu `npm run dev` lagi).

---

## Troubleshooting

### `node` / `npm` tidak dikenali

- Install Node.js dari https://nodejs.org (pilih **LTS**)
- Centang "Add to PATH" saat install
- Tutup & buka ulang terminal / VS Code

### `npm install` gagal

```bash
# Hapus cache & install ulang
rmdir /s /q node_modules        # Windows
rm -rf node_modules             # Linux/macOS
del package-lock.json           # opsional, kalau masih gagal
npm install
```

### `npm run dev` — port sudah dipakai

Vite akan otomatis pakai port lain (5174, 5175, …). Lihat URL di terminal.

Atau matikan proses yang pakai port 5173.

### Halaman putih / error di browser

1. Pastikan file `.env` sudah ada
2. Pastikan `VITE_USE_MOCK=true` kalau tidak connect ke middleware
3. Buka DevTools (F12) → tab **Console** & **Network** untuk lihat error
4. Restart: `Ctrl+C` → `npm run dev`

### Upload / antrian error "Network Error"

Penyebab umum: `.env` pakai `VITE_USE_MOCK=false` tapi server `172.16.210.244` tidak bisa diakses dari laptop.

**Solusi:** ubah ke mode mock (lihat Mode B di atas).

### Login gagal

Pastikan `VITE_USE_MOCK_AUTH=true` dan pakai kredensial di tabel login di atas.

### Perubahan `.env` tidak berpengaruh

Vite hanya baca `.env` saat server **start**. Harus restart `npm run dev`.

### Pratinjau / Unduh PDF gagal

1. Pastikan dokumen berstatus **Selesai** (bukan Gagal)
2. Buka halaman detail (`/processed/:id`) — tombol ada di kanan atas
3. Cek Console (F12) jika muncul error toast
4. Fitur PDF bersifat client-side — tidak butuh endpoint middleware tambahan

---

## Dependensi Proyek (setara "requirements")

Semua paket terdaftar di `package.json`. Versi terkunci di `package-lock.json`.

| Paket | Fungsi |
|-------|--------|
| react, react-dom | UI |
| react-router-dom | Routing halaman |
| vite | Dev server & build |
| tailwindcss | Styling |
| zustand | State management |
| axios | HTTP client |
| react-dropzone | Upload drag & drop |
| lucide-react | Icon |
| docx-preview | Preview dokumen Word |
| jspdf | Generate laporan hasil PDF |
| jspdf-autotable | Tabel skor di laporan PDF |

Tidak perlu install manual satu per satu — cukup `npm install`.

---

## Perintah Berguna

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Jalankan development server |
| `npm run build` | Build production → folder `dist/` |
| `npm run preview` | Preview hasil build |

---

## Dokumen Terkait

- [README.md](./README.md) — Ringkasan proyek
- [API_CONTRACT.md](./API_CONTRACT.md) — Konfigurasi middleware