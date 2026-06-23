export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api'

/** Scoring-jobs / dokumen — set false untuk pakai middleware API */
export const USE_MOCK_DOCUMENTS =
  import.meta.env.VITE_USE_MOCK_DOCUMENTS !== 'false' &&
  import.meta.env.VITE_USE_MOCK !== 'false'

/**
 * Auth — default mock karena middleware belum expose /auth/*
 * Set VITE_USE_MOCK_AUTH=false setelah backend auth siap.
 */
export const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH !== 'false'

/**
 * Engine dashboard — default real via GET /scoring-jobs (middleware tidak punya /engine/status).
 * Set VITE_USE_MOCK_ENGINE=true untuk kembali ke mock lokal.
 */
export const USE_MOCK_ENGINE = import.meta.env.VITE_USE_MOCK_ENGINE === 'true'

/** Admin activity — default mock, middleware belum expose /admin/overview */
export const USE_MOCK_ADMIN = import.meta.env.VITE_USE_MOCK_ADMIN !== 'false'