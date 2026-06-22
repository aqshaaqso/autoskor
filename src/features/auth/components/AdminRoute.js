import { createElement as h } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/useAuthStore'

export function AdminRoute({ children }) {
  const user = useAuthStore((state) => state.user)

  if (user?.role !== 'admin') {
    return h(Navigate, { to: '/upload', replace: true })
  }

  return children
}