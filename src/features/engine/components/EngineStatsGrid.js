import { createElement as h } from 'react'
import {
  Activity,
  CheckCircle2,
  Clock3,
  Timer,
} from 'lucide-react'
import { StatCard } from '@/shared/ui/StatCard'

export function EngineStatsGrid({ engineStatus }) {
  return h(
    'div',
    { className: 'grid gap-4 sm:grid-cols-2 xl:grid-cols-4' },
    h(StatCard, {
      icon: Clock3,
      label: 'Dalam Antrian',
      value: String(engineStatus.queueLength),
      hint: 'Menunggu worker',
      accentClass: 'bg-warning-50 text-warning-700',
    }),
    h(StatCard, {
      icon: Activity,
      label: 'Sedang Diproses',
      value: String(engineStatus.processingCount),
      hint: 'Jumlah Dokumen',
      accentClass: 'bg-primary-50 text-primary-700',
    }),
    h(StatCard, {
      icon: Timer,
      label: 'Selesai Diproses',
      value: String(engineStatus.processedToday),
      hint: 'Dokumen Selesai',
      accentClass: 'bg-success-50 text-success-700',
    }),
    h(StatCard, {
      icon: CheckCircle2,
      label: 'Total Selesai',
      value: String(engineStatus.completedTotal),
      hint:
        engineStatus.failedTotal > 0
          ? `${engineStatus.failedTotal} gagal`
          : 'Semua berhasil',
      accentClass: 'bg-slate-100 text-slate-700',
    }),
  )
}