# 09 — Konstanta Penilaian & Label

Panduan mengubah aspek skor, indikator penilaian, label status, dan teks terkait Permen KUKM.

---

## Konteks Bisnis

AutoSkor menampilkan penilaian kesehatan **KSP/USP** berdasarkan **Permen KUKM No. 14/Per/M.KUKM/XII/2009**.

- **85 bobot** — aspek dapat dihitung otomatis (ditampilkan di tabel skor)
- **15 bobot** — aspek Manajemen → "Tidak Dapat Dihitung" (selalu skor 0 di UI)

Detail bisnis: [TIDAK_DAPAT_DIHITUNG.md](../../TIDAK_DAPAT_DIHITUNG.md)

Frontend **tidak menghitung skor** — hanya menampilkan hasil dari engine via middleware.

---

## Peta File Konstanta

| File | Isi |
|------|-----|
| `shared/constants/aspek.js` | Nama & kode aspek penilaian |
| `shared/constants/scoringIndicators.js` | Indikator per aspek |
| `shared/constants/scoringDetailIndicators.js` | Baris detail tabel skor |
| `shared/constants/extractedIndicators.js` | Indikator hasil ekstraksi OCR |
| `shared/constants/upload.js` | Batas upload (20 MB, dll.) |
| `shared/constants/fileTypes.js` | PDF, DOCX — MIME & ekstensi |
| `shared/constants/pagination.js` | Default page size tabel |
| `shared/utils/resultDetail.js` | Normalisasi bobot, skor, persentase |
| `shared/utils/colorGrading.js` | Predikat & warna (SEHAT, dll.) |
| `shared/utils/documentStatusLabels.js` | Label status dokumen (ID) |
| `shared/utils/engineStatusLabels.js` | Label status engine/worker (ID) |

---

## Label Status Dokumen

File: `src/shared/utils/documentStatusLabels.js`

```js
// Kode internal UI → label Bahasa Indonesia
export const UI_DOCUMENT_STATUS_LABELS = {
  queued: 'Antrian',
  processing: 'Diproses',
  done: 'Selesai',
  failed: 'Gagal',
  canceled: 'Dibatalkan',
}
```

Juga berisi class Tailwind per status untuk badge.

### Alur label status

```
Middleware API status (waiting, running, ...)
    → middlewareContract.js (JOB_STATUS_TO_UI)
    → kode UI (queued, processing, done, failed)
    → documentStatusLabels.js (label Indonesia)
    → DocumentStatusBadge.js (render)
```

**Ubah teks badge** → edit `documentStatusLabels.js` saja.
**Ubah logika status** → edit `middlewareContract.js` + mapper.

---

## Label Status Engine

File: `src/shared/utils/engineStatusLabels.js`

Dipakai dashboard engine untuk status cluster & worker.

Facade di fitur engine (agar komponen tidak import shared langsung):
- `features/engine/utils/clusterStatus.js`
- `features/engine/utils/workerStatus.js`

### Mengubah label engine

1. Edit `engineStatusLabels.js`
2. Jika komponen engine import via facade, tidak perlu ubah facade kecuali menambah fungsi baru

---

## Label Halaman & Menu

| Teks | File |
|------|------|
| "Antrian", "Selesai" | `middlewareContract.js` → `UI_PAGE_FILTERS` |
| "Unggah", "Engine", dll. | `Sidebar.js` → `menuItems` |

---

## Aspek & Indikator Penilaian

### `aspek.js`

Berisi definisi aspek (Permodalan, Pinjaman, dll.) dengan kode dan bobot.

### `scoringDetailIndicators.js`

Mapping kunci indikator → label tampilan di tabel `ResultsTable`.

Fungsi `resolveDetailIndikatorKey` mencocokkan key dari engine ke indikator yang dikenal.

### Jika engine mengirim indikator baru

1. Tambah entry di `scoringDetailIndicators.js`
2. Cek `scoringJobsMapper.js` — bagian mapping `detail[]`
3. Tambah test jika logic matching kompleks
4. Verifikasi di halaman `/processed/:id`

### `extractedIndicators.js` + `extractedIndicators.js` (utils)

Menampilkan indikator yang berhasil diekstrak OCR di modal detail dokumen.

---

## Normalisasi Hasil Skor

File: `src/shared/utils/resultDetail.js`

Fungsi penting:

| Fungsi | Fungsi |
|--------|--------|
| `normalizeBobot` | Pastikan bobot valid (0–100) |
| `sumDetailSkor` | Jumlah skor dari baris detail |
| `computePersentaseMaks` | Hitung persentase dari bobot dapat dihitung |
| `finalizeDetailRows` | Rapikan baris untuk tampilan & PDF |

### `colorGrading.js`

```js
getPredikatFromPersentase(persentase)  // → 'SEHAT', 'CUKUP SEHAT', ...
getStatusFromPersentase(persentase)    // → class warna
```

### Mengubah batas predikat

Edit threshold di `colorGrading.js` — berdampak ke:
- `ScoreSummary` di halaman detail
- `generateResultPdf.js`
- Mapper (jika predikat dihitung ulang di frontend)

---

## Komponen Tampilan Hasil

Lokasi: `features/documents/components/results/`

| Komponen | Data yang ditampilkan |
|----------|----------------------|
| `ScoreSummary` | `totalSkorParsial`, `persentaseParsial`, `predikat` |
| `ResultsTable` | `result.detail[]` — baris per komponen |
| `TidakDapatDihitungPanel` | `result.tidakDapatDihitung` — aspek Manajemen |

### Mengubah kolom tabel skor

Edit `ResultsTable.js` — pastikan field ada di objek `detail` hasil mapping.

### Mengubah teks panel Manajemen

Edit `TidakDapatDihitungPanel.js` dan/atau [TIDAK_DAPAT_DIHITUNG.md](../../TIDAK_DAPAT_DIHITUNG.md).

---

## PDF Hasil Penilaian

`generateResultPdf.js` mengimpor konstanta dan utilitas yang sama dengan halaman web.

Jika mengubah:
- Header referensi Permen → edit string di `generateResultPdf.js`
- Tabel skor → samakan dengan `ResultsTable` logic
- Predikat → pakai `getPredikatFromPersentase`

---

## Konstanta Upload

| File | Nilai |
|------|-------|
| `shared/constants/upload.js` | Batas global |
| `features/upload/constants.js` | Pesan error spesifik upload |

### Mengubah batas 20 MB

1. `shared/constants/upload.js` — nilai byte
2. `features/upload/constants.js` — pesan user
3. Koordinasi dengan backend (validasi server)
4. Update `API_CONTRACT.md`

---

## File Types

`shared/constants/fileTypes.js`:

```js
// Ekstensi & MIME yang diterima: PDF, DOCX
```

Dropzone (`UploadDropzone.js`) memvalidasi against konstanta ini.

---

## Pagination

`shared/constants/pagination.js`:

```js
export const DEFAULT_TABLE_PAGE_SIZE = 20  // contoh — cek nilai aktual di file
```

Digunakan `DocumentTable` + `useDocumentStore` pagination.

---

## Checklist Ubah Konstanta/Label

- [ ] Label status → `*StatusLabels.js`, bukan di komponen
- [ ] Status logic → `middlewareContract.js`
- [ ] Indikator baru → `scoringDetailIndicators.js` + mapper
- [ ] Predikat → `colorGrading.js` + verifikasi PDF
- [ ] Teks UI Bahasa Indonesia konsisten
- [ ] `npm test` jika ubah `resultDetail.js` atau mapper
- [ ] Cek halaman detail + PDF preview setelah ubah skor

---

## Langkah Berikutnya

- Auth & role → [10-autentikasi-dan-hak-akses.md](./10-autentikasi-dan-hak-akses.md)
- Panduan per fitur → [11-panduan-per-fitur.md](./11-panduan-per-fitur.md)