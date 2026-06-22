# Arsitektur — AutoSkor

Penjelasan alur, komponen, dan tanggung jawab sistem.

---

## Gambaran Besar

AutoSkor adalah Single Page Application (SPA) frontend untuk upload dokumen RAT koperasi, memantau antrian proses, dan menampilkan hasil penilaian kesehatan koperasi (KSP/USP) berdasarkan **Permen KUKM No. 14/2009**.

Peran frontend: **upload dokumen, beri notifikasi sukses, pantau antrian & tampilkan hasil**.

### Pemisahan tanggung jawab

| Lapisan | Tugas |
|---------|-------|
| **Frontend** | Upload file, notifikasi, tampilkan list & hasil skor |
| **Backend** | Terima file, validasi, simpan, kelola antrian & status |
| **Engine** | OCR, ekstrak data, hitung skor, simpan hasil |

---

## Diagram Arsitektur Besar

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              USER (Browser)                             │
└─────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     FRONTEND — AutoSkor (React SPA)                     │
│  ┌──────────┐  ┌─────────────────────────────────────────────────────┐  │
│  │ Sidebar  │  │              Area Konten (Outlet)                   │  │
│  │          │  │  ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌─────────┐  │  │
│  │ Upload   │  │  │ Upload  │ │ Antrian │ │ Selesai  │ │ Detail  │  │  │
│  │ Antrian  │  │  │  Page   │ │  Page   │ │   Page   │ │  Skor   │  │  │
│  │ Selesai  │  │  └─────────┘ └─────────┘ └──────────┘ └─────────┘  │  │
│  └──────────┘  └─────────────────────────────────────────────────────┘  │
│                                                                         │
│  Zustand (state)  ·  Axios (HTTP)  ·  React Router (navigasi)           │
└─────────────────────────────────────────────────────────────────────────┘
            │ POST upload          │ GET list antrian    │ GET list selesai
            │ (multi-file)         │ GET status          │ GET hasil skor
            ▼                      ▼                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         BACKEND                                         │
│                                                                         │
│   Terima file → Validasi → Simpan → Masukkan ke QUEUE                   │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                         DOCUMENT QUEUE                          │   │
│   │   [doc-A.pdf]  [doc-B.pdf]  [doc-C.pdf]  ...                   │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                      │                                  │
│                                      ▼                                  │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                    ENGINE                                       │   │
│   │         OCR / Ekstrak data / Hitung skor / Simpan hasil         │   │
│   └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Layout Frontend (Sidebar + React Router)

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER — AutoSkor                                               │
├────────────┬─────────────────────────────────────────────────────┤
│  SIDEBAR   │  <Outlet /> — halaman aktif                         │
│            │                                                     │
│  [Upload]  │   URL: /upload                                      │
│  [Antrian] │   URL: /queue                                       │
│  [Selesai] │   URL: /processed                                   │
│            │   URL: /processed/:id  (detail hasil skor)          │
│            │                                                     │
└────────────┴─────────────────────────────────────────────────────┘
```

React Router mengatur URL → komponen mana yang dirender di `Outlet`. Sidebar tetap tampil; konten kanan berganti sesuai halaman aktif.

### Struktur routing

```
main.js
  └── BrowserRouter
        └── App
              └── Routes
                    └── Route path="/" element={MainLayout}
                          ├── Sidebar (NavLink ke /upload, /queue, /processed)
                          └── Outlet
                                ├── /upload        → UploadPage
                                ├── /queue         → QueuePage
                                ├── /processed     → ProcessedPage
                                └── /processed/:id → ProcessedDetailPage
```

---

## Siklus Hidup Dokumen (Document Lifecycle)

```
      ┌─────────────┐
      │ User pilih  │
      │  file(s)    │
      └──────┬──────┘
             │
             ▼
      ┌─────────────┐     gagal      ┌─────────────┐
      │ FE validasi │───────────────►│ Error toast │
      │ format+20MB │                │ (format/size)│
      └──────┬──────┘                └─────────────┘
             │ lolos
             ▼
      ┌─────────────┐
      │ FE upload   │◄── progress bar HANYA di sini
      │ ke backend  │
      └──────┬──────┘
             │ sukses
             ▼
      ┌─────────────┐
      │ Toast:      │
      │ "Berhasil   │
      │  diupload"  │
      └──────┬──────┘
             │
             ▼
      ┌─────────────────────────────────────────┐
      │         BACKEND — status: queued        │
      │         (masuk antrian)                 │
      └──────┬──────────────────────────────────┘
             │
             ▼
      ┌─────────────────────────────────────────┐
      │         ENGINE memproses                  │
      │         status: processing                │
      └──────┬──────────────────────────────────┘
             │
             ▼
      ┌─────────────────────────────────────────┐
      │         Selesai — status: done            │
      │         Hasil skor tersimpan              │
      └─────────────────────────────────────────┘
