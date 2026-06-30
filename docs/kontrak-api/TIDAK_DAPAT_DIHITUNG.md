# Aspek Tidak Dapat Dihitung — Manajemen

Dokumen RAT dan laporan keuangan koperasi biasanya hanya berisi angka keuangan. Aspek **Manajemen** memerlukan data non-keuangan (kebijakan, prosedur, praktik operasional) yang **tidak tersedia** dalam dokumen tersebut.

Frontend menampilkan aspek ini terpisah — tidak masuk perhitungan skor parsial.

---

## Bobot & Komponen

| Komponen Manajemen | Jumlah Pertanyaan |
|--------------------|-------------------|
| Manajemen Umum | 12 |
| Kelembagaan | 6 |
| Manajemen Permodalan | 5 |
| Manajemen Aktiva | 10 |
| Manajemen Likuiditas | 5 |

**Total bobot aspek Manajemen: 15** (dari 100 bobot keseluruhan penilaian).

---

## Perilaku di UI

Halaman detail hasil (`/processed/:id`) memisahkan data menjadi dua bagian:

| Bagian | Field JSON | Isi |
|--------|------------|-----|
| Dapat dihitung | `detail[]` | Permodalan, KAP, Efisiensi, Likuiditas, dll. (**85 bobot**) |
| Tidak dapat dihitung | `tidakDapatDihitung` | Aspek Manajemen, skor = 0, flag & catatan |

Ringkasan skor:

- `totalSkorParsial` — skor hanya dari aspek yang dapat dihitung
- `persentaseParsial` — persentase dari **85 bobot**, bukan 100
- `bobotDapatDihitung` — biasanya `85`
- `predikat` — ditentukan engine dari persentase parsial

```
┌─────────────────────────────────────────────────────────────────┐
│  Ringkasan: Skor Parsial 64.35/85  ·  Persentase Parsial 75.7% │
├──────────────────────────────────────┬──────────────────────────┤
│  Tabel Hasil (dapat dihitung)        │  Panel Tidak Dapat       │
│  Permodalan, KAP, Efisiensi, ...     │  Dihitung (Manajemen)    │
│                                      │  skor = 0, bobot = 15    │
└──────────────────────────────────────┴──────────────────────────┘
```

---

## 7 Aspek Penilaian (Permen KUKM No. 14/2009)

| No | Aspek | Bobot | Dapat dihitung dari dokumen? |
|----|-------|-------|------------------------------|
| 1 | Permodalan | 15 | Ya |
| 2 | Kualitas Aktiva Produktif | 25 | Ya |
| 3 | Manajemen | 15 | **Tidak** |
| 4 | Efisiensi | 10 | Ya |
| 5 | Likuiditas | 15 | Ya |
| 6 | Kemandirian dan Pertumbuhan | 10 | Ya |
| 7 | Jatidiri Koperasi | 10 | Ya |

---

## Yang Diharapkan dari Engine / Middleware

Saat job selesai (`completed_success`), field `result.result_data` harus berisi:

```json
{
  "totalSkorParsial": 64.35,
  "persentaseParsial": 75.7,
  "bobotDapatDihitung": 85,
  "predikat": "CUKUP SEHAT",
  "tidakDapatDihitung": {
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
  },
  "detail": [
    {
      "aspek": "Permodalan",
      "komponen": "Rasio Modal Sendiri terhadap Total Asset",
      "nilaiRasio": 45.67,
      "nilai": 50,
      "bobot": 6,
      "skor": 3.0,
      "persentaseMaks": 50,
      "status": "Kuning"
    }
  ]
}
```

Frontend menerima format camelCase atau snake_case — mapper di `scoringJobsMapper.js` menormalisasi keduanya.

---

## Dokumen Terkait

- [API_CONTRACT.md](./API_CONTRACT.md) — Kontrak middleware & skema hasil
- [ARSITEKTUR.md](./ARSITEKTUR.md) — Alur tampilan hasil skor
- [README.md](./README.md) — Ringkasan proyek