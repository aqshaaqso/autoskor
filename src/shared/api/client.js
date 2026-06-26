import axios from 'axios'
import { API_BASE_URL } from './config'

const AUTH_TOKEN_KEY = 'autoskor_auth_token'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120_000,
})

export function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    return
  }

  localStorage.removeItem(AUTH_TOKEN_KEY)
}

api.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && getStoredToken()) {
      setStoredToken(null)

      const path = window.location.pathname
      if (!path.startsWith('/login')) {
        window.location.assign('/login')
      }
    }

    return Promise.reject(error)
  },
)

export function getApiErrorMessage(error, fallback = 'Terjadi kesalahan.') {
  if (!error) return fallback

  const data = error?.response?.data
  if (typeof data?.message === 'string' && data.message.trim()) {
    return data.message
  }
  if (typeof data?.detail === 'string' && data.detail.trim()) {
    return data.detail
  }
  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}