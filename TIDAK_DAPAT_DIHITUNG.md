# Aspek Manajemen — Tidak Dapat Dihitung

Dokumen RAT koperasi biasanya hanya berisi **angka keuangan**. Aspek **Manajemen** memerlukan data non-keuangan (kebijakan, prosedur, praktik) yang tidak tersedia dalam dokumen tersebut.

Frontend menampilkan aspek ini di panel terpisah dengan skor **0** dan flag khusus.

---

## Komponen Manajemen

| Komponen | Jumlah Pertanyaan |
|----------|-------------------|
| Manajemen Umum | 12 |
| Kelembagaan | 6 |
| Manajemen Permodalan | 5 |
| Manajemen Aktiva | 10 |
| Manajemen Likuiditas | 5 |

**Total bobot aspek Manajemen: 15**

---

## Alasan Tidak Dapat Dihitung

- Tidak ada informasi tentang kebijakan, prosedur, atau praktik manajemen dalam dokumen RAT
- Laporan keuangan biasanya hanya berisi angka, bukan jawaban pertanyaan manajemen

---

## Rekomendasi untuk Engine Backend

| Field | Nilai |
|-------|-------|
| `skor` | `0` untuk seluruh aspek Manajemen |
| `flag` | `"Tidak Dapat Dihitung - Data Manajemen Tidak Tersedia"` |
| `catatan` | `"Penilaian aspek manajemen memerlukan data non-keuangan yang tidak ditemukan dalam dokumen."` |

### Contoh objek `tidakDapatDihitung` di response API

```json
{
  "aspek": "Manajemen",
  "bobot": 15,
  "skor": 0,
  "flag": "Tidak Dapat Dihitung - Data Manajemen Tidak Tersedia",
  "catatan": "Penilaian aspek manajemen memerlukan data non-keuangan yang tidak ditemukan dalam dokumen.",
  "komponen": [
    { "nama": "Manajemen Umum", "jumlahPertanyaan": 12 },
    { "nama": "Kelembagaan", "jumlahPertanyaan": 6 },
    { "nama": "Manajemen Permodalan", "jumlahPertanyaan": 5 },
    { "nama": "Manajemen Aktiva", "jumlahPertanyaan": 10 },
    { "nama": "Manajemen Likuiditas", "jumlahPertanyaan": 5 }
  ]
}
```

---

## Tampilan di Frontend

Halaman detail hasil (`/processed/:id`) memisahkan:

```
┌─────────────────────────────────────────────────────────────────┐
│  Ringkasan: Skor Parsial 64.35/85  ·  Persentase Parsial 75.7% │
├──────────────────────────────────────┬──────────────────────────┤
│  Tabel Hasil (dapat dihitung)        │  Panel Tidak Dapat       │
│  Permodalan, KAP, Efisiensi, ...     │  Dihitung (Manajemen)    │
└──────────────────────────────────────┴──────────────────────────┘
```

- **Skor parsial** dihitung dari **85 bobot** (tanpa Manajemen)
- **Persentase parsial** = persentase dari 85, bukan 100

---

## 7 Aspek Penilaian (Permen KUKM No. 14/2009)

| No | Aspek | Bobot | Dapat dihitung? |
|----|-------|-------|-----------------|
| 1 | Permodalan | 15 | Ya |
| 2 | Kualitas Aktiva Produktif | 25 | Ya |
| 3 | Manajemen | 15 | **Tidak** |
| 4 | Efisiensi | 10 | Ya |
| 5 | Likuiditas | 15 | Ya |
| 6 | Kemandirian dan Pertumbuhan | 10 | Ya |
| 7 | Jatidiri Koperasi | 10 | Ya |

---

## Dokumen Terkait

- [API_CONTRACT.md](./API_CONTRACT.md) — Skema response `tidakDapatDihitung`
- [README.md](./README.md) — Penjelasan skor parsial di UI