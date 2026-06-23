import { createElement as h } from 'react'

export function StatCard({ icon: Icon, label, value, hint, accentClass }) {
  return h(
    'div',
    {
      className: 'rounded-xl border border-slate-200 bg-white p-5 shadow-sm',
    },
    h(
      'div',
      { className: 'mb-3 flex items-center justify-between' },
      h('p', { className: 'text-sm font-medium text-slate-500' }, label),
      h(
        'div',
        {
          className: `flex h-9 w-9 items-center justify-center rounded-lg ${accentClass}`,
        },
        h(Icon, { className: 'h-4 w-4' }),
      ),
    ),
    h('p', { className: 'text-2xl font-bold text-slate-900' }, value),
    hint && h('p', { className: 'mt-1 text-xs text-slate-500' }, hint),
  )
}