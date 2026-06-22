/**
 * Kontrak API Middleware Auto-Skor (dari Swagger 172.16.210.244:8000)
 * Branch: feat/middleware-api — referensi kompatibilitas frontend ↔ backend
 */

export const MIDDLEWARE_BASE_PATH = '/api'

/** @type {const} */
export const MIDDLEWARE_JOB_STATUS = {
  UPLOADING: 'uploading',
  UPLOADED: 'uploaded',
  WAITING: 'waiting',
  RUNNING: 'running',
  COMPLETED_SUCCESS: 'completed_success',
  FAILED: 'failed',
  CANCELED: 'canceled',
}

export const MIDDLEWARE_ENDPOINTS = {
  health: {
    method: 'GET',
    path: '/health',
    frontend: null,
    mockFlag: null,
    notes: 'Health check — tidak dipakai UI, bisa untuk monitoring.',
  },
  listScoringJobs: {
    method: 'GET',
    path: '/scoring-jobs',
    frontend: 'getDocuments()',
    mockFlag: 'USE_MOCK_DOCUMENTS',
    query: {
      status: 'Comma-separated: uploading,uploaded,waiting,running,completed_success,failed,canceled',
      limit: 'Max 100',
      offset: 'Pagination offset',
    },
    notes: 'Response: { data: ScoringJob[], pagination: { limit, offset, total } }',
  },
  uploadScoringJobs: {
    method: 'POST',
    path: '/scoring-jobs/upload',
    frontend: 'uploadDocument()',
    mockFlag: 'USE_MOCK_DOCUMENTS',
    body: 'multipart/form-data, field: files (repeatable)',
    notes: 'Response 201: { data: ScoringJob[], message }',
  },
  getScoringJob: {
    method: 'GET',
    path: '/scoring-jobs/{id}',
    frontend: 'getDocumentResults()',
    mockFlag: 'USE_MOCK_DOCUMENTS',
    notes: 'Include file metadata + result.result_data jika selesai.',
  },
  cancelScoringJob: {
    method: 'POST',
    path: '/scoring-jobs/{id}/cancel',
    frontend: null,
    mockFlag: null,
    notes: 'Belum diimplementasi di UI.',
  },
  downloadScoringJobFile: {
    method: 'GET',
    path: '/scoring-jobs/{id}/file',
    frontend: null,
    mockFlag: null,
    notes: 'Download file asli — bisa dipakai preview/download nanti.',
  },
  engineCallbackProgress: {
    method: 'POST',
    path: '/engine-callback/scoring-jobs/{id}/progress',
    frontend: null,
    caller: 'engine',
    notes: 'Bukan untuk frontend.',
  },
  engineCallbackResult: {
    method: 'POST',
    path: '/engine-callback/scoring-jobs/{id}/result',
    frontend: null,
    caller: 'engine',
    notes: 'Bukan untuk frontend.',
  },
  engineCallbackFailed: {
    method: 'POST',
    path: '/engine-callback/scoring-jobs/{id}/failed',
    frontend: null,
    caller: 'engine',
    notes: 'Bukan untuk frontend.',
  },
}

/** Endpoint yang frontend butuh tapi middleware BELUM punya */
export const FRONTEND_ONLY_ENDPOINTS = {
  authLogin: { method: 'POST', path: '/auth/login', mockFlag: 'USE_MOCK_AUTH' },
  authMe: { method: 'GET', path: '/auth/me', mockFlag: 'USE_MOCK_AUTH' },
  authLogout: { method: 'POST', path: '/auth/logout', mockFlag: 'USE_MOCK_AUTH' },
  engineStatus: { method: 'GET', path: '/engine/status', mockFlag: 'USE_MOCK_ENGINE' },
  adminOverview: { method: 'GET', path: '/admin/overview', mockFlag: 'USE_MOCK_ADMIN' },
}

/** Map status middleware → status UI frontend */
export const JOB_STATUS_TO_UI = {
  uploading: 'queued',
  uploaded: 'queued',
  waiting: 'queued',
  running: 'processing',
  completed_success: 'done',
  failed: 'failed',
  canceled: 'failed',
}

/** Map filter halaman frontend → query status middleware (comma-separated) */
export const UI_STATUS_FILTER_TO_MIDDLEWARE = {
  queue: 'uploading,uploaded,waiting,running',
  processed: 'completed_success,failed,canceled',
  done: 'completed_success',
  failed: 'failed,canceled',
}