import {
  DOCX_EXTENSION,
  DOCX_MIME_TYPE,
  PDF_EXTENSION,
  PDF_MIME_TYPE,
} from '@/shared/constants/fileTypes'

export function getFileExtension(fileName) {
  if (!fileName || typeof fileName !== 'string') return null
  const dotIndex = fileName.lastIndexOf('.')
  if (dotIndex <= 0) return null
  return fileName.slice(dotIndex + 1).toLowerCase()
}

export function isPdfFileName(fileName) {
  if (!fileName || typeof fileName !== 'string') return false
  return fileName.toLowerCase().endsWith(PDF_EXTENSION)
}

export function isDocxFileName(fileName) {
  if (!fileName || typeof fileName !== 'string') return false
  return fileName.toLowerCase().endsWith(DOCX_EXTENSION)
}

export function isPdfFile(file) {
  return file?.type === PDF_MIME_TYPE || isPdfFileName(file?.name)
}

export function isDocxFile(file) {
  return file?.type === DOCX_MIME_TYPE || isDocxFileName(file?.name)
}

export function canPreviewFile(file) {
  return isPdfFile(file) || isDocxFile(file)
}

export function canPreviewFileName(fileName) {
  return isPdfFileName(fileName) || isDocxFileName(fileName)
}

export function guessMimeTypeFromFileName(fileName) {
  if (!fileName) return 'application/octet-stream'
  if (isPdfFileName(fileName)) return PDF_MIME_TYPE
  if (isDocxFileName(fileName)) return DOCX_MIME_TYPE
  return 'application/octet-stream'
}

export function getFileTypeLabel(file) {
  if (isPdfFile(file)) return 'PDF'
  if (isDocxFile(file)) return 'DOCX'
  return 'Dokumen'
}

export function toPreviewFile(blob, fileName, mimeType) {
  if (blob instanceof File) return blob

  const type =
    mimeType || blob.type || guessMimeTypeFromFileName(fileName)

  return new File([blob], fileName, { type })
}

export function downloadBlobAsFile(blob, fileName) {
  if (!blob || !fileName) {
    throw new Error('Data file tidak lengkap untuk diunduh.')
  }

  const url = URL.createObjectURL(blob)
  const link = globalThis.document.createElement('a')
  link.href = url
  link.download = fileName
  link.rel = 'noopener'
  link.click()
  URL.revokeObjectURL(url)
}