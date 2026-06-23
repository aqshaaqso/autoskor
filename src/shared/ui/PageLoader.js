import { createElement as h } from 'react'
import { Loader2 } from 'lucide-react'

export function PageLoader({ message = 'Memuat halaman...' }) {
  return h(
    'div',
    {
      className:
        'flex items-center justify-center py-16 text-slate-500',
    },
    h(Loader2, { className: 'mr-2 h-5 w-5 animate-spin' }),
    message,
  )
}