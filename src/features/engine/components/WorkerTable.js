import { createElement as h } from 'react'
import { Loader2 } from 'lucide-react'
import { formatDateTime } from '@/shared/utils/format'

function getWorkerStatusLabel(status) {
  switch (status) {
    case 'running':
      return 'Berjalan'
    case 'idle':
    default:
      return 'Siaga'
  }
}

function getWorkerStatusClasses(status) {
  switch (status) {
    case 'running':
      return 'bg-primary-100 text-primary-700 border-primary-500/30'
    case 'idle':
    default:
      return 'bg-success-100 text-success-700 border-success-500/30'
  }
}

export function WorkerTable({
  workers,
  emptyMessage = 'Tidak ada worker.',
  embedded = false,
}) {
  if (!workers?.length) {
    return h(
      'div',
      {
        className: embedded
          ? 'px-2 py-10 text-center'
          : 'rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center',
      },
      h('p', { className: 'text-sm text-slate-500' }, emptyMessage),
    )
  }

  return h(
    'div',
    {
      className: embedded
        ? 'overflow-hidden rounded-lg border border-slate-200'
        : 'overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm',
    },
    h(
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
            { className: 'border-b border-slate-200 bg-slate-50' },
            h('th', { className: 'px-4 py-3 font-semibold text-slate-700' }, 'Worker'),
            h('th', { className: 'px-4 py-3 font-semibold text-slate-700' }, 'Status'),
            h('th', { className: 'px-4 py-3 font-semibold text-slate-700' }, 'Dokumen Aktif'),
            h('th', { className: 'px-4 py-3 font-semibold text-slate-700' }, 'Mulai'),
          ),
        ),
        h(
          'tbody',
          null,
          workers.map((worker) =>
            h(
              'tr',
              {
                key: worker.id,
                className:
                  'border-b border-slate-100 transition-colors hover:bg-slate-50/80',
              },
              h(
                'td',
                { className: 'px-4 py-3' },
                h('p', { className: 'font-medium text-slate-800' }, worker.name),
                h('p', { className: 'text-xs text-slate-500' }, worker.id),
              ),
              h(
                'td',
                { className: 'px-4 py-3' },
                h(
                  'span',
                  {
                    className: `inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getWorkerStatusClasses(worker.status)}`,
                  },
                  worker.status === 'running' &&
                    h(Loader2, { className: 'h-3 w-3 animate-spin' }),
                  getWorkerStatusLabel(worker.status),
                ),
              ),
              h(
                'td',
                { className: 'px-4 py-3 text-slate-700' },
                worker.currentDocument?.fileName ?? '-',
              ),
              h(
                'td',
                { className: 'px-4 py-3 text-slate-600' },
                worker.currentDocument?.startedAt
                  ? formatDateTime(worker.currentDocument.startedAt)
                  : '-',
              ),
            ),
          ),
        ),
      ),
    ),
  )
}