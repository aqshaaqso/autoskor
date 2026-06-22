const PREVIEW_TTL_MS = 10 * 60 * 1000

const previewEntries = new Map()

function cleanupExpired() {
  const now = Date.now()

  for (const [id, entry] of previewEntries) {
    if (now - entry.createdAt > PREVIEW_TTL_MS) {
      previewEntries.delete(id)
    }
  }
}

export function registerPreviewFile(file) {
  cleanupExpired()

  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
  previewEntries.set(id, {
    id,
    file,
    fileName: file.name,
    createdAt: Date.now(),
  })

  return id
}

export function getPreviewEntry(id) {
  cleanupExpired()
  return previewEntries.get(id) ?? null
}

export function revokePreview(id) {
  previewEntries.delete(id)
}