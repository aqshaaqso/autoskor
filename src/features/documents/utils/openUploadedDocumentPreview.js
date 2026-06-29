import { fetchDocumentFile } from '../api/documentsApi'
import {
  canPreviewFileName,
  downloadBlobAsFile,
  toPreviewFile,
} from '@/shared/utils/file'

export function canPreviewUploadedDocument(document) {
  return canPreviewFileName(document?.fileName)
}

export function openUploadedDocumentPreview(document) {
  if (!document?.id || !document?.fileName) {
    throw new Error('Data dokumen tidak lengkap untuk preview.')
  }

  if (!canPreviewUploadedDocument(document)) {
    throw new Error('Format file tidak mendukung preview. Gunakan PDF atau DOCX.')
  }

  const previewUrl = `${window.location.origin}/preview/document/${document.id}`
  const openedWindow = window.open(previewUrl, '_blank', 'noopener,noreferrer')

  if (!openedWindow) {
    throw new Error('Popup diblokir browser. Izinkan popup untuk membuka preview.')
  }
}

export async function downloadUploadedDocument(document) {
  if (!document?.id || !document?.fileName) {
    throw new Error('Data dokumen tidak lengkap untuk diunduh.')
  }

  const blob = await fetchDocumentFile(document.id, { disposition: 'attachment' })
  const file = toPreviewFile(blob, document.fileName, document.mimeType)
  downloadBlobAsFile(file, document.fileName)
}