```

### Status dokumen

```
queued  ──►  processing  ──►  done
(antrian)    (engine jalan)   (bisa lihat skor)

                      └──► failed (opsional — gagal proses di engine)
```

---

## Alur Per Halaman

### Halaman 1 — Upload (`/upload`)

1. User drag & drop banyak file (multi-file)
2. FE cek: total size ≤ 20MB? format OK?
   - Tidak → tampilkan error
3. Klik Upload → Axios `POST /documents/upload`
   - `onUploadProgress` → bar % upload
4. Response 200 → toast "Dokumen berhasil diupload"
5. **SELESAI** — FE tidak tunggu engine

### Halaman 2 — Antrian (`/queue`)

1. User buka halaman Antrian
2. `GET /documents?status=queue`
3. Tampilkan tabel: nama file | tanggal upload | status
4. Auto-refresh tiap 5 detik + tombol refresh manual

### Halaman 3 — Selesai (`/processed`)

1. User buka halaman Selesai
2. `GET /documents?status=done`
3. Tampilkan list dokumen yang sudah jadi
4. User klik satu dokumen → navigasi ke `/processed/:id`
5. `GET /documents/:id/results`
6. Tampilkan:
   - `ScoreSummary` (skor parsial)
   - `ResultsTable` (aspek dapat dihitung)
   - `NonProcessAble` (aspek Manajemen)

---

## Diagram Sequence (Upload → Antrian → Hasil)

```
  User          Frontend (React)       Backend          Engine
    │                 │                   │                │
    │─ pilih file ───►│                   │                │
    │                 │─ validasi 20MB ──►│                │
    │                 │                   │                │
    │─ klik Upload ──►│                   │                │
    │                 │─ POST upload ────►│                │
    │                 │◄── progress % ────│  (upload saja) │
    │                 │◄── 200 OK ────────│                │
    │◄─ toast sukses ─│                   │                │
    │                 │                   │─ masuk queue ─►│
    │                 │                   │                  │─ proses
    │                 │                   │◄── hasil skor ───│
    │                 │                   │  status=done   │
    │                 │                   │                │
    │─ buka Antrian ─►│                   │                │
    │                 │─ GET queued ─────►│                │
    │                 │◄── list ──────────│                │
    │◄─ tabel antrian │                   │                │
    │                 │                   │                │
    │─ buka Selesai ─►│                   │                │
    │                 │─ GET done ────────►│                │
    │                 │◄── list ──────────│                │
    │─ klik dokumen ─►│                   │                │
    │                 │─ GET /:id/results►│                │
    │                 │◄── JSON skor ─────│                │
    │◄─ tampil skor ──│                   │                │
```

---

## Perbandingan: Arsitektur Lama vs Baru

| Aspek | Lama (MVP awal) | Baru (target) |
|-------|-----------------|---------------|
| Peran FE | Upload + proses + skor | Upload + monitor + tampil hasil |
| Loading di FE | Ekstrak, hitung, susun | Upload saja |
| Jumlah halaman | 1 halaman | 3 halaman + detail |
| Jumlah file | 1 file | Multi file |
| React Router | Tidak dipakai | Wajib (sidebar + routing) |

```
LAMA:  [Upload 1 file] → [FE tunggu proses mock] → [FE langsung tampil skor]

BARU:  [Upload multi-file] → [FE upload → toast] → [Backend → Queue → Engine]
                                                              │
                                                              ▼
                                                    [FE baca status & hasil]
