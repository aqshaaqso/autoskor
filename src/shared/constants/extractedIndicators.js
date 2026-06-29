import { ASPEK } from './aspek'

export { EXTRACTED_ASPEK_SORT_ORDER } from './aspek'

export const EXTRACTED_INDICATOR_FIELDS = [
  { key: 'nama_koperasi', label: 'Nama Koperasi', aspek: ASPEK.INFORMASI_UMUM, format: 'text' },
  { key: 'kota_koperasi', label: 'Kota Koperasi', aspek: ASPEK.INFORMASI_UMUM, format: 'text' },
  { key: 'tahun_laporan', label: 'Tahun Laporan', aspek: ASPEK.INFORMASI_UMUM, format: 'year' },

  { key: 'permodalan_modal_sendiri', label: 'Modal Sendiri', aspek: ASPEK.PERMODALAN, format: 'currency' },
  { key: 'permodalan_total_aset', label: 'Total Aset', aspek: ASPEK.PERMODALAN, format: 'currency' },

  { key: 'aktiva_pinjaman_diberikan', label: 'Pinjaman Diberikan', aspek: ASPEK.KUALITAS_AKTIVA_PRODUKTIF, format: 'currency' },
  { key: 'aktiva_pinjaman_bermasalah', label: 'Pinjaman Bermasalah', aspek: ASPEK.KUALITAS_AKTIVA_PRODUKTIF, format: 'currency' },
  { key: 'aktiva_total_volume_pinjaman', label: 'Total Volume Pinjaman', aspek: ASPEK.KUALITAS_AKTIVA_PRODUKTIF, format: 'currency' },
  { key: 'aktiva_volume_pinjaman_anggota', label: 'Volume Pinjaman Anggota', aspek: ASPEK.KUALITAS_AKTIVA_PRODUKTIF, format: 'currency' },
  { key: 'aktiva_cadangan_risiko', label: 'Cadangan Risiko', aspek: ASPEK.KUALITAS_AKTIVA_PRODUKTIF, format: 'currency' },

  { key: 'likuiditas_kas_dan_bank', label: 'Kas dan Bank', aspek: ASPEK.LIKUIDITAS, format: 'currency' },
  { key: 'likuiditas_kewajiban_lancar', label: 'Kewajiban Lancar', aspek: ASPEK.LIKUIDITAS, format: 'currency' },
  { key: 'likuiditas_dana_diterima', label: 'Dana Diterima di Muka', aspek: ASPEK.LIKUIDITAS, format: 'currency' },

  { key: 'efisiensi_shu_kotor', label: 'SHU Kotor', aspek: ASPEK.EFISIENSI, format: 'currency' },
  { key: 'efisiensi_beban_usaha', label: 'Beban Usaha', aspek: ASPEK.EFISIENSI, format: 'currency' },
  { key: 'efisiensi_biaya_karyawan', label: 'Biaya Karyawan', aspek: ASPEK.EFISIENSI, format: 'currency' },
  { key: 'efisiensi_partisipasi_bruto', label: 'Partisipasi Bruto', aspek: ASPEK.EFISIENSI, format: 'currency' },
  { key: 'efisiensi_beban_perkoperasian', label: 'Beban Perkoperasian', aspek: ASPEK.EFISIENSI, format: 'currency' },
  { key: 'efisiensi_beban_pokok_anggota', label: 'Beban Pokok Anggota', aspek: ASPEK.EFISIENSI, format: 'currency' },

  { key: 'kemandirian_shu_sebelum_pajak', label: 'SHU Sebelum Pajak', aspek: ASPEK.KEMANDIRIAN_DAN_PERTUMBUHAN, format: 'currency' },
  { key: 'kemandirian_shu_bagian_anggota', label: 'SHU Bagian Anggota', aspek: ASPEK.KEMANDIRIAN_DAN_PERTUMBUHAN, format: 'currency' },

  { key: 'jatidiri_simpanan_pokok', label: 'Simpanan Pokok', aspek: ASPEK.JATIDIRI_KOPERASI, format: 'currency' },
  { key: 'jatidiri_simpanan_wajib', label: 'Simpanan Wajib', aspek: ASPEK.JATIDIRI_KOPERASI, format: 'currency' },
  { key: 'jatidiri_pendapatan_non_anggota', label: 'Pendapatan Non-Anggota', aspek: ASPEK.JATIDIRI_KOPERASI, format: 'currency' },
]