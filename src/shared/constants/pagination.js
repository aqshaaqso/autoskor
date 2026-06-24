export const TABLE_PAGE_SIZE_OPTIONS = [10, 20, 50]

export const DEFAULT_TABLE_PAGE_SIZE = 10

export function getTotalPages(total, pageSize) {
  if (!total || total <= 0) return 1
  return Math.ceil(total / pageSize)
}

export function getCurrentPage(offset, pageSize) {
  return Math.floor(offset / pageSize) + 1
}

export function getPageRange(offset, pageSize, total) {
  if (!total) return { start: 0, end: 0 }
  const start = offset + 1
  const end = Math.min(offset + pageSize, total)
  return { start, end }
}