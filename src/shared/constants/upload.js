export const MAX_FILE_UPLOAD_BYTES = 20 * 1024 * 1024

export function getTotalFileBytes(files) {
  return files.reduce((total, file) => total + (file?.size ?? 0), 0)
}

export function isBatchWithinUploadLimit(files) {
  return getTotalFileBytes(files) <= MAX_FILE_UPLOAD_BYTES
}