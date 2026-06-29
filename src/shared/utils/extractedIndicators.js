import {
  ASPEK,
  EXTRACTED_ASPEK_SORT_ORDER,
  sortByAspekThenLabel,
} from '@/shared/constants/aspek'
import { EXTRACTED_INDICATOR_FIELDS } from '@/shared/constants/extractedIndicators'
import { formatExtractedValue } from '@/shared/utils/format'

function formatUnknownKey(key) {
  return key
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function mergeRawExtractions(rawExtractions) {
  if (!Array.isArray(rawExtractions) || rawExtractions.length === 0) {
    return {}
  }

  const merged = {}

  for (const entry of rawExtractions) {
    const result = entry?.result ?? entry
    if (!result || typeof result !== 'object') continue

    for (const [key, value] of Object.entries(result)) {
      if (
        (merged[key] === undefined || merged[key] === null) &&
        value !== undefined &&
        value !== null
      ) {
        merged[key] = value
      }
    }
  }

  return merged
}

function buildIndicatorRow({ key, label, aspek, format }, value) {
  return {
    key,
    label,
    aspek,
    format,
    value,
    displayValue: formatExtractedValue(value, format),
    isAvailable: value !== null && value !== undefined && value !== '',
  }
}

export function mapExtractedIndicators(rawExtractions) {
  const merged = mergeRawExtractions(rawExtractions)
  const knownKeys = new Set(EXTRACTED_INDICATOR_FIELDS.map((field) => field.key))

  const items = EXTRACTED_INDICATOR_FIELDS.map((field) =>
    buildIndicatorRow(field, merged[field.key] ?? null),
  )

  for (const [key, value] of Object.entries(merged)) {
    if (knownKeys.has(key)) continue
    items.push(
      buildIndicatorRow(
        {
          key,
          label: formatUnknownKey(key),
          aspek: ASPEK.LAINNYA,
          format: typeof value === 'number' ? 'currency' : 'text',
        },
        value,
      ),
    )
  }

  const sortedItems = sortByAspekThenLabel(items, EXTRACTED_ASPEK_SORT_ORDER, {
    labelKey: 'label',
  })

  const availableCount = sortedItems.filter((item) => item.isAvailable).length

  return {
    items: sortedItems,
    availableCount,
    totalCount: sortedItems.length,
    metadata: {
      namaKoperasi: merged.nama_koperasi ?? null,
      kotaKoperasi: merged.kota_koperasi ?? null,
      tahunLaporan: merged.tahun_laporan ?? null,
    },
    hasData: rawExtractions?.length > 0,
  }
}

export function getCooperativeGeneralInfo(extractedIndicators) {
  const items = extractedIndicators?.items ?? []

  return items
    .filter((item) => item.aspek === ASPEK.INFORMASI_UMUM)
    .map((item) => ({
      label: item.label,
      displayValue: item.displayValue,
    }))
}

export function getExtractedIndicatorsSummary(extractedIndicators) {
  if (!extractedIndicators?.hasData) return null

  const { metadata, availableCount, totalCount } = extractedIndicators
  const parts = []

  if (metadata.namaKoperasi) parts.push(metadata.namaKoperasi)
  if (metadata.kotaKoperasi) parts.push(metadata.kotaKoperasi)
  if (metadata.tahunLaporan) parts.push(`Tahun Buku ${metadata.tahunLaporan}`)

  return {
    title: parts.join(' · ') || 'Data hasil ekstraksi dokumen',
    subtitle: `${availableCount} dari ${totalCount} indikator berhasil diekstrak`,
  }
}