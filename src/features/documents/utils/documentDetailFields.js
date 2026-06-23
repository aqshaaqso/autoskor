import { formatFileSize, formatDateTime, formatDateTimeFull } from '@/shared/utils/format'

const MIDDLEWARE_STATUS_LABELS = {
  uploading: 'Mengupload',
  uploaded: 'Terupload',
  waiting: 'Menunggu Antrian',
  running: 'Sedang Berjalan',
  completed_success: 'Selesai Sukses',
  failed: 'Gagal',
  canceled: 'Dibatalkan',
}

const UI_STATUS_LABELS = {
  queued: 'Menunggu',
  processing: 'Sedang Diproses',
  done: 'Selesai',
  failed: 'Gagal',
}

function formatOptionalDate(value, useFull = false) {
  if (!value) return null
  return useFull ? formatDateTimeFull(value) : formatDateTime(value)
}

function formatPercent(value) {
  if (value === null || value === undefined) return null
  return `${Math.round(value)}%`
}

function buildRow(label, value) {
  if (value === null || value === undefined || value === '') return null
  return { label, value }
}

export function buildDocumentDetailSections(document, options = {}) {
  const { showUploader = false } = options

  const fileRows = [
    buildRow('Nama File', document.fileName),
    buildRow('Ekstensi', document.fileExtension?.toUpperCase()),
    buildRow('Tipe MIME', document.mimeType),
    buildRow('Ukuran', formatFileSize(document.fileSize)),
    buildRow('ID File', document.fileId),
  ].filter(Boolean)

  const jobRows = [
    buildRow('ID Job', document.id),
    buildRow('Status', UI_STATUS_LABELS[document.status] ?? document.status),
    document.middlewareStatus &&
      buildRow(
        'Status Middleware',
        MIDDLEWARE_STATUS_LABELS[document.middlewareStatus] ??
          document.middlewareStatus,
      ),
    buildRow('Progress', formatPercent(document.progressPercent)),
    buildRow('Tugas Saat Ini', document.currentTaskType),
    buildRow('Rute Dokumen', document.documentRoute),
  ].filter(Boolean)

  const timelineRows = [
    buildRow('Diupload', formatOptionalDate(document.uploadedAt, true)),
    buildRow('Dibuat', formatOptionalDate(document.createdAt, true)),
    buildRow('Diperbarui', formatOptionalDate(document.updatedAt, true)),
    buildRow('Mulai Diproses', formatOptionalDate(document.processingStartedAt, true)),
    buildRow('Selesai', formatOptionalDate(document.completedAt, true)),
    buildRow('Gagal', formatOptionalDate(document.failedAt, true)),
  ].filter(Boolean)

  const processingRows = [
    buildRow('Worker / Engine Job', document.workerId),
    showUploader &&
      document.uploadedBy &&
      buildRow(
        'Pengupload',
        `${document.uploadedBy.name} (${document.uploadedBy.email})`,
      ),
    buildRow('Alasan Gagal', document.failureReason),
  ].filter(Boolean)

  return [
    { title: 'Informasi File', rows: fileRows },
    { title: 'Status Job', rows: jobRows },
    { title: 'Linimasa', rows: timelineRows },
    { title: 'Pemrosesan', rows: processingRows },
  ].filter((section) => section.rows.length > 0)
}