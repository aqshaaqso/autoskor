import { ASPEK } from './aspek'
import { buildPreferredIndikatorKeyMap } from '@/shared/utils/resultDetail'

export const INDIKATOR_META = {
  skor_modal_sendiri_total_asset: {
    aspek: ASPEK.PERMODALAN,
    komponen: 'Rasio Modal Sendiri terhadap Total Asset',
  },
  skor_modal_sendiri_pinjaman_berisiko: {
    aspek: ASPEK.PERMODALAN,
    komponen: 'Rasio Modal Sendiri terhadap Pinjaman Berisiko',
  },
  skor_kecukupan_modal_sendiri: {
    aspek: ASPEK.PERMODALAN,
    komponen: 'Rasio Kecukupan Modal Sendiri',
  },
  skor_volume_pinjaman_anggota: {
    aspek: ASPEK.KUALITAS_AKTIVA_PRODUKTIF,
    komponen: 'Rasio Volume Pinjaman pada Anggota',
  },
  skor_kualitas_aktiva_produktif: {
    aspek: ASPEK.KUALITAS_AKTIVA_PRODUKTIF,
    komponen: 'Rasio Kualitas Aktiva Produktif',
  },
  skor_aktiva_produktif_bermasalah: {
    aspek: ASPEK.KUALITAS_AKTIVA_PRODUKTIF,
    komponen: 'Rasio Aktiva Produktif Bermasalah',
  },
  skor_cadangan_kerugian_pinjaman: {
    aspek: ASPEK.KUALITAS_AKTIVA_PRODUKTIF,
    komponen: 'Rasio Cadangan Kerugian Pinjaman',
  },
  skor_cadangan_risiko: {
    aspek: ASPEK.KUALITAS_AKTIVA_PRODUKTIF,
    komponen: 'Rasio Cadangan Risiko',
  },
  skor_modal: {
    aspek: ASPEK.PERMODALAN,
    komponen: 'Rasio Modal Sendiri terhadap Total Asset',
  },
  skor_pinjaman: {
    aspek: ASPEK.KUALITAS_AKTIVA_PRODUKTIF,
    komponen: 'Rasio Volume Pinjaman pada Anggota',
  },
  skor_kecukupan_modal: {
    aspek: ASPEK.PERMODALAN,
    komponen: 'Rasio Kecukupan Modal Sendiri',
  },
  skor_efisiensi_operasi: {
    aspek: ASPEK.EFISIENSI,
    komponen: 'Rasio Efisiensi Operasional',
  },
  skor_partisipasi_bruto: {
    aspek: ASPEK.EFISIENSI,
    komponen: 'Rasio Efisiensi Operasional',
  },
  skor_pinjaman_berisiko: {
    aspek: ASPEK.PERMODALAN,
    komponen: 'Rasio Modal Sendiri terhadap Pinjaman Berisiko',
  },
  skor_rentabilitas_aset: {
    aspek: ASPEK.EFISIENSI,
    komponen: 'Rasio Rentabilitas Aktiva',
  },
  skor_rentabilitas_modal: {
    aspek: ASPEK.PERMODALAN,
    komponen: 'Rasio Rentabilitas Modal',
  },
  skor_efisiensi_pelayanan: {
    aspek: ASPEK.EFISIENSI,
    komponen: 'Rasio Efisiensi Pelayanan',
  },
  skor_efisiensi_beban_usaha: {
    aspek: ASPEK.EFISIENSI,
    komponen: 'Rasio Efisiensi Beban Usaha',
  },
  skor_kemandirian_operasional: {
    aspek: ASPEK.KEMANDIRIAN_DAN_PERTUMBUHAN,
    komponen: 'Rasio Kemandirian Operasional',
  },
  skor_modal_pinjaman_berisiko: {
    aspek: ASPEK.PERMODALAN,
    komponen: 'Rasio Modal Sendiri terhadap Pinjaman Berisiko',
  },
  skor_promosi_ekonomi_anggota: {
    aspek: ASPEK.KEMANDIRIAN_DAN_PERTUMBUHAN,
    komponen: 'Rasio Promosi Ekonomi Anggota',
  },
  skor_risiko_pinjaman_bermasalah: {
    aspek: ASPEK.KUALITAS_AKTIVA_PRODUKTIF,
    komponen: 'Rasio Aktiva Produktif Bermasalah',
  },
  skor_efisiensi_operasional: {
    aspek: ASPEK.EFISIENSI,
    komponen: 'Rasio Efisiensi Operasional',
  },
  skor_efisiensi_pembiayaan: {
    aspek: ASPEK.EFISIENSI,
    komponen: 'Rasio Efisiensi Pembiayaan',
  },
  skor_efisiensi_total: {
    aspek: ASPEK.EFISIENSI,
    komponen: 'Rasio Efisiensi Total',
  },
  skor_kas: {
    aspek: ASPEK.LIKUIDITAS,
    komponen: 'Rasio Kas terhadap Kewajiban Jangka Pendek',
  },
  skor_likuiditas: {
    aspek: ASPEK.LIKUIDITAS,
    komponen: 'Rasio Likuiditas',
  },
  skor_pertumbuhan_anggota: {
    aspek: ASPEK.KEMANDIRIAN_DAN_PERTUMBUHAN,
    komponen: 'Rasio Pertumbuhan Anggota',
  },
  skor_pertumbuhan_volume_pinjaman: {
    aspek: ASPEK.KEMANDIRIAN_DAN_PERTUMBUHAN,
    komponen: 'Rasio Pertumbuhan Volume Pinjaman',
  },
  skor_kemandirian_pembiayaan: {
    aspek: ASPEK.KEMANDIRIAN_DAN_PERTUMBUHAN,
    komponen: 'Rasio Kemandirian Pembiayaan',
  },
  skor_partisipasi_modal_anggota: {
    aspek: ASPEK.JATIDIRI_KOPERASI,
    komponen: 'Rasio Partisipasi Modal Anggota',
  },
  skor_kepesertaan_anggota: {
    aspek: ASPEK.JATIDIRI_KOPERASI,
    komponen: 'Rasio Kepesertaan Anggota',
  },
}

export const PREFERRED_INDIKATOR_KEY = buildPreferredIndikatorKeyMap(INDIKATOR_META)

function formatIndikatorKey(key) {
  const label = key.replace(/^skor_/, '').replaceAll('_', ' ')
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function getIndikatorMeta(key) {
  const meta = INDIKATOR_META[key]
  if (meta) return meta

  return {
    aspek: ASPEK.PENILAIAN_KESEHATAN,
    komponen: formatIndikatorKey(key),
  }
}