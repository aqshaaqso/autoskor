import { createElement as h } from 'react'
import { formatDateTime } from '@/shared/utils/format'
import { getRoleBadgeClasses } from '../utils/badges'

export function UserStatsTable({ users }) {
  if (users.length === 0) {
    return h(
      'p',
      {
        className: 'px-6 py-10 text-center text-sm text-slate-500',
      },
      'Belum ada data pengguna.',
    )
  }

  return h(
    'div',
    { className: 'overflow-x-auto' },
    h(
      'table',
      { className: 'w-full min-w-[800px] text-left text-sm' },
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
            'Pengguna',
          ),
          h(
            'th',
            {
              className: 'px-4 py-3 font-semibold text-slate-700',
            },
            'Role',
          ),
          h(
            'th',
            {
              className: 'px-4 py-3 font-semibold text-slate-700',
            },
            'Upload',
          ),
          h(
            'th',
            {
              className: 'px-4 py-3 font-semibold text-slate-700',
            },
            'Selesai',
          ),
          h(
            'th',
            {
              className: 'px-4 py-3 font-semibold text-slate-700',
            },
            'Antrian',
          ),
          h(
            'th',
            {
              className: 'px-4 py-3 font-semibold text-slate-700',
            },
            'Aktivitas Terakhir',
          ),
        ),
      ),
      h(
        'tbody',
        null,
        users.map((user) =>
          h(
            'tr',
            {
              key: user.id,
              className:
                'border-b border-slate-100 transition-colors hover:bg-slate-50/80',
            },
            h(
              'td',
              { className: 'px-4 py-3' },
              h(
                'p',
                { className: 'font-medium text-slate-800' },
                user.name,
              ),
              h(
                'p',
                { className: 'text-xs text-slate-500' },
                user.email,
              ),
            ),
            h(
              'td',
              { className: 'px-4 py-3' },
              h(
                'span',
                {
                  className: `inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getRoleBadgeClasses(user.role)}`,
                },
                user.role,
              ),
            ),
            h(
              'td',
              { className: 'px-4 py-3 text-slate-700' },
              String(user.uploadCount),
            ),
            h(
              'td',
              { className: 'px-4 py-3 text-slate-700' },
              String(user.completedCount),
            ),
            h(
              'td',
              { className: 'px-4 py-3 text-slate-700' },
              String(user.pendingCount),
            ),
            h(
              'td',
              { className: 'px-4 py-3 text-slate-600' },
              formatDateTime(user.lastActivityAt),
            ),
          ),
        ),
      ),
    ),
  )
}