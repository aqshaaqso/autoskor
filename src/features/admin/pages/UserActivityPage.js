import { createElement as h, useCallback, useEffect, useState } from 'react'
import {
  Activity,
  FileUp,
  Loader2,
  RefreshCw,
  Upload,
  Users,
} from 'lucide-react'
import { getAdminOverview } from '../api/adminApi'
import { StatCard } from '@/shared/ui/StatCard'
import { UserStatsTable } from '../components/UserStatsTable'
import { ActivityLogTable } from '../components/ActivityLogTable'

const POLL_INTERVAL_MS = 5000

const btnSecondary =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50'

export function UserActivityPage() {
  const [overview, setOverview] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadOverview = useCallback(async () => {
    try {
      const data = await getAdminOverview()
      setOverview(data)
      setError(null)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Gagal memuat aktivitas pengguna.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadOverview()
  }, [loadOverview])

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        void loadOverview()
      }
    }, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [loadOverview])

  const isInitialLoading = isLoading && !overview

  return h(
    'div',
    { className: 'mx-auto max-w-6xl px-6 py-8' },
    h(
      'div',
      { className: 'mb-8 flex items-start justify-between gap-4' },
      h(
        'div',
        null,
        h(
          'div',
          { className: 'mb-2 flex items-center gap-2' },
          h(Users, { className: 'h-6 w-6 text-primary-600' }),
          h(
            'h1',
            { className: 'text-2xl font-bold text-slate-900' },
            'Aktivitas Pengguna',
          ),
        ),
        h(
          'p',
          { className: 'text-slate-500' },
          'Pantau siapa yang upload dokumen dan statistik penggunaan per akun.',
        ),
      ),
      h(
        'button',
        {
          type: 'button',
          className: btnSecondary,
          onClick: () => void loadOverview(),
          disabled: isLoading,
        },
        isLoading
          ? h(Loader2, { className: 'h-4 w-4 animate-spin' })
          : h(RefreshCw, { className: 'h-4 w-4' }),
        'Muat Ulang',
      ),
    ),
    error &&
      h(
        'div',
        {
          className:
            'mb-4 rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700',
        },
        error,
      ),
    isInitialLoading
      ? h(
          'div',
          {
            className:
              'flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16 text-slate-500',
          },
          h(Loader2, { className: 'mr-2 h-5 w-5 animate-spin' }),
          'Memuat aktivitas pengguna...',
        )
      : overview &&
          h(
            'div',
            { className: 'space-y-6' },
            h(
              'div',
              { className: 'grid gap-4 sm:grid-cols-2 xl:grid-cols-4' },
              h(StatCard, {
                icon: Users,
                label: 'Total Pengguna',
                value: String(overview.totals.userCount),
                hint: 'Akun terdaftar',
                accentClass: 'bg-primary-50 text-primary-700',
              }),
              h(StatCard, {
                icon: Upload,
                label: 'Total Upload',
                value: String(overview.totals.totalUploads),
                hint: 'Semua dokumen',
                accentClass: 'bg-success-50 text-success-700',
              }),
              h(StatCard, {
                icon: FileUp,
                label: 'Dalam Antrian',
                value: String(overview.totals.pendingDocuments),
                hint: 'Queued + processing',
                accentClass: 'bg-warning-50 text-warning-700',
              }),
              h(StatCard, {
                icon: Activity,
                label: 'Log Aktivitas',
                value: String(overview.totals.activityCount),
                hint: 'Login & upload',
                accentClass: 'bg-slate-100 text-slate-700',
              }),
            ),
            h(
              'div',
              {
                className:
                  'overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm',
              },
              h(
                'div',
                { className: 'border-b border-slate-200 px-6 py-4' },
                h(
                  'h2',
                  { className: 'text-lg font-semibold text-slate-900' },
                  'Statistik per Pengguna',
                ),
                h(
                  'p',
                  { className: 'mt-1 text-sm text-slate-500' },
                  'Ringkasan upload dan aktivitas terakhir setiap akun.',
                ),
              ),
              h(UserStatsTable, { users: overview.users }),
            ),
            h(
              'div',
              {
                className:
                  'overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm',
              },
              h(
                'div',
                { className: 'border-b border-slate-200 px-6 py-4' },
                h(
                  'h2',
                  { className: 'text-lg font-semibold text-slate-900' },
                  'Log Aktivitas Terbaru',
                ),
                h(
                  'p',
                  { className: 'mt-1 text-sm text-slate-500' },
                  'Riwayat login dan upload.',
                ),
              ),
              h(ActivityLogTable, { entries: overview.recentActivity }),
            ),
          ),
  )
}