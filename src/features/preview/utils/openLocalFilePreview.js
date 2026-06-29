import { canPreviewFile, isPdfFile } from '@/shared/utils/file'
import { registerPreviewFile, revokePreview } from './previewSession'

function revokeObjectUrlWhenWindowCloses(objectUrl, previewWindow) {
  const intervalId = window.setInterval(() => {
    if (previewWindow.closed) {
      URL.revokeObjectURL(objectUrl)
      window.clearInterval(intervalId)
    }
  }, 1000)
}

export function openLocalFilePreview(file) {
  if (!canPreviewFile(file)) return

  if (isPdfFile(file)) {
    const objectUrl = URL.createObjectURL(file)
    const openedWindow = window.open(objectUrl, '_blank', 'noopener,noreferrer')

    if (!openedWindow) {
      URL.revokeObjectURL(objectUrl)
      return
    }

    revokeObjectUrlWhenWindowCloses(objectUrl, openedWindow)
    return
  }

  const previewId = registerPreviewFile(file)
  const previewUrl = `${window.location.origin}/preview/${previewId}`
  const openedWindow = window.open(previewUrl, '_blank', 'noopener,noreferrer')

  if (!openedWindow) {
    revokePreview(previewId)
  }
}