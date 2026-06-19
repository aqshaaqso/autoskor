import { createElement as h } from 'react'
import { Check, Loader2 } from 'lucide-react'

const STEPS = [
  { label: 'Mengunggah dokumen', threshold: 15 },
  { label: 'Mengekstrak data dari PDF', threshold: 40 },
  { label: 'Menghitung rasio keuangan', threshold: 70 },
  { label: 'Menyusun hasil penilaian', threshold: 90 },
]

function getActiveStepIndex(progress) {
  const index = STEPS.findIndex((step) => progress < step.threshold)
  return index === -1 ? STEPS.length - 1 : Math.max(0, index)
}

export function ProcessingProgress({ step, progress }) {
  const activeIndex = getActiveStepIndex(progress)

  return h(
    'div',
    {
      className:
        'rounded-xl border border-primary-200 bg-white p-6 shadow-sm',
    },
    h(
      'div',
      { className: 'mb-4 flex items-center justify-between gap-4' },
      h(
        'div',
        null,
        h(
          'p',
          { className: 'text-xs font-medium uppercase tracking-wide text-primary-600' },
          'Proses berjalan di background',
        ),
        h(
          'h3',
          { className: 'mt-1 text-base font-semibold text-slate-800' },
          step ?? 'Memproses dokumen...',
        ),
      ),
      h(
        'span',
        { className: 'text-sm font-semibold text-primary-600' },
        `${Math.round(progress)}%`,
      ),
    ),
    h(
      'div',
      { className: 'mb-5 h-2 overflow-hidden rounded-full bg-primary-100' },
      h('div', {
        className:
          'h-full rounded-full bg-primary-600 transition-all duration-500 ease-out',
        style: { width: `${progress}%` },
      }),
    ),
    h(
      'ul',
      { className: 'space-y-3' },
      STEPS.map((item, index) => {
        const isDone = progress >= item.threshold
        const isActive = index === activeIndex && !isDone

        return h(
          'li',
          {
            key: item.label,
            className: 'flex items-center gap-3 text-sm',
          },
          isDone
            ? h(Check, { className: 'h-4 w-4 shrink-0 text-success-600' })
            : isActive
              ? h(Loader2, {
                  className: 'h-4 w-4 shrink-0 animate-spin text-primary-600',
                })
              : h('span', {
                  className: 'h-4 w-4 shrink-0 rounded-full border-2 border-slate-200',
                }),
          h(
            'span',
            {
              className: isDone
                ? 'text-slate-500'
                : isActive
                  ? 'font-medium text-slate-800'
                  : 'text-slate-400',
            },
            item.label,
          ),
        )
      }),
    ),
    h(
      'p',
      { className: 'mt-4 text-xs text-slate-500' },
      'Area upload tetap terbuka. Hasil akan muncul otomatis setelah proses selesai.',
    ),
  )
}