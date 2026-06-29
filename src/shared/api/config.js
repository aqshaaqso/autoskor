export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api'

function isEnvTrue(key) {
  return import.meta.env[key] === 'true'
}

function isEnvFalse(key) {
  return import.meta.env[key] === 'false'
}

/**
 * Auth — mock aktif di dev secara default sampai middleware menyediakan /auth/*.
 */
export const USE_MOCK_AUTH =
  isEnvTrue('VITE_USE_MOCK_AUTH') ||
  (import.meta.env.DEV && !isEnvFalse('VITE_USE_MOCK_AUTH'))

/**
 * Admin activity — mock aktif di dev secara default sampai middleware menyediakan /admin/*.
 */
export const USE_MOCK_ADMIN =
  isEnvTrue('VITE_USE_MOCK_ADMIN') ||
  (import.meta.env.DEV && !isEnvFalse('VITE_USE_MOCK_ADMIN'))