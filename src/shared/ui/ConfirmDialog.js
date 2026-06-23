import { createElement as h, useEffect } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel = 'Batal',
  isLoading = false,
  variant = 'danger',
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isLoading) onCancel()
    }

    globalThis.document.addEventListener('keydown', handleKeyDown)
    return () => globalThis.document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isLoading, onCancel])

  if (!isOpen) return null

  const confirmClass =
    variant === 'danger'
      ? 'bg-danger-600 hover:bg-danger-700 focus:ring-danger-500'
      : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'

  return h(
    'div',
    {
      className: 'fixed inset-0 z-[60] flex items-center justify-center p-4',
      role: 'presentation',
      onClick: isLoading ? undefined : onCancel,
    },
    h('div', {
      className: 'absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]',
      'aria-hidden': true,
    }),
    h(
      'div',
      {
        role: 'alertdialog',
        'aria-modal': true,
        'aria-labelledby': 'confirm-dialog-title',
        className:
          'relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl',
        onClick: (event) => event.stopPropagation(),
      },
      h(
        'div',
        { className: 'flex items-start gap-3' },
        h(
          'div',
          {
            className:
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger-50',
          },
          h(AlertTriangle, { className: 'h-5 w-5 text-danger-600' }),
        ),
        h(
          'div',
          { className: 'min-w-0 flex-1' },
          h(
            'h2',
            {
              id: 'confirm-dialog-title',
              className: 'text-lg font-semibold text-slate-900',
            },
            title,
          ),
          h('p', { className: 'mt-2 text-sm text-slate-600' }, message),
        ),
      ),
      h(
        'div',
        { className: 'mt-6 flex justify-end gap-3' },
        h(
          'button',
          {
            type: 'button',
            disabled: isLoading,
            onClick: onCancel,
            className:
              'rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60',
          },
          cancelLabel,
        ),
        h(
          'button',
          {
            type: 'button',
            disabled: isLoading,
            onClick: () => void onConfirm(),
            className: `inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${confirmClass}`,
          },
          isLoading && h(Loader2, { className: 'h-4 w-4 animate-spin' }),
          isLoading ? 'Memproses...' : confirmLabel,
        ),
      ),
    ),
  )
}