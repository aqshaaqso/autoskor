import { createElement as h } from 'react'
import { StatusBadge } from './StatusBadge'
import { formatNumber, formatRasio, formatSkor } from '@/shared/utils/format'

function ScoreRow({ row, showAspek, aspekRowSpan }) {
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
        row.aspek,
      ),
    h('td', { className: 'px-4 py-3 text-slate-600' }, row.komponen),
    h(
      'td',
      { className: 'px-4 py-3 text-right font-mono text-slate-700' },
      formatRasio(row.nilaiRasio),
    ),
    h(
      'td',
      { className: 'px-4 py-3 text-right text-slate-700' },
      formatNumber(row.nilai, 0),
    ),
    h('td', { className: 'px-4 py-3 text-right text-slate-700' }, row.bobot),
    h(
      'td',
      { className: 'px-4 py-3 text-right font-medium text-slate-800' },
      formatSkor(row.skor),
    ),
    h(
      'td',
      { className: 'px-4 py-3 text-right text-slate-700' },
      `${formatNumber(row.persentaseMaks, 0)}%`,
    ),
    h(
      'td',
      { className: 'px-4 py-3 text-center' },
      h(StatusBadge, { status: row.status }),
    ),
  )
}

function getConsecutiveAspekMeta(detail) {
  return detail.map((row, index) => {
    const isGroupStart =
      index === 0 || detail[index - 1].aspek !== row.aspek

    if (!isGroupStart) {
      return { showAspek: false, aspekRowSpan: 1 }
    }

    let aspekRowSpan = 1
    while (
      index + aspekRowSpan < detail.length &&
      detail[index + aspekRowSpan].aspek === row.aspek
    ) {
      aspekRowSpan += 1
    }

    return { showAspek: true, aspekRowSpan }
  })
}

export function ResultsTable({ detail = [] }) {
  const aspekMeta = getConsecutiveAspekMeta(detail)

  return h(
    'div',
    { className: 'overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm' },
    h(
      'div',
      { className: 'overflow-x-auto' },
      h(
        'table',
        { className: 'w-full min-w-[900px] text-left text-sm' },
        h(
          'thead',
          null,
          h(
            'tr',
            { className: 'border-b border-slate-200 bg-slate-50' },
            h('th', { className: 'px-4 py-3 font-semibold text-slate-700' }, 'Aspek'),
            h(
              'th',
              { className: 'px-4 py-3 font-semibold text-slate-700' },
              'Komponen / Rasio',
            ),
            h(
              'th',
              { className: 'px-4 py-3 text-right font-semibold text-slate-700' },
              'Nilai Rasio',
            ),
            h(
              'th',
              { className: 'px-4 py-3 text-right font-semibold text-slate-700' },
              'Nilai',
            ),
            h(
              'th',
              { className: 'px-4 py-3 text-right font-semibold text-slate-700' },
              'Bobot',
            ),
            h(
              'th',
              { className: 'px-4 py-3 text-right font-semibold text-slate-700' },
              'Skor',
            ),
            h(
              'th',
              { className: 'px-4 py-3 text-right font-semibold text-slate-700' },
              '% thd Maks',
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
          detail.map((row, index) => {
            const { showAspek, aspekRowSpan } = aspekMeta[index]

            return h(ScoreRow, {
              key: `${row.aspek}-${row.komponen}-${index}`,
              row,
              showAspek,
              aspekRowSpan,
            })
          }),
        ),
      ),
    ),
  )
}