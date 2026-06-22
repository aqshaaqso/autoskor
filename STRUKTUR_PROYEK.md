# Struktur Proyek — AutoSkor

```
autoskor/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.js           # Navigasi sidebar + toggle collapse
│   │   │   ├── SidebarMenuItem.js   # Satu item menu dengan NavLink
│   │   │   └── MainLayout.js        # Layout: sidebar + outlet + watcher + toast
│   │   ├── UploadArea.js            # Drag & drop multi-file upload
│   │   ├── UploadProgress.js        # Progress bar upload
│   │   ├── DocumentTable.js         # Tabel list dokumen (reusable)
│   │   ├── DocumentStatusBadge.js   # Badge status dokumen
│   │   ├── DocumentWatcher.js       # Polling status (background, 3 detik)
│   │   ├── Toast.js                 # Popup notifikasi global
│   │   ├── ResultsTable.js          # Tabel skor per komponen
│   │   ├── ScoreSummary.js          # Ringkasan skor parsial
│   │   ├── StatusBadge.js           # Badge warna skor (Hijau/Kuning/Merah)
│   │   └── NonProcessAble.js        # Panel aspek Manajemen tidak dihitung
│   ├── pages/
│   │   ├── UploadPage.js            # Halaman /upload
│   │   ├── QueuePage.js             # Halaman /queue (polling 5 detik)
│   │   ├── ProcessedPage.js         # Halaman /processed
│   │   └── ProcessedDetailPage.js   # Halaman /processed/:id
│   ├── store/
│   │   └── useKoperasiStore.js      # State global (Zustand)
│   ├── services/
│   │   └── api.js                   # HTTP client + mock backend
│   ├── utils/
│   │   └── colorGrading.js          # Helper format & warna status
│   ├── App.js                       # Definisi routing
│   ├── main.js                      # Entry point React
│   └── index.css                    # Global CSS + tema Tailwind
├── dist/                            # Build production (npm run build)
├── API_CONTRACT.md                  # Kontrak API untuk tim backend
├── ARSITEKTUR.md                    # Diagram arsitektur sistem
├── TECH_STACK.md                    # Penjelasan teknologi
├── TIDAK_DAPAT_DIHITUNG.md          # Aspek Manajemen tidak dihitung
├── STRUKTUR_PROYEK.md               # File ini
├── README.md                        # Dokumentasi utama
├── .env.example                     # Template environment variables
├── index.html                       # HTML entry point
├── package.json
└── vite.config.js
```

## Path Alias

Import menggunakan alias `@/` yang mengarah ke `src/`:

```js
import { UploadArea } from '@/components/UploadArea'
import { useKoperasiStore } from '@/store/useKoperasiStore'
```

Dikonfigurasi di `vite.config.js`.

## Dokumen Terkait

- [README.md](./README.md) — Instalasi & panduan penggunaan
- [ARSITEKTUR.md](./ARSITEKTUR.md) — Alur kerja per komponen