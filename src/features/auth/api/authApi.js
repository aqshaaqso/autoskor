import { api } from '@/shared/api/client'
import { USE_MOCK_AUTH } from '@/shared/api/config'
import {
  mockLogin,
  mockGetCurrentUser,
  mockLogout,
} from '@/shared/api/mock/authMock'

export async function login(email, password) {
  if (USE_MOCK_AUTH) {
    return mockLogin(email, password)
  }

  const { data } = await api.post('/auth/login', { email, password })
  return data
}

export async function getCurrentUser() {
  if (USE_MOCK_AUTH) {
    return mockGetCurrentUser()
  }

  const { data } = await api.get('/auth/me')
  return data
}

export async function logout() {
  if (USE_MOCK_AUTH) {
    return mockLogout()
  }

  await api.post('/auth/logout')
}