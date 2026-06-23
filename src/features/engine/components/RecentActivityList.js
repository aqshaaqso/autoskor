import { createElement as h } from 'react'
import { DocumentStatusBadge } from '@/features/documents'
import { formatDateTime } from '@/shared/utils/format'

export function RecentActivityList({ items }) {
  return h(
    'div',
    {
      className: 'rounded-xl border border-slate-200 bg-white p-6 shadow-sm',
    },
    h(
      'h2',
      { className: 'text-lg font-semibold text-slate-900' },
      'Aktivitas Terbaru',
    ),
    items.length > 0
      ? h(
          'div',
          { className: 'mt-4 divide-y divide-slate-100' },
          items.map((item) =>
            h(
              'div',
              {
                key: item.id,
                className:
                  'flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0',
              },
              h(
                'div',
                { className: 'min-w-0' },
                h(
                  'p',
                  {
                    className: 'truncate text-sm font-medium text-slate-900',
                  },
                  item.fileName,
                ),
                h(
                  'p',
                  { className: 'text-xs text-slate-500' },
                  formatDateTime(item.timestamp),
                  item.workerId &&
                    h(
                      'span',
                      { className: 'text-slate-400' },
                      ` · ${item.workerId}`,
                    ),
                ),
              ),
              h(DocumentStatusBadge, { status: item.status }),
            ),
          ),
        )
      : h(
          'p',
          {
            className:
              'mt-4 rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500',
          },
          'Belum ada aktivitas.',
        ),
  )
}