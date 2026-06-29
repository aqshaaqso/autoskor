import { createElement as h, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import { useDocumentStore } from '../store/useDocumentStore'
import { DownloadResultPdfButton } from '../components/DownloadResultPdfButton'
import {
  ExtractedIndicatorsPanel,
  ResultsTable,
  ScoreSummary,
  TidakDapatDihitungPanel,
} from '@/features/results'

export function ProcessedDetailPage() {
  const { id } = useParams()
  const {
    documentResult,
    isLoadingResult,
    resultError,
    fetchDocumentResults,
    clearDocumentResult,
  } = useDocumentStore()

  useEffect(() => {
    if (id) void fetchDocumentResults(id)
    return () => clearDocumentResult()
  }, [id, fetchDocumentResults, clearDocumentResult])

  const hasSidePanel = Boolean(documentResult?.results?.tidakDapatDihitung)

  return h(
    'div',
    { className: 'mx-auto max-w-7xl px-6 py-8' },
    h(
      Link,
      {
        to: '/processed',
        className:
          'mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900',
      },
      h(ArrowLeft, { className: 'h-4 w-4' }),
      'Kembali ke Daftar Selesai',
    ),
    isLoadingResult &&
      h(
        'div',
        { className: 'flex items-center justify-center py-16 text-slate-500' },
        h(Loader2, { className: 'mr-2 h-5 w-5 animate-spin' }),
        'Memuat hasil penilaian...',
      ),
    resultError &&
      h(
        'div',
        {
          className:
            'flex items-start gap-3 rounded-lg border border-danger-200 bg-danger-50 p-4',
        },
        h(AlertCircle, { className: 'mt-0.5 h-5 w-5 shrink-0 text-danger-600' }),
        h('p', { className: 'text-sm text-danger-700' }, resultError),
      ),
    documentResult?.isFailed &&
      h(
        'div',
        { className: 'space-y-4' },
        h(
          'div',
          null,
          h(
            'h1',
            { className: 'text-2xl font-bold text-slate-900' },
            'Penilaian Gagal',
          ),
          h(
            'p',
            { className: 'mt-2 text-slate-500' },
            documentResult.document.fileName,
          ),
        ),
        h(
          'div',
          {
            className:
              'rounded-xl border border-danger-200 bg-danger-50 p-6 shadow-sm',
          },
          h(
            'h3',
            { className: 'text-sm font-semibold text-danger-800' },
            'Dokumen tidak berhasil diproses',
          ),
          h(
            'p',
            { className: 'mt-2 text-sm text-danger-700' },
            documentResult.document.failureReason ??
              'Worker gagal memproses dokumen ini. Silakan unggah ulang atau hubungi administrator.',
          ),
        ),
      ),
    documentResult?.results &&
      h(
        'div',
        { className: 'space-y-6' },
        h(
          'div',
          {
            className:
              'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
          },
          h(
            'div',
            null,
            h(
              'h1',
              { className: 'text-2xl font-bold text-slate-900' },
              'Hasil Penilaian',
            ),
            h(
              'p',
              { className: 'mt-2 text-slate-500' },
              documentResult.document.fileName,
            ),
          ),
          h(DownloadResultPdfButton, { documentResult }),
        ),
        h(ScoreSummary, { results: documentResult.results }),
        h(ResultsTable, { detail: documentResult.results.detail }),
        hasSidePanel &&
          h(TidakDapatDihitungPanel, {
            data: documentResult.results.tidakDapatDihitung,
          }),
        h(ExtractedIndicatorsPanel, {
          extractedIndicators: documentResult.results.extractedIndicators,
        }),
      ),
  )
}