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

export function getFileTypeLabel(file) {
  if (isPdfFile(file)) return 'PDF'
  if (isDocxFile(file)) return 'DOCX'
  return 'Dokumen'
}