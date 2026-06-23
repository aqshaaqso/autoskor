import { fetchDocumentFile } from '../api/documentsApi'
import { openFilePreview } from '@/features/upload/utils/openFilePreview'
import {
  canPreviewFile,
  canPreviewFileName,
  guessMimeTypeFromFileName,
} from '@/features/upload/utils/filePreview'

function toPreviewFile(blob, fileName, mimeType) {
  if (blob instanceof File) return blob

  const type =
    mimeType || blob.type || guessMimeTypeFromFileName(fileName)

  return new File([blob], fileName, { type })
}

export function canPreviewUploadedDocument(document) {
  return canPreviewFileName(document?.fileName)
}

export async function openUploadedDocumentPreview(document) {
  if (!document?.id || !document?.fileName) {
    throw new Error('Data dokumen tidak lengkap untuk preview.')
  }

  if (!canPreviewUploadedDocument(document)) {
    throw new Error('Format file tidak mendukung preview. Gunakan PDF atau DOCX.')
  }

  const blob = await fetchDocumentFile(document.id)
  const file = toPreviewFile(blob, document.fileName, document.mimeType)

  if (!canPreviewFile(file)) {
    throw new Error('Format file tidak mendukung preview. Gunakan PDF atau DOCX.')
  }

  openFilePreview(file)
}