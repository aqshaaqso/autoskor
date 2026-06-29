export const ASPEK = {
  INFORMASI_UMUM: 'Informasi Umum',
  PERMODALAN: 'Permodalan',
  LIKUIDITAS: 'Likuiditas',
  KUALITAS_AKTIVA_PRODUKTIF: 'Kualitas Aktiva Produktif',
  EFISIENSI: 'Efisiensi',
  KEMANDIRIAN_DAN_PERTUMBUHAN: 'Kemandirian dan Pertumbuhan',
  JATIDIRI_KOPERASI: 'Jatidiri Koperasi',
  PENILAIAN_KESEHATAN: 'Penilaian Kesehatan',
  LAINNYA: 'Lainnya',
}

/** Urutan tampilan kartu penilaian (ResultsTable, PDF). */
export const SCORING_ASPEK_SORT_ORDER = [
  ASPEK.PERMODALAN,
  ASPEK.LIKUIDITAS,
  ASPEK.KUALITAS_AKTIVA_PRODUKTIF,
  ASPEK.EFISIENSI,
  ASPEK.KEMANDIRIAN_DAN_PERTUMBUHAN,
  ASPEK.JATIDIRI_KOPERASI,
  ASPEK.PENILAIAN_KESEHATAN,
]

/** Urutan tampilan panel indikator diekstrak. */
export const EXTRACTED_ASPEK_SORT_ORDER = [
  ASPEK.INFORMASI_UMUM,
  ASPEK.PERMODALAN,
  ASPEK.KUALITAS_AKTIVA_PRODUKTIF,
  ASPEK.LIKUIDITAS,
  ASPEK.EFISIENSI,
  ASPEK.KEMANDIRIAN_DAN_PERTUMBUHAN,
  ASPEK.JATIDIRI_KOPERASI,
  ASPEK.LAINNYA,
]

export function getAspekSortIndex(aspek, sortOrder) {
  const index = sortOrder.indexOf(aspek)
  return index === -1 ? sortOrder.length : index
}

export function sortByAspekThenLabel(
  items,
  sortOrder,
  { labelKey = 'label', getAspek = (item) => item.aspek } = {},
) {
  return [...items].sort((a, b) => {
    const aspekDiff =
      getAspekSortIndex(getAspek(a), sortOrder) -
      getAspekSortIndex(getAspek(b), sortOrder)
    if (aspekDiff !== 0) return aspekDiff
    return String(a[labelKey] ?? '').localeCompare(String(b[labelKey] ?? ''), 'id')
  })
}

/**
 * Row-span metadata for tables where items are pre-sorted by consecutive aspek.
 */
export function getConsecutiveAspekMeta(items, getAspek = (item) => item.aspek) {
  return items.map((item, index) => {
    const aspek = getAspek(item)
    const isGroupStart = index === 0 || getAspek(items[index - 1]) !== aspek

    if (!isGroupStart) {
      return { showAspek: false, aspekRowSpan: 1 }
    }

    let aspekRowSpan = 1
    while (
      index + aspekRowSpan < items.length &&
      getAspek(items[index + aspekRowSpan]) === aspek
    ) {
      aspekRowSpan += 1
    }

    return { showAspek: true, aspekRowSpan }
  })
}