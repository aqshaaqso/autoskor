import { createElement as h } from 'react'
import { Loader2 } from 'lucide-react'
import { formatDateTime } from '@/shared/utils/format'
import {
  getClusterStatusClasses,
  getClusterStatusLabel,
} from '../utils/clusterStatus'

export function ClusterStatusPanel({ engineStatus, clusterStatus }) {
  return h(
    'div',
    {
      className: 'rounded-xl border border-slate-200 bg-white p-6 shadow-sm',
    },
    h(
      'div',
      {
        className:
          'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
      },
      h(
        'div',
        null,
        h(
          'p',
          { className: 'text-sm font-medium text-slate-500' },
          'Status Worker',
        ),
        h(
          'div',
          { className: 'mt-2 flex items-center gap-3' },
          h(
            'span',
            {
              className: `inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${getClusterStatusClasses(clusterStatus)}`,
            },
            getClusterStatusLabel(clusterStatus),
          ),
          engineStatus.isRunning &&
            h(Loader2, {
              className: 'h-4 w-4 animate-spin text-primary-600',
            }),
        ),
        h(
          'p',
          { className: 'mt-2 text-sm text-slate-500' },
          `${engineStatus.activeWorkerCount ?? 0} dari ${engineStatus.workerCount ?? engineStatus.workers?.length ?? 0} worker aktif`,
        ),
      ),
      h(
        'div',
        { className: 'text-sm text-slate-500' },
        h(
          'p',
          null,
          'Aktivitas terakhir: ',
          h(
            'span',
            { className: 'font-medium text-slate-700' },
            formatDateTime(engineStatus.lastActivityAt),
          ),
        ),
        h(
          'p',
          { className: 'mt-1' },
          'Rata-rata proses: ',
          h(
            'span',
            { className: 'font-medium text-slate-700' },
            `${Math.round(engineStatus.averageProcessingMs / 1000)} detik / dokumen`,
          ),
        ),
      ),
    ),
  )
}