import {
  SCORING_ASPEK_SORT_ORDER,
  sortByAspekThenLabel,
} from '@/shared/constants/aspek'

export { SCORING_ASPEK_SORT_ORDER as ASPEK_SORT_ORDER } from '@/shared/constants/aspek'

export function normalizeBobot(bobot) {
  const value = Number(bobot ?? 0)
  if (value > 0 && value <= 1) return value * 100
  return value
}

export function buildPreferredIndikatorKeyMap(indikatorMeta) {
  const preferred = {}

  for (const [key, { aspek, komponen }] of Object.entries(indikatorMeta)) {
    const composite = `${aspek}\0${komponen}`
    if (!preferred[composite]) preferred[composite] = key
  }

  return preferred
}

function roundPercent(value) {
  const num = Number(value)
  if (!Number.isFinite(num)) return 0
  return Math.round(num * 10) / 10
}

export function computePersentaseMaks({ skor, bobot, persentaseMaks }) {
  if (persentaseMaks !== undefined && persentaseMaks !== null) {
    return roundPercent(persentaseMaks)
  }

  const normalizedBobot = normalizeBobot(bobot)
  const numericSkor = Number(skor ?? 0)

  if (normalizedBobot > 0 && Number.isFinite(numericSkor)) {
    return roundPercent((numericSkor / normalizedBobot) * 100)
  }

  return 0
}

function compareIndikatorEntries(a, b) {
  const skorDiff = Number(b.value?.skor ?? 0) - Number(a.value?.skor ?? 0)
  if (skorDiff !== 0) return skorDiff

  const bobotDiff = normalizeBobot(b.value?.bobot) - normalizeBobot(a.value?.bobot)
  if (bobotDiff !== 0) return bobotDiff

  return Number(b.value?.rasio ?? 0) - Number(a.value?.rasio ?? 0)
}

export function selectIndikatorEntry(group, preferredKey) {
  if (!group.length) return null

  const best = [...group].sort(compareIndikatorEntries)[0]

  if (!preferredKey) return best

  const preferred = group.find((entry) => entry.key === preferredKey)
  if (!preferred) return best

  const preferredSkor = Number(preferred.value?.skor ?? 0)
  const bestSkor = Number(best.value?.skor ?? 0)

  return preferredSkor >= bestSkor ? preferred : best
}

export function groupIndikatorEntries(detailIndikator, getMetaForKey) {
  const groups = new Map()

  for (const [key, value] of Object.entries(detailIndikator)) {
    const meta = getMetaForKey(key)
    const groupKey = `${meta.aspek}\0${meta.komponen}`

    if (!groups.has(groupKey)) {
      groups.set(groupKey, [])
    }

    groups.get(groupKey).push({ key, value, meta })
  }

  return groups
}

export function sortDetailRows(rows) {
  return sortByAspekThenLabel(rows, SCORING_ASPEK_SORT_ORDER, {
    labelKey: 'komponen',
  })
}

export function deduplicateDetailRows(rows) {
  const byKomponen = new Map()

  for (const row of rows) {
    const key = `${row.aspek}\0${row.komponen}`
    const existing = byKomponen.get(key)

    if (!existing) {
      byKomponen.set(key, row)
      continue
    }

    const existingSkor = Number(existing.skor ?? 0)
    const rowSkor = Number(row.skor ?? 0)

    if (rowSkor > existingSkor) {
      byKomponen.set(key, row)
      continue
    }

    if (rowSkor < existingSkor) continue

    if (normalizeBobot(row.bobot) > normalizeBobot(existing.bobot)) {
      byKomponen.set(key, row)
    }
  }

  return [...byKomponen.values()]
}

export function finalizeDetailRows(rows) {
  return sortDetailRows(deduplicateDetailRows(rows))
}

export function sumDetailSkor(rows) {
  return rows.reduce((sum, row) => sum + Number(row.skor ?? 0), 0)
}