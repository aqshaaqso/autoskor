import { createElement as h } from 'react'
import { getStatusClasses } from '@/utils/colorGrading'

export function StatusBadge({ status }) {
  const classes = getStatusClasses(status)
  const dotClass =
    status === 'Hijau'
      ? 'bg-success-500'
      : status === 'Kuning'
        ? 'bg-warning-500'
        : status === 'Tidak Dapat Dihitung'
          ? 'bg-slate-400'
          : 'bg-danger-500'

  return h(
    'span',
    {
      className: `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${classes.badge}`,
    },
    h('span', { className: `mr-1.5 h-2 w-2 rounded-full ${dotClass}` }),
    status,
  )
}