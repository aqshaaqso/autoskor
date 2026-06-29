import { createElement as h } from 'react'
import { AlertTriangle } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { formatSkor } from '@/shared/utils/format'

export function TidakDapatDihitungPanel({ data }) {
  if (!data) return null

  return h(
    'div',
    {
      className:
        'flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm',
    },
    h(
      'div',
      { className: 'border-b border-slate-200 bg-slate-50 px-4 py-3' },
      h(
        'h3',
        { className: 'text-sm font-semibold text-slate-800' },
        'Tidak Dapat Dihitung',
      ),
      h(
        'p',
        { className: 'mt-1 text-xs text-slate-500' },
        'Tidak termasuk dalam skor parsial',
      ),
    ),
    h(
      'div',
      { className: 'flex flex-1 flex-col p-4' },
      h(
        'div',
        {
          className:
            'mb-4 flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3',
        },
        h(AlertTriangle, {
          className: 'mt-0.5 h-4 w-4 shrink-0 text-slate-500',
        }),
        h(
          'p',
          { className: 'text-xs leading-relaxed text-slate-600' },
          data.catatan,
        ),
      ),
      h(
        'div',
        { className: 'mb-4 flex items-center justify-between gap-2' },
        h('span', { className: 'text-xs font-medium text-slate-500' }, data.aspek),
        h(StatusBadge, { status: 'Tidak Dapat Dihitung' }),
      ),
      h(
        'p',
        { className: 'mb-3 text-xs font-medium text-slate-500' },
        data.flag,
      ),
      h(
        'ul',
        { className: 'mb-4 flex-1 space-y-2' },
        data.komponen.map((item) =>
          h(
            'li',
            {
              key: item.nama,
              className:
                'flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2',
            },
            h(
              'span',
              { className: 'text-sm text-slate-700' },
              item.nama,
            ),
            h(
              'span',
              { className: 'text-xs text-slate-400' },
              `${item.jumlahPertanyaan} pertanyaan`,
            ),
          ),
        ),
      ),
      h(
        'div',
        { className: 'mt-auto grid grid-cols-2 gap-3 border-t border-slate-100 pt-4' },
        h(
          'div',
          { className: 'rounded-lg bg-slate-50 p-3 text-center' },
          h('p', { className: 'text-xs text-slate-500' }, 'Bobot'),
          h(
            'p',
            { className: 'mt-1 text-lg font-semibold text-slate-800' },
            data.bobot,
          ),
        ),
        h(
          'div',
          { className: 'rounded-lg bg-slate-50 p-3 text-center' },
          h('p', { className: 'text-xs text-slate-500' }, 'Skor'),
          h(
            'p',
            { className: 'mt-1 text-lg font-semibold text-slate-400' },
            formatSkor(data.skor),
          ),
        ),
      ),
    ),
  )
}