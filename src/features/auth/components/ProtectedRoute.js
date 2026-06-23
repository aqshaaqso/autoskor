import { createElement as h, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

export function ProtectedRoute({ children }) {
  const location = useLocation()
  const token = useAuthStore((state) => state.token)
  const isInitializing = useAuthStore((state) => state.isInitializing)
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    void initialize()
  }, [initialize])

  if (isInitializing) {
    return h(
      'div',
      {
        className:
          'flex h-screen flex-col items-center justify-center gap-3 bg-slate-100 text-slate-600',
      },
      h(Loader2, { className: 'h-8 w-8 animate-spin text-primary-600' }),
      h('p', { className: 'text-sm' }, 'Memuat sesi...'),
    )
  }

  if (!token) {
    return h(Navigate, {
      to: '/login',
      state: { from: location },
      replace: true,
    })
  }

  return children
}