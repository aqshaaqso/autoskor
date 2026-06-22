import { canPreviewFile, isPdfFile } from '@/features/upload/utils/filePreview'
import { registerPreviewFile, revokePreview } from '@/features/upload/utils/previewSession'

const PDF_OBJECT_URL_TTL_MS = 120_000

export function openFilePreview(file) {
  if (!canPreviewFile(file)) return

  if (isPdfFile(file)) {
    const objectUrl = URL.createObjectURL(file)
    const openedWindow = window.open(objectUrl, '_blank', 'noopener,noreferrer')

    if (!openedWindow) {
      URL.revokeObjectURL(objectUrl)
      return
    }

    window.setTimeout(() => URL.revokeObjectURL(objectUrl), PDF_OBJECT_URL_TTL_MS)
    return
  }

  const previewId = registerPreviewFile(file)
  const previewUrl = `${window.location.origin}/preview/${previewId}`
  const openedWindow = window.open(previewUrl, '_blank', 'noopener,noreferrer')

  if (!openedWindow) {
    revokePreview(previewId)
  }
}