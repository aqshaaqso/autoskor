import { createElement as h } from 'react'
import { EngineColumnCard } from './EngineColumnCard'

function buildEmptyMessage(healthStatus) {
  if (healthStatus === 'down') {
    return 'Engine sedang offline. Data worker belum tersedia.'
  }

  if (healthStatus && healthStatus !== 'healthy') {
    return `Status engine: ${healthStatus}. Data worker belum tersedia.`
  }

  return 'Tidak ada engine.'
}

export function EngineWorkersGrid({
  engines = [],
  healthStatus = null,
  emptyMessage,
}) {
  if (!engines.length) {
    return h(
      'div',
      {
        className:
          'rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center',
      },
      h(
        'p',
        { className: 'text-sm text-slate-500' },
        emptyMessage ?? buildEmptyMessage(healthStatus),
      ),
    )
  }

  return h(
    'div',
    {
      className: 'grid grid-cols-1 gap-6 sm:grid-cols-2',
    },
    engines.map((engine) =>
      h(EngineColumnCard, { key: engine.id, engine }),
    ),
  )
}