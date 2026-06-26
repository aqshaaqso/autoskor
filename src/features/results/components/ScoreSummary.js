import { createElement as h } from 'react'
import { getPredikatClasses } from '@/shared/utils/colorGrading'
import { formatPersentase, formatSkor } from '@/shared/utils/format'

export function ScoreSummary({ results }) {
  const predikatClass = getPredikatClasses(results.predikat)
  const bobotParsial = results.bobotDapatDihitung ?? 85

  return h(
    'div',
    { className: 'rounded-xl border border-slate-200 bg-white p-6 shadow-sm' },
    h(
      'h3',
      { className: 'mb-4 text-lg font-semibold text-slate-800' },
      'Ringkasan Penilaian',
    ),
    h(
      'div',
      { className: 'grid gap-4 sm:grid-cols-3' },
      h(
        'div',
        { className: 'rounded-lg bg-slate-50 p-4 text-center' },
        h(
          'p',
          { className: 'text-sm font-medium text-slate-500' },
          'Skor Parsial (Dapat Dihitung)',
        ),
        h(
          'p',
          { className: 'mt-1 text-3xl font-bold text-slate-900' },
          formatSkor(results.totalSkorParsial),
          h(
            'span',
            { className: 'text-lg font-normal text-slate-400' },
            ` / ${bobotParsial}`,
          ),
        ),
      ),
      h(
        'div',
        { className: 'rounded-lg bg-slate-50 p-4 text-center' },
        h(
          'p',
          { className: 'text-sm font-medium text-slate-500' },
          'Persentase Parsial',
        ),
        h(
          'p',
          { className: 'mt-1 text-3xl font-bold text-primary-600' },
          formatPersentase(results.persentaseParsial),
        ),
      ),
      h(
        'div',
        {
          className:
            'flex flex-col items-center justify-center rounded-lg bg-slate-50 p-4',
        },
        h(
          'p',
          { className: 'text-sm font-medium text-slate-500' },
          'Predikat Kesehatan',
        ),
        h(
          'span',
          {
            className: `mt-2 rounded-full px-6 py-2 text-lg font-bold tracking-wide ${predikatClass}`,
          },
          results.predikat,
        ),
      ),
    ),
    results.tidakDapatDihitung &&
      h(
        'p',
        { className: 'mt-4 text-xs text-slate-500' },
        `Aspek Manajemen (${results.tidakDapatDihitung.bobot} bobot) tidak dihitung karena data non-keuangan tidak tersedia dalam dokumen.`,
      ),
  )
}