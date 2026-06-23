import { createElement as h, useEffect } from 'react'
import { Download, X } from 'lucide-react'

export function ResultPdfPreviewModal({
  isOpen,
  previewUrl,
  fileName,
  isDownloadLoading = false,
  onClose,
  onDownload,
}) {
  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    globalThis.document.addEventListener('keydown', handleKeyDown)
    return () => globalThis.document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !previewUrl) return null

  return h(
    'div',
    {
      className: 'fixed inset-0 z-[70] flex items-center justify-center p-4',
      role: 'presentation',
      onClick: onClose,
    },
    h('div', {
      className: 'absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]',
      'aria-hidden': true,
    }),
    h(
      'div',
      {
        role: 'dialog',
        'aria-modal': true,
        'aria-label': 'Pratinjau PDF hasil penilaian',
        className:
          'relative z-10 flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl',
        onClick: (event) => event.stopPropagation(),
      },
      h(
        'div',
        {
          className:
            'flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4',
        },
        h(
          'div',
          { className: 'min-w-0' },
          h(
            'h2',
            { className: 'truncate text-base font-semibold text-slate-900' },
            'Pratinjau PDF',
          ),
          h(
            'p',
            { className: 'truncate text-sm text-slate-500' },
            fileName,
          ),
        ),
        h(
          'div',
          { className: 'flex shrink-0 items-center gap-2' },
          h(
            'button',
            {
              type: 'button',
              onClick: onDownload,
              disabled: isDownloadLoading,
              className:
                'inline-flex items-center justify-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-60',
            },
            h(Download, { className: 'h-4 w-4' }),
            isDownloadLoading ? 'Mengunduh...' : 'Unduh',
          ),
          h(
            'button',
            {
              type: 'button',
              onClick: onClose,
              className:
                'inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-100',
              title: 'Tutup pratinjau',
            },
            h(X, { className: 'h-4 w-4' }),
          ),
        ),
      ),
      h(
        'div',
        { className: 'flex-1 bg-slate-100' },
        h('iframe', {
          title: `Pratinjau ${fileName}`,
          src: previewUrl,
          className: 'h-full w-full border-0 bg-white',
        }),
      ),
    ),
  )
}