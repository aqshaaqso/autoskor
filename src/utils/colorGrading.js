export function getStatusFromPersentase(persentase) {
  if (persentase >= 85) return 'Hijau'
  if (persentase >= 50) return 'Kuning'
  return 'Merah'
}

export function getStatusClasses(status) {
  switch (status) {
    case 'Hijau':
      return {
        badge: 'bg-success-100 text-success-700 border-success-500/30',
        text: 'text-success-700',
        bg: 'bg-success-50',
        border: 'border-success-500/30',
      }
    case 'Kuning':
      return {
        badge: 'bg-warning-100 text-warning-700 border-warning-500/30',
        text: 'text-warning-700',
        bg: 'bg-warning-50',
        border: 'border-warning-500/30',
      }
    case 'Merah':
      return {
        badge: 'bg-danger-100 text-danger-700 border-danger-500/30',
        text: 'text-danger-700',
        bg: 'bg-danger-50',
        border: 'border-danger-500/30',
      }
  }
}

export function getPredikatClasses(predikat) {
  const upper = predikat.toUpperCase()
  if (upper === 'SEHAT') return 'bg-success-500 text-white'
  if (upper === 'CUKUP SEHAT') return 'bg-success-100 text-success-700'
  if (upper === 'KURANG SEHAT') return 'bg-warning-100 text-warning-700'
  if (upper === 'TIDAK SEHAT') return 'bg-danger-100 text-danger-700'
  return 'bg-danger-600 text-white'
}

export function formatRasio(value) {
  if (typeof value === 'string') return value
  return `${value.toFixed(2)}%`
}

export function formatSkor(value) {
  return value.toFixed(2)
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}