```

---

## Data Flow

```
  ┌──────────────┐
  │   PDF files  │
  └──────┬───────┘
         │ multipart/form-data
         ▼
  ┌──────────────┐     metadata      ┌──────────────┐
  │   Backend    │──────────────────►│    Queue     │
  │   (storage)  │                   │  (pending)   │
  └──────────────┘                   └──────┬───────┘
                                            │
                                            ▼
                                     ┌──────────────┐
                                     │    Engine    │
                                     └──────┬───────┘
                                            │ JSON hasil skor
                                            ▼
  ┌──────────────┐     GET results     ┌──────────────┐
  │  Frontend    │◄──────────────────│   Database   │
  │  (tampilan)  │     GET list        │  (backend)   │
  └──────────────┘                     └──────────────┘
```

Frontend **mengirim** file ke atas, **membaca** list & hasil dari bawah. Frontend **tidak** ikut proses OCR/hitung skor di engine.

---

## Aturan Upload (Frontend)

| Aturan | Nilai |
|--------|-------|
| Jumlah file | Multi-file (tidak dibatasi 1 file) |
| Batas ukuran | Total semua file maksimal **20 MB** |
| Format | PDF (utama), JPG/PNG/WEBP (opsional) |
| Progress yang ditampilkan | Hanya progress upload ke backend |
| Setelah upload sukses | Toast "Dokumen berhasil diupload" |
| Proses engine | **TIDAK** ditampilkan di FE |

---

## Skor Parsial & Aspek Tidak Dapat Dihitung

Hasil penilaian di `/processed/:id` memisahkan:

- `detail[]` → aspek yang dapat dihitung dari dokumen (**85 bobot**)
- `tidakDapatDihitung` → aspek Manajemen (**15 bobot**), skor = 0
- `totalSkorParsial` → skor hanya dari aspek dapat dihitung
- `persentaseParsial` → persentase dari 85 bobot, bukan 100

Lihat [TIDAK_DAPAT_DIHITUNG.md](./TIDAK_DAPAT_DIHITUNG.md) untuk rincian komponen Manajemen.

---

## Endpoint API

| Endpoint | Method | Fungsi |
|----------|--------|--------|
| `/documents/upload` | POST | Upload 1+ file (multipart, ≤20MB) |
| `/documents?status=queue` | GET | List dokumen dalam antrian |
| `/documents?status=done` | GET | List dokumen selesai |
| `/documents/:id/results` | GET | Hasil skor dokumen selesai |

Detail lengkap: [API_CONTRACT.md](./API_CONTRACT.md)

---

## Tech Stack Terkait Arsitektur

| Tech | Peran |
|------|-------|
| React 19 | UI multi-halaman, komponen sidebar & list |
| React Router DOM | Navigasi `/upload`, `/queue`, `/processed`, `/processed/:id` |
| Zustand | State upload, list antrian, list selesai |
| Axios | Upload multi-file + `onUploadProgress` + GET list/hasil |
| react-dropzone | Multi-file drag & drop dengan validasi |
| Tailwind CSS | Layout sidebar, tabel, toast/notifikasi |
| Vite | Build & dev server |

Lihat [TECH_STACK.md](./TECH_STACK.md) untuk penjelasan lengkap setiap teknologi.

---

## Ringkasan Satu Gambar

```
           USER
             │
      ┌──────┴──────┐
      │  FRONTEND   │  ← scope pengembangan FE
      │  ┌────────┐ │
      │  │Sidebar │ │
      │  ├────────┤ │
      │  │ Upload │─┼──► POST file ──────────────┐
      │  │ Antrian│◄┼──── GET status queued ◄────┤
      │  │ Selesai│◄┼──── GET status done + skor ◄┤
      │  └────────┘ │                            │
      └─────────────┘                            │
                                                 ▼
                                          ┌─────────────┐
                                          │   BACKEND   │
                                          │  +  QUEUE   │
                                          │  +  ENGINE  │
                                          └─────────────┘
                                          ← di luar scope FE
```

---

## Dokumen Terkait

- [API_CONTRACT.md](./API_CONTRACT.md) — Kontrak API untuk tim backend
- [TECH_STACK.md](./TECH_STACK.md) — Penjelasan teknologi & alasan pemilihan
- [TIDAK_DAPAT_DIHITUNG.md](./TIDAK_DAPAT_DIHITUNG.md) — Aspek Manajemen
- [README.md](./README.md) — Dokumentasi proyek & panduan instalasi
- [STRUKTUR_PROYEK.md](./STRUKTUR_PROYEK.md) — Struktur folder proyek