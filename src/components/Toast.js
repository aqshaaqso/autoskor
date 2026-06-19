import { createElement as h, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, XCircle, X } from 'lucide-react'
import { useKoperasiStore } from '@/store/useKoperasiStore'

export function Toast() {
  const { toast, clearToast } = useKoperasiStore()

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => clearToast(), 6000)
    return () => clearTimeout(timer)
  }, [toast, clearToast])

  if (!toast) return null

  const isSuccess = toast.type === 'success'

  return h(
    'div',
    {
      className: `fixed right-6 top-6 z-50 w-full max-w-sm rounded-xl border px-4 py-3 shadow-lg ${
        isSuccess
          ? 'border-success-500/30 bg-success-50 text-success-800'
          : 'border-danger-500/30 bg-danger-50 text-danger-800'
      }`,
    },
    h(
      'div',
      { className: 'flex items-start gap-3' },
      isSuccess
        ? h(CheckCircle2, { className: 'mt-0.5 h-5 w-5 shrink-0' })
        : h(XCircle, { className: 'mt-0.5 h-5 w-5 shrink-0' }),
      h(
        'div',
        { className: 'min-w-0 flex-1' },
        h('p', { className: 'text-sm font-medium' }, toast.message),
        toast.documentId &&
          h(
            Link,
            {
              to: `/processed/${toast.documentId}`,
              onClick: clearToast,
              className:
                'mt-2 inline-block text-sm font-semibold text-primary-600 hover:text-primary-700',
            },
            'Lihat Hasil →',
          ),
      ),
      h(
        'button',
        {
          type: 'button',
          onClick: clearToast,
          className: 'rounded p-0.5 opacity-70 transition-opacity hover:opacity-100',
          'aria-label': 'Tutup notifikasi',
        },
        h(X, { className: 'h-4 w-4' }),
      ),
    ),
  )
}