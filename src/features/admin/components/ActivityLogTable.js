import { createElement as h } from 'react'
import { formatDateTime } from '@/shared/utils/format'
import { getActivityTypeClasses } from '../utils/badges'

export function ActivityLogTable({ entries }) {
  if (entries.length === 0) {
    return h(
      'p',
      {
        className: 'px-6 py-10 text-center text-sm text-slate-500',
      },
      'Belum ada aktivitas tercatat. Login atau upload untuk melihat log.',
    )
  }

  return h(
    'div',
    { className: 'overflow-x-auto' },
    h(
      'table',
      { className: 'w-full min-w-[720px] text-left text-sm' },
      h(
        'thead',
        null,
        h(
          'tr',
          {
            className: 'border-b border-slate-200 bg-slate-50',
          },
          h(
            'th',
            {
              className: 'px-4 py-3 font-semibold text-slate-700',
            },
            'Waktu',
          ),
          h(
            'th',
            {
              className: 'px-4 py-3 font-semibold text-slate-700',
            },
            'Pengguna',
          ),
          h(
            'th',
            {
              className: 'px-4 py-3 font-semibold text-slate-700',
            },
            'Tipe',
          ),
          h(
            'th',
            {
              className: 'px-4 py-3 font-semibold text-slate-700',
            },
            'Keterangan',
          ),
        ),
      ),
      h(
        'tbody',
        null,
        entries.map((entry) =>
          h(
            'tr',
            {
              key: entry.id,
              className:
                'border-b border-slate-100 transition-colors hover:bg-slate-50/80',
            },
            h(
              'td',
              { className: 'px-4 py-3 text-slate-600' },
              formatDateTime(entry.timestamp),
            ),
            h(
              'td',
              { className: 'px-4 py-3' },
              h(
                'p',
                { className: 'font-medium text-slate-800' },
                entry.userName,
              ),
              h(
                'p',
                { className: 'text-xs text-slate-500' },
                entry.userEmail,
              ),
            ),
            h(
              'td',
              { className: 'px-4 py-3' },
              h(
                'span',
                {
                  className: `inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getActivityTypeClasses(entry.type)}`,
                },
                entry.typeLabel ?? entry.type,
              ),
            ),
            h(
              'td',
              { className: 'px-4 py-3 text-slate-700' },
              entry.description,
            ),
          ),
        ),
      ),
    ),
  )
}