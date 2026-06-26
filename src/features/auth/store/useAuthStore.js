import { create } from 'zustand'
import {
  login as apiLogin,
  getCurrentUser,
  logout as apiLogout,
} from '../api/authApi'
import { getApiErrorMessage, getStoredToken, setStoredToken } from '@/shared/api/client'

let initializePromise = null

export const useAuthStore = create((set) => ({
  user: null,
  token: getStoredToken(),
  isLoading: false,
  isInitializing: !!getStoredToken(),
  loginError: null,

  initialize: async () => {
    if (initializePromise) return initializePromise

    initializePromise = (async () => {
      const token = getStoredToken()
      if (!token) {
        set({ isInitializing: false })
        return
      }

      set({ token, isInitializing: true })

      try {
        const user = await getCurrentUser()
        set({ user, isInitializing: false })
      } catch {
        setStoredToken(null)
        set({ token: null, user: null, isInitializing: false })
      }
    })()

    return initializePromise
  },

  login: async (email, password) => {
    set({ isLoading: true, loginError: null })

    try {
      const { token, user } = await apiLogin(email, password)
      setStoredToken(token)
      set({ token, user, isLoading: false, loginError: null })
      return true
    } catch (err) {
      const message = getApiErrorMessage(err, 'Login gagal. Silakan coba lagi.')
      set({ loginError: message, isLoading: false })
      return false
    }
  },

  logout: async () => {
    try {
      await apiLogout()
    } catch {
      // Abaikan error logout — sesi lokal tetap dihapus
    }

    setStoredToken(null)
    set({ token: null, user: null, loginError: null })
  },
}))