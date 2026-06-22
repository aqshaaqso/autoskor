import { createElement as h } from 'react'

export function UploadProgress({
  progress,
  queueTotal = 0,
  fileName = null,
}) {
  const showQueue = queueTotal > 1

  return h(
    'div',
    { className: 'rounded-xl border border-primary-200 bg-white p-4 shadow-sm' },
    h(
      'div',
      { className: 'mb-2 flex items-center justify-between gap-4' },
      h(
        'div',
        { className: 'min-w-0' },
        h(
          'p',
          { className: 'text-sm font-medium text-slate-800' },
          showQueue
            ? `Mengupload dokumen (${queueTotal} dalam antrian)...`
            : 'Mengupload dokumen...',
        ),
        fileName &&
          h(
            'p',
            { className: 'truncate text-xs text-slate-500' },
            fileName,
          ),
      ),
      h(
        'span',
        { className: 'shrink-0 text-sm font-semibold text-primary-600' },
        `${Math.round(progress)}%`,
      ),
    ),
    h(
      'div',
      { className: 'h-2 overflow-hidden rounded-full bg-primary-100' },
      h('div', {
        className:
          'h-full rounded-full bg-primary-600 transition-all duration-300 ease-out',
        style: { width: `${progress}%` },
      }),
    ),
  )
}