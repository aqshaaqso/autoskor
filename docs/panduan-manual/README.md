# Panduan Manual — Mengedit Frontend AutoSkor

Dokumentasi ini ditujukan untuk developer yang ingin **mengubah, menambah, atau mengotak-atik frontend secara manual** tanpa harus membaca seluruh codebase terlebih dahulu.

Proyek ini adalah SPA React (JavaScript murni, **tanpa TypeScript**, **tanpa JSX**) yang terintegrasi dengan Middleware API untuk penilaian kesehatan koperasi.

---

## Daftar Isi

| No. | Dokumen | Kapan dibaca |
|-----|---------|--------------|
| 01 | [Memulai & Lingkungan](./01-memulai-dan-lingkungan.md) | Setup laptop, menjalankan dev server, `.env` |
| 02 | [Peta Struktur Folder](./02-peta-struktur-folder.md) | Cari file yang tepat sebelum mengedit |
| 03 | [Konvensi Kode](./03-konvensi-kode.md) | Gaya penulisan, import, `createElement`, naming |
| 04 | [Mengubah Halaman & Routing](./04-mengubah-halaman-dan-routing.md) | Tambah/ubah route, sidebar, lazy loading |
| 05 | [Menambah atau Mengubah Fitur](./05-menambah-atau-mengubah-fitur.md) | Struktur `features/`, barrel export, dependensi |
| 06 | [Mengubah API & Backend](./06-mengubah-api-dan-backend.md) | Axios, mapper, middleware contract, mock |
| 07 | [State Management (Zustand)](./07-state-management-zustand.md) | Store per fitur, pola fetch/error/loading |
| 08 | [Komponen UI & Styling](./08-komponen-ui-dan-styling.md) | Tailwind, shared UI, icon, toast |
| 09 | [Konstanta Penilaian & Label](./09-konstanta-penilaian-dan-label.md) | Aspek skor, indikator, label status ID |
| 10 | [Autentikasi & Hak Akses](./10-autentikasi-dan-hak-akses.md) | Login, role admin, ProtectedRoute |
| 11 | [Panduan Per Fitur](./11-panduan-per-fitur.md) | Upload, antrian, hasil, engine, admin, preview |
| 12 | [Checklist Sebelum Commit](./12-checklist-sebelum-commit.md) | Verifikasi perubahan sebelum push |
| 13 | [Troubleshooting](./13-troubleshooting.md) | Masalah umum & solusi |

---

## Alur Kerja Disarankan

```
1. Tentukan apa yang ingin diubah (halaman? API? label? fitur baru?)
        ↓
2. Baca dokumen yang relevan dari tabel di atas
        ↓
3. Cari file target lewat 02-peta-struktur-folder.md
        ↓
4. Edit mengikuti konvensi di 03-konvensi-kode.md
        ↓
5. Jalankan npm run dev → uji manual di browser
        ↓
6. Jalankan npm test (jika menyentuh mapper/utils)
        ↓
7. Jalankan npm run build → pastikan build sukses
        ↓
8. Centang 12-checklist-sebelum-commit.md
```

---

## Aturan Emas (Jangan Dilanggar)

1. **Komponen React tidak memanggil Axios langsung** — selalu lewat Store → Feature API → `scoringJobsApi` / `authApi`.
2. **Jangan hardcode label status** — pakai `documentStatusLabels.js` atau `engineStatusLabels.js`.
3. **Jangan duplikasi mapping status** — semua mapping API ↔ UI ada di `middlewareContract.js`.
4. **Import antar fitur** lewat barrel `@/features/namaFitur`, bukan path dalam ke folder lain.
5. **Dokumen & engine selalu middleware nyata** — mock hanya untuk auth dan admin.
6. **Restart dev server** setelah mengubah `.env`.
7. **Path API di kode** = path Swagger **tanpa** prefix `/api` (base URL sudah berisi `/api`).

---

## Dokumen Referensi di Root Proyek

Dokumen di folder ini melengkapi (bukan menggantikan) file berikut di root:

| File | Isi |
|------|-----|
| [README.md](../../README.md) | Ringkasan proyek & instalasi |
| [PANDUAN_SETUP.md](../../PANDUAN_SETUP.md) | Setup laptop baru & troubleshooting jaringan |
| [STRUKTUR_PROYEK.md](../../STRUKTUR_PROYEK.md) | Struktur folder ringkas |
| [ARSITEKTUR.md](../../ARSITEKTUR.md) | Diagram alur sistem |
| [API_CONTRACT.md](../../API_CONTRACT.md) | Kontrak endpoint middleware |
| [TECH_STACK.md](../../TECH_STACK.md) | Penjelasan teknologi |
| [TIDAK_DAPAT_DIHITUNG.md](../../TIDAK_DAPAT_DIHITUNG.md) | Aspek Manajemen (bobot 15) |

---

## Peta Cepat: "Saya Mau Ubah X, File Mana?"

| Ingin mengubah… | File utama |
|-----------------|------------|
| Menu sidebar / label navigasi | `src/shared/layout/Sidebar.js`, `middlewareContract.js` (`UI_PAGE_FILTERS`) |
| Route / URL halaman | `src/app/App.js`, `src/app/lazyPages.js` |
| Teks halaman upload | `src/features/upload/pages/UploadPage.js`, komponen di `upload/components/` |
| Tabel antrian / selesai | `src/features/documents/components/DocumentTable.js` |
| Detail hasil skor | `src/features/documents/pages/ProcessedDetailPage.js`, `components/results/` |
| PDF hasil penilaian | `src/features/documents/utils/generateResultPdf.js` |
| Preview file | `src/features/preview/pages/FilePreviewPage.js` |
| Login / logout | `src/features/auth/pages/LoginPage.js`, `useAuthStore.js`, `authApi.js` |
| Dashboard engine | `src/features/engine/pages/EngineDashboardPage.js` |
| Aktivitas pengguna (admin) | `src/features/admin/pages/UserActivityPage.js` |
| Warna / tema global | `src/index.css` (`@theme`) |
| Base URL API | `.env` → `VITE_API_BASE_URL` |
| Mapping status backend | `src/shared/api/middlewareContract.js` |
| Response API → format UI | `src/shared/api/scoringJobs/scoringJobsMapper.js` |
| Label badge status dokumen | `src/shared/utils/documentStatusLabels.js` |
| Konstanta aspek penilaian | `src/shared/constants/aspek.js`, `scoringIndicators.js` |
| Polling & notifikasi selesai | `src/features/documents/components/DocumentWatcher.js` |
| Toast global | `src/shared/store/useUiStore.js`, `src/shared/ui/Toast.js` |

Detail lengkap ada di setiap dokumen panduan.