import { getStoredToken } from '../client'

export const mockUsers = [
  {
    id: 'user-1',
    name: 'Let Me Cook',
    email: 'admin@koperasi.id',
    password: 'admin123',
    role: 'admin',
    koperasi: {
      id: 'kop-1',
      name: 'Koperasi Sejahtera Abadi',
    },
  },
  {
    id: 'user-2',
    name: 'Kresek Ketoprak',
    email: 'operator@koperasi.id',
    password: 'user123',
    role: 'operator',
    koperasi: {
      id: 'kop-1',
      name: 'Koperasi Sejahtera Abadi',
    },
  },
]

export function toPublicUser(user) {
  const { password: _password, ...publicUser } = user
  return publicUser
}

export function findMockUserByEmail(email) {
  const normalizedEmail = email.trim().toLowerCase()
  return (
    mockUsers.find((user) => user.email.toLowerCase() === normalizedEmail) ??
    null
  )
}

export function findMockUserById(userId) {
  return mockUsers.find((user) => user.id === userId) ?? null
}

export function getMockUserIdFromToken(token) {
  if (!token?.startsWith('mock-token:')) return null
  return token.slice('mock-token:'.length)
}

export async function mockLogin(email, password) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (!email || !password) {
    throw new Error('Email dan password wajib diisi.')
  }

  const user = findMockUserByEmail(email)
  if (!user || user.password !== password) {
    throw new Error('Email atau password salah.')
  }

  return {
    token: `mock-token:${user.id}`,
    user: toPublicUser(user),
  }
}

export async function mockGetCurrentUser() {
  await new Promise((resolve) => setTimeout(resolve, 200))

  const token = getStoredToken()
  if (!token) {
    throw new Error('Sesi tidak valid.')
  }

  const userId = getMockUserIdFromToken(token)
  const user = userId ? findMockUserById(userId) : null
  if (!user) {
    throw new Error('Sesi tidak valid.')
  }

  return toPublicUser(user)
}

export async function mockLogout() {
  return
}