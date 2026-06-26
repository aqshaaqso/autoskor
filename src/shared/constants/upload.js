export const MAX_FILE_UPLOAD_BYTES = 20 * 1024 * 1024

export function isFileWithinUploadLimit(file) {
  return (file?.size ?? 0) <= MAX_FILE_UPLOAD_BYTES
}

export function findOversizedFile(files) {
  return files.find((file) => !isFileWithinUploadLimit(file)) ?? null
}