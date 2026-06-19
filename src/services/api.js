import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api'
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120_000,
})

const mockTidakDapatDihitung = {
  aspek: 'Manajemen',
  bobot: 15,
  skor: 0,
  flag: 'Tidak Dapat Dihitung - Data Manajemen Tidak Tersedia',
  catatan:
    'Penilaian aspek manajemen memerlukan data non-keuangan yang tidak ditemukan dalam dokumen.',
  komponen: [
    { nama: 'Manajemen Umum', jumlahPertanyaan: 12 },
    { nama: 'Kelembagaan', jumlahPertanyaan: 6 },
    { nama: 'Manajemen Permodalan', jumlahPertanyaan: 5 },
    { nama: 'Manajemen Aktiva', jumlahPertanyaan: 10 },
    { nama: 'Manajemen Likuiditas', jumlahPertanyaan: 5 },
  ],
}

const mockHasilPenilaian = {
  totalSkorParsial: 64.35,
  persentaseParsial: 75.7,
  bobotDapatDihitung: 85,
  predikat: 'CUKUP SEHAT',
  tidakDapatDihitung: mockTidakDapatDihitung,
  detail: [
    {
      aspek: 'Permodalan',
      komponen: 'Rasio Modal Sendiri terhadap Total Asset',
      nilaiRasio: 45.67,
      nilai: 50,
      bobot: 6,
      skor: 3.0,
      persentaseMaks: 50,
      status: 'Kuning',
    },
    {
      aspek: 'Permodalan',
      komponen: 'Rasio Modal Sendiri terhadap Pinjaman Berisiko',
      nilaiRasio: 38.2,
      nilai: 40,
      bobot: 6,
      skor: 2.4,
      persentaseMaks: 40,
      status: 'Merah',
    },
    {
      aspek: 'Permodalan',
      komponen: 'Rasio Kecukupan Modal Sendiri',
      nilaiRasio: 12.5,
      nilai: 80,
      bobot: 3,
      skor: 2.4,
      persentaseMaks: 80,
      status: 'Kuning',
    },
    {
      aspek: 'Kualitas Aktiva Produktif',
      komponen: 'Rasio Volume Pinjaman pada Anggota',
      nilaiRasio: 82.3,
      nilai: 100,
      bobot: 10,
      skor: 10.0,
      persentaseMaks: 100,
      status: 'Hijau',
    },
    {
      aspek: 'Kualitas Aktiva Produktif',
      komponen: 'Rasio Kualitas Aktiva Produktif',
      nilaiRasio: 4.2,
      nilai: 90,
      bobot: 5,
      skor: 4.5,
      persentaseMaks: 90,
      status: 'Hijau',
    },
    {
      aspek: 'Kualitas Aktiva Produktif',
      komponen: 'Rasio Aktiva Produktif Bermasalah',
      nilaiRasio: 3.1,
      nilai: 85,
      bobot: 5,
      skor: 4.25,
      persentaseMaks: 85,
      status: 'Hijau',
    },
    {
      aspek: 'Kualitas Aktiva Produktif',
      komponen: 'Rasio Cadangan Kerugian Pinjaman',
      nilaiRasio: 125.0,
      nilai: 100,
      bobot: 5,
      skor: 5.0,
      persentaseMaks: 100,
      status: 'Hijau',
    },
    {
      aspek: 'Efisiensi',
      komponen: 'Rasio Efisiensi Operasional',
      nilaiRasio: 68.5,
      nilai: 70,
      bobot: 4,
      skor: 2.8,
      persentaseMaks: 70,
      status: 'Kuning',
    },
    {
      aspek: 'Efisiensi',
      komponen: 'Rasio Efisiensi Pembiayaan',
      nilaiRasio: 55.2,
      nilai: 60,
      bobot: 3,
      skor: 1.8,
      persentaseMaks: 60,
      status: 'Kuning',
    },
    {
      aspek: 'Efisiensi',
      komponen: 'Rasio Efisiensi Total',
      nilaiRasio: 72.0,
      nilai: 75,
      bobot: 3,
      skor: 2.25,
      persentaseMaks: 75,
      status: 'Kuning',
    },
    {
      aspek: 'Likuiditas',
      komponen: 'Rasio Kas terhadap Kewajiban Jangka Pendek',
      nilaiRasio: 18.5,
      nilai: 90,
      bobot: 8,
      skor: 7.2,
      persentaseMaks: 90,
      status: 'Hijau',
    },
    {
      aspek: 'Likuiditas',
      komponen: 'Rasio Likuiditas',
      nilaiRasio: 22.3,
      nilai: 85,
      bobot: 7,
      skor: 5.95,
      persentaseMaks: 85,
      status: 'Hijau',
    },
    {
      aspek: 'Kemandirian dan Pertumbuhan',
      komponen: 'Rasio Pertumbuhan Anggota',
      nilaiRasio: 5.2,
      nilai: 70,
      bobot: 4,
      skor: 2.8,
      persentaseMaks: 70,
      status: 'Kuning',
    },
    {
      aspek: 'Kemandirian dan Pertumbuhan',
      komponen: 'Rasio Pertumbuhan Volume Pinjaman',
      nilaiRasio: 8.7,
      nilai: 80,
      bobot: 3,
      skor: 2.4,
      persentaseMaks: 80,
      status: 'Kuning',
    },
    {
      aspek: 'Kemandirian dan Pertumbuhan',
      komponen: 'Rasio Kemandirian Pembiayaan',
      nilaiRasio: 91.5,
      nilai: 95,
      bobot: 3,
      skor: 2.85,
      persentaseMaks: 95,
      status: 'Hijau',
    },
    {
      aspek: 'Jatidiri Koperasi',
      komponen: 'Rasio Partisipasi Modal Anggota',
      nilaiRasio: 42.0,
      nilai: 50,
      bobot: 5,
      skor: 2.5,
      persentaseMaks: 50,
      status: 'Kuning',
    },
    {
      aspek: 'Jatidiri Koperasi',
      komponen: 'Rasio Kepesertaan Anggota',
      nilaiRasio: 35.8,
      nilai: 45,
      bobot: 5,
      skor: 2.25,
      persentaseMaks: 45,
      status: 'Merah',
    },
  ],
}

const MOCK_STEPS = [
  { label: 'Mengunggah dokumen...', delay: 500, progress: 15 },
  { label: 'Mengekstrak data dari PDF...', delay: 800, progress: 40 },
  { label: 'Menghitung rasio keuangan...', delay: 900, progress: 70 },
  { label: 'Menyusun hasil penilaian...', delay: 700, progress: 90 },
]

async function runMockSteps(onProgress) {
  for (const step of MOCK_STEPS) {
    onProgress?.(step.label, step.progress)
    await new Promise((resolve) => setTimeout(resolve, step.delay))
  }
  onProgress?.('Selesai', 100)
  await new Promise((resolve) => setTimeout(resolve, 300))
}

export async function processDokumen(file, onProgress) {
  if (USE_MOCK) {
    await runMockSteps(onProgress)
    return { ...mockHasilPenilaian }
  }

  onProgress?.('Mengunggah dokumen...', 10)

  const formData = new FormData()
  formData.append('file', file)

  const { data } = await api.post('/penilaian/process', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (!event.total) return
      const uploadPercent = Math.round((event.loaded / event.total) * 30)
      onProgress?.('Mengunggah dokumen...', uploadPercent)
    },
  })

  onProgress?.('Menyusun hasil penilaian...', 95)
  await new Promise((resolve) => setTimeout(resolve, 200))
  onProgress?.('Selesai', 100)

  return data
}

export { api }