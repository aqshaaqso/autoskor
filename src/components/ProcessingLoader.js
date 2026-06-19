import { createElement as h } from 'react'

export function ProcessingLoader() {
  return h(
    'div',
    {
      className:
        'flex flex-col items-center justify-center rounded-xl border border-primary-200 bg-primary-50 px-8 py-12',
    },
    h(
      'div',
      { className: 'relative mb-6' },
      h('div', {
        className:
          'h-16 w-16 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600',
        role: 'status',
        'aria-label': 'Memuat',
      }),
    ),
    h(
      'h3',
      { className: 'text-lg font-semibold text-primary-800' },
      'Sedang memproses dokumen...',
    ),
    h(
      'p',
      { className: 'mt-2 max-w-md text-center text-sm text-primary-600' },
      'Mohon tunggu, sistem sedang mengekstrak data dan menghitung skor penilaian kesehatan koperasi.',
    ),
    h(
      'div',
      { className: 'mt-6 flex gap-1' },
      [0, 1, 2].map((i) =>
        h('div', {
          key: i,
          className: 'h-2 w-2 animate-bounce rounded-full bg-primary-400',
          style: { animationDelay: `${i * 150}ms` },
        }),
      ),
    ),
  )
}