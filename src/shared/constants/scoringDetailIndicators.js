import indikatorDetailPenilaian from './indikatorDetailPenilaian.json'

export const SCORING_DETAIL_INDICATORS =
  indikatorDetailPenilaian.indikator_detail_penilaian

export const SCORING_DETAIL_INDICATOR_META = Object.fromEntries(
  SCORING_DETAIL_INDICATORS.map(({ key, aspek, komponen }) => [
    key,
    { aspek, komponen },
  ]),
)

/** Kunci `detail_indikator` dari engine (format baru) → kunci kanonik `skor_*`. */
export const DETAIL_INDIKATOR_KEY_ALIASES = {
  permodalan_aset: 'skor_modal',
  permodalan_kecukupan: 'skor_kecukupan_modal',
  permodalan_pinjaman_berisiko: 'skor_modal_pinjaman_berisiko',
  rentabilitas_modal: 'skor_rentabilitas_modal',
  likuiditas_kas: 'skor_kas',
  likuiditas_pinjaman_dana: 'skor_pinjaman',
  kualitas_volume_anggota: 'skor_volume_pinjaman_anggota',
  kualitas_cadangan_risiko: 'skor_cadangan_risiko',
  kualitas_pinjaman_berisiko: 'skor_pinjaman_berisiko',
  kualitas_risiko_bermasalah: 'skor_risiko_pinjaman_bermasalah',
  efisiensi_operasi: 'skor_efisiensi_operasi',
  jatidiri_koperasi: 'skor_partisipasi_bruto',
  rentabilitas_aset: 'skor_rentabilitas_aset',
  efisiensi_pelayanan: 'skor_efisiensi_pelayanan',
  efisiensi_beban_usaha: 'skor_efisiensi_beban_usaha',
  kemandirian_operasional: 'skor_kemandirian_operasional',
  jatidiri_pea: 'skor_promosi_ekonomi_anggota',
}

export function resolveDetailIndikatorKey(key) {
  return DETAIL_INDIKATOR_KEY_ALIASES[key] ?? key
}