import { downloadBlobAsFile } from '@/shared/utils/file'

export function downloadPreviewFile(file) {
  if (!file?.name) {
    throw new Error('Data file tidak lengkap untuk diunduh.')
  }

  downloadBlobAsFile(file, file.name)
}