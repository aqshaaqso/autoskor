import { createElement as h, useState } from 'react'
import { ChevronDown, Database } from 'lucide-react'
import { getConsecutiveAspekMeta } from '@/shared/constants/aspek'
import { getExtractedIndicatorsSummary } from '@/shared/utils/extractedIndicators'

function IndicatorRow({ item, showAspek, aspekRowSpan }) {
  return h(
    'tr',
    { className: 'border-b border-slate-100 transition-colors hover:bg-slate-50/80' },
    showAspek &&
      h(
        'td',
        {
          className: 'px-4 py-3 align-top font-medium text-slate-800',
          rowSpan: aspekRowSpan,
        },
        item.aspek,
      ),
    h('td', { className: 'px-4 py-3 text-slate-600' }, item.label),
    h(
      'td',
      {
        className: `px-4 py-3 text-right font-mono ${
          item.isAvailable ? 'text-slate-800' : 'text-slate-400'
        }`,
      },
      item.displayValue,
    ),
    h(
      'td',
      { className: 'px-4 py-3 text-center' },
      h(
        'span',
        {
          className: `inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
            item.isAvailable
              ? 'border-success-500/30 bg-success-100 text-success-700'
              : 'border-slate-300 bg-slate-100 text-slate-500'
          }`,
        },
        item.isAvailable ? 'Tersedia' : 'Tidak ada',
      ),
    ),
  )
}

export function ExtractedIndicatorsPanel({ extractedIndicators }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!extractedIndicators?.hasData) return null

  const summary = getExtractedIndicatorsSummary(extractedIndicators)
  const aspekMeta = getConsecutiveAspekMeta(extractedIndicators.items)

  return h(
    'div',
    { className: 'overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm' },
    h(
      'button',
      {
        type: 'button',
        onClick: () => setIsOpen((open) => !open),
        className:
          'flex w-full items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-6 py-4 text-left transition-colors hover:bg-slate-100',
        'aria-expanded': isOpen,
      },
      h(
        'div',
        { className: 'flex min-w-0 items-start gap-3' },
        h(Database, { className: 'mt-0.5 h-5 w-5 shrink-0 text-primary-600' }),
        h(
          'div',
          { className: 'min-w-0' },
          h(
            'h3',
            { className: 'text-lg font-semibold text-slate-800' },
            'Indikator yang Diekstrak',
          ),
          h('p', { className: 'mt-1 truncate text-sm text-slate-500' }, summary.title),
          h('p', { className: 'mt-1 text-xs text-slate-400' }, summary.subtitle),
        ),
      ),
      h(ChevronDown, {
        className: `h-5 w-5 shrink-0 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`,
      }),
    ),
    isOpen &&
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
              { className: 'border-b border-slate-200 bg-white' },
              h('th', { className: 'px-4 py-3 font-semibold text-slate-700' }, 'Aspek'),
              h('th', { className: 'px-4 py-3 font-semibold text-slate-700' }, 'Indikator'),
              h(
                'th',
                { className: 'px-4 py-3 text-right font-semibold text-slate-700' },
                'Nilai Diekstrak',
              ),
              h(
                'th',
                { className: 'px-4 py-3 text-center font-semibold text-slate-700' },
                'Status',
              ),
            ),
          ),
          h(
            'tbody',
            null,
            extractedIndicators.items.map((item, index) => {
              const { showAspek, aspekRowSpan } = aspekMeta[index]

              return h(IndicatorRow, {
                key: item.key,
                item,
                showAspek,
                aspekRowSpan,
              })
            }),
          ),
        ),
      ),
  )
}