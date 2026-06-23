import { createElement as h, useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AlertCircle, Loader2, LogIn } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { USE_MOCK_AUTH } from '@/shared/api/config'

const btnPrimary =
  'inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const token = useAuthStore((state) => state.token)
  const isInitializing = useAuthStore((state) => state.isInitializing)
  const isLoading = useAuthStore((state) => state.isLoading)
  const loginError = useAuthStore((state) => state.loginError)
  const initialize = useAuthStore((state) => state.initialize)
  const login = useAuthStore((state) => state.login)

  const [email, setEmail] = useState('admin@koperasi.id')
  const [password, setPassword] = useState('')

  const from = location.state?.from?.pathname ?? '/upload'

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
      h('p', { className: 'text-sm' }, 'Memuat...'),
    )
  }

  if (token) {
    return h(Navigate, { to: from, replace: true })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const success = await login(email.trim(), password)
    if (success) {
      navigate(from, { replace: true })
    }
  }

  return h(
    'div',
    {
      className:
        'flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8',
    },
    h(
      'div',
      { className: 'w-full max-w-md' },
      h(
        'div',
        { className: 'mb-8 text-center' },
        h(
          'div',
          {
            className:
              'mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-lg font-bold text-white',
          },
          'AS',
        ),
        h(
          'h1',
          { className: 'text-2xl font-bold text-slate-900' },
          'Auto-Skor',
        ),
        h(
          'p',
          { className: 'mt-2 text-sm text-slate-500' },
          'Masuk untuk mengakses dashboard penilaian koperasi.',
        ),
      ),
      h(
        'form',
        {
          onSubmit: (event) => void handleSubmit(event),
          className:
            'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm',
        },
        loginError &&
          h(
            'div',
            {
              className:
                'mb-4 flex items-start gap-2 rounded-lg border border-danger-200 bg-danger-50 px-3 py-2.5 text-sm text-danger-700',
            },
            h(AlertCircle, { className: 'mt-0.5 h-4 w-4 shrink-0' }),
            h('span', null, loginError),
          ),
        h(
          'div',
          { className: 'space-y-4' },
          h(
            'div',
            null,
            h(
              'label',
              {
                htmlFor: 'email',
                className: 'mb-1.5 block text-sm font-medium text-slate-700',
              },
              'Email',
            ),
            h('input', {
              id: 'email',
              type: 'email',
              autoComplete: 'email',
              required: true,
              value: email,
              onChange: (event) => setEmail(event.target.value),
              className: inputClass,
              placeholder: 'nama@koperasi.id',
            }),
          ),
          h(
            'div',
            null,
            h(
              'label',
              {
                htmlFor: 'password',
                className: 'mb-1.5 block text-sm font-medium text-slate-700',
              },
              'Password',
            ),
            h('input', {
              id: 'password',
              type: 'password',
              autoComplete: 'current-password',
              required: true,
              value: password,
              onChange: (event) => setPassword(event.target.value),
              className: inputClass,
              placeholder: 'Minimal 6 karakter',
            }),
          ),
        ),
        h(
          'button',
          {
            type: 'submit',
            className: `${btnPrimary} mt-6`,
            disabled: isLoading,
          },
          isLoading
            ? h(Loader2, { className: 'h-4 w-4 animate-spin' })
            : h(LogIn, { className: 'h-4 w-4' }),
          isLoading ? 'Memproses...' : 'Masuk',
        ),
        USE_MOCK_AUTH &&
          h(
            'div',
            {
              className:
                'mt-4 space-y-1 rounded-lg bg-slate-50 px-3 py-2 text-center text-xs text-slate-500',
            },
            h('p', { className: 'font-medium text-slate-600' }, 'Akun demo:'),
            h('p', null, 'Admin — admin@koperasi.id / admin123'),
            h('p', null, 'Operator — operator@koperasi.id / user123'),
          ),
      ),
    ),
  )
}