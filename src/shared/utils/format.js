function toFiniteNumber(value, fallback = 0) {
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
}

export function formatRasio(value) {
  if (typeof value === 'string') return value
  return `${toFiniteNumber(value).toFixed(2)}%`
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