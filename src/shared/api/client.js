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