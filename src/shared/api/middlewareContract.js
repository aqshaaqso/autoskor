/** Map status middleware → status UI frontend */
export const JOB_STATUS_TO_UI = {
  uploading: 'queued',
  uploaded: 'queued',
  waiting: 'queued',
  running: 'processing',
  completed_success: 'done',
  failed: 'failed',
  canceled: 'canceled',
}

/** Map filter halaman frontend → query status middleware (comma-separated) */
export const UI_STATUS_FILTER_TO_MIDDLEWARE = {
  queue: 'uploading,uploaded,waiting,running',
  processed: 'completed_success,failed',
  done: 'completed_success',
  failed: 'failed',
}