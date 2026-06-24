/**
 * Kontrak pemetaan status & filter antara Middleware API dan UI.
 *
 * Tiga lapisan istilah:
 * 1. Middleware API — status mentah backend (`waiting`, `completed_success`, …)
 * 2. Kode frontend — status internal (`queued`, `done`, …) + kunci filter (`queue`, `processed`)
 * 3. Tampilan user — label Bahasa Indonesia di `shared/utils/documentStatusLabels.js`
 */

/** Status middleware → status internal UI */
export const JOB_STATUS_TO_UI = {
  uploading: 'queued',
  uploaded: 'queued',
  waiting: 'queued',
  running: 'processing',
  completed_success: 'done',
  failed: 'failed',
  canceled: 'canceled',
}

/**
 * Kunci filter frontend → query `status` middleware (comma-separated).
 * Kunci `queue` di kode; label UI "Antrian". Kunci `processed`; label UI "Selesai".
 */
export const UI_STATUS_FILTER_TO_MIDDLEWARE = {
  queue: 'uploading,uploaded,waiting,running',
  processed: 'completed_success,failed',
  done: 'completed_success',
  failed: 'failed',
}

/** Metadata halaman — route, kunci filter, dan label menu */
export const UI_PAGE_FILTERS = {
  queue: {
    path: '/queue',
    label: 'Antrian',
    filterKey: 'queue',
    middlewareStatuses: UI_STATUS_FILTER_TO_MIDDLEWARE.queue,
    uiStatuses: ['queued', 'processing'],
  },
  processed: {
    path: '/processed',
    label: 'Selesai',
    filterKey: 'processed',
    middlewareStatuses: UI_STATUS_FILTER_TO_MIDDLEWARE.processed,
    uiStatuses: ['done', 'failed'],
  },
}