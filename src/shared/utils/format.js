function toFiniteNumber(value, fallback = 0) {
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
}

export function formatRasio(value, options = {}) {
  if (typeof value === 'string') return value

  const num = toFiniteNumber(value)
  if (num === 0 && options.treatZeroAsUnavailable) return '-'

  return `${num.toFixed(2)}%`
}

export function formatNilaiRasio(nilaiRasio, skor) {
  return formatRasio(nilaiRasio, {
    treatZeroAsUnavailable: toFiniteNumber(skor) > 0 && toFiniteNumber(nilaiRasio) === 0,
  })
}

export function formatPersentaseMaks(value) {
  const num = toFiniteNumber(value)
  return `${Math.round(num)}%`
}

export function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return '-'

  const num = Number(value)
  if (!Number.isFinite(num)) return String(value)

  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatExtractedValue(value, format = 'text') {
  if (value === null || value === undefined || value === '') return '-'

  if (format === 'currency') return formatCurrency(value)
  if (format === 'year') return String(value)

  return String(value)
}

export function formatSkor(value) {
  return toFiniteNumber(value).toFixed(2)
}

export function formatNumber(value, decimals = 2) {
  return toFiniteNumber(value).toFixed(decimals)
}

export function formatPersentase(value, decimals = 1) {
  return `${toFiniteNumber(value).toFixed(decimals)}%`
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function formatDateTime(value) {
  if (!value) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function formatDateTimeFull(value) {
  if (!value) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'full',
    timeStyle: 'medium',
  }).format(new Date(value))
}

export function formatProcessingDurationMinutes(seconds) {
  if (seconds === null || seconds === undefined) return null

  const num = Number(seconds)
  if (!Number.isFinite(num) || num <= 0) return null

  const minutes = num / 60
  if (minutes < 1) return '< 1 menit'

  const rounded = Math.round(minutes * 10) / 10
  const formatted = Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(1).replace('.', ',')

  return `${formatted} menit`
}