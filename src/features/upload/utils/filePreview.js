export function isPdfFile(file) {
  return (
    file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
  )
}

export function isDocxFile(file) {
  return (
    file.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.name.toLowerCase().endsWith('.docx')
  )
}

export function canPreviewFile(file) {
  return isPdfFile(file) || isDocxFile(file)
}

export function canPreviewFileName(fileName) {
  if (!fileName || typeof fileName !== 'string') return false
  const lower = fileName.toLowerCase()
  return lower.endsWith('.pdf') || lower.endsWith('.docx')
}

export function guessMimeTypeFromFileName(fileName) {
  if (!fileName) return 'application/octet-stream'
  const lower = fileName.toLowerCase()
  if (lower.endsWith('.pdf')) return 'application/pdf'
  if (lower.endsWith('.docx')) {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  }
  return 'application/octet-stream'
}

export function getFileTypeLabel(file) {
  if (isPdfFile(file)) return 'PDF'
  if (isDocxFile(file)) return 'DOCX'
  return 'Dokumen'
}