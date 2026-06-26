export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api'

function isEnvTrue(key) {
  return import.meta.env[key] === 'true'
}

function isEnvFalse(key) {
  return import.meta.env[key] === 'false'
}

/** Scoring-jobs / dokumen — set false untuk pakai middleware API */
export const USE_MOCK_DOCUMENTS =
  isEnvTrue('VITE_USE_MOCK_DOCUMENTS') ||
  isEnvTrue('VITE_USE_MOCK') ||
  (import.meta.env.DEV &&
    !isEnvFalse('VITE_USE_MOCK_DOCUMENTS') &&
    !isEnvFalse('VITE_USE_MOCK'))

/**
 * Auth — mock hanya aktif di dev secara default.
 * Production: set VITE_USE_MOCK_AUTH=true secara eksplisit jika masih pakai mock.
 */
export const USE_MOCK_AUTH =
  isEnvTrue('VITE_USE_MOCK_AUTH') ||
  (import.meta.env.DEV && !isEnvFalse('VITE_USE_MOCK_AUTH'))

/**
 * Engine dashboard — default real via GET /scoring-jobs (middleware tidak punya /engine/status).
 * Set VITE_USE_MOCK_ENGINE=true untuk kembali ke mock lokal.
 */
export const USE_MOCK_ENGINE = isEnvTrue('VITE_USE_MOCK_ENGINE')

/** Admin activity — mock aktif di dev secara default */
export const USE_MOCK_ADMIN =
  isEnvTrue('VITE_USE_MOCK_ADMIN') ||
  (import.meta.env.DEV && !isEnvFalse('VITE_USE_MOCK_ADMIN'))