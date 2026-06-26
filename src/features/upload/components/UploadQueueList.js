import { createElement as h } from 'react'
import {
  AlertCircle,
  Clock3,
  Loader2,
  RotateCcw,
  X,
} from 'lucide-react'
import { getQueueStatusLabel, getQueueStatusClasses } from '../constants'
import { formatFileSize } from '@/shared/utils/format'
import { btnGhost } from './buttonStyles'

export function UploadQueueList({
  uploadQueue,
  removeUploadQueueItem,
  retryUploadQueueItem,
}) {
  if (uploadQueue.length === 0) return null

  return h(
    'div',
    {
      className: 'rounded-xl border border-slate-200 bg-white p-4 shadow-sm',
    },
    h(
      'div',
      { className: 'mb-4' },
      h(
        'p',
        { className: 'text-sm font-semibold text-slate-800' },
        `Antrian upload (${uploadQueue.length})`,
      ),
      h(
        'p',
        { className: 'text-sm text-slate-500' },
        'File berhasil diupload. Kamu tetap bisa menambah dokumen baru.',
      ),
    ),
    h(
      'ul',
      { className: 'space-y-2' },
      uploadQueue.map((item) =>
        h(
          'li',
          {
            key: item.id,
            className:
              'flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2',
          },
          h(
            'div',
            { className: 'flex min-w-0 items-center gap-3' },
            item.status === 'uploading'
              ? h(Loader2, {
                  className: 'h-4 w-4 shrink-0 animate-spin text-primary-600',
                })
              : item.status === 'pending'
                ? h(Clock3, {
                    className: 'h-4 w-4 shrink-0 text-warning-600',
                  })
                : h(AlertCircle, {
                    className: 'h-4 w-4 shrink-0 text-danger-600',
                  }),
            h(
              'div',
              { className: 'min-w-0' },
              h(
                'p',
                {
                  className: 'truncate text-sm font-medium text-slate-800',
                },
                item.file.name,
              ),
              h(
                'p',
                { className: 'text-xs text-slate-500' },
                item.error ?? formatFileSize(item.file.size),
              ),
            ),
          ),
          h(
            'div',
            { className: 'flex shrink-0 items-center gap-2' },
            h(
              'span',
              {
                className: `inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${getQueueStatusClasses(item.status)}`,
              },
              getQueueStatusLabel(item.status),
            ),
            item.status === 'failed' &&
              h(
                'button',
                {
                  type: 'button',
                  className: btnGhost,
                  title: 'Coba lagi',
                  onClick: () => retryUploadQueueItem(item.id),
                },
                h(RotateCcw, { className: 'h-4 w-4' }),
              ),
            item.status !== 'uploading' &&
              h(
                'button',
                {
                  type: 'button',
                  className: btnGhost,
                  title: 'Hapus dari antrian',
                  onClick: () => removeUploadQueueItem(item.id),
                },
                h(X, { className: 'h-4 w-4' }),
              ),
          ),
        ),
      ),
    ),
  )
}