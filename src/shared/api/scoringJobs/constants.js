export const SCORING_JOBS_LIST_LIMIT = Number(
  import.meta.env.VITE_SCORING_JOBS_LIST_LIMIT ?? 200,
)

export const MIDDLEWARE_STATUS_TO_UI = {
  uploading: 'queued',
  waiting: 'queued',
  pending: 'queued',
  queued: 'queued',
  processing: 'processing',
  running: 'processing',
  completed: 'done',
  success: 'done',
  done: 'done',
  failed: 'failed',
  error: 'failed',
  cancelled: 'failed',
  canceled: 'failed',
}