import { createElement as h, useEffect, useState } from 'react'
import { AlertCircle, Download, Eye, FileText, Loader2, X } from 'lucide-react'
import { getDocumentById } from '../api/documentsApi'
import { DocumentStatusBadge } from '@/shared/ui'
import { buildDocumentDetailSections } from '../utils/documentDetailFields'
import {
  canPreviewUploadedDocument,
  downloadUploadedDocument,
  openUploadedDocumentPreview,
} from '../utils/openUploadedDocumentPreview'
import { useUiStore } from '@/shared/store'

export function DocumentDetailModal({
  documentId,
  initialDocument,
  isOpen,
  onClose,
  showUploader = false,
}) {
  const [documentDetail, setDocumentDetail] = useState(initialDocument ?? null)
  const [isLoading, setIsLoading] = useState(false)
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [isDownloadLoading, setIsDownloadLoading] = useState(false)
  const [error, setError] = useState(null)
  const showToast = useUiStore((state) => state.showToast)

  useEffect(() => {
    if (!isOpen) {
      setIsPreviewLoading(false)
      setIsDownloadLoading(false)
      return undefined
    }

    if (!documentId) return undefined

    setDocumentDetail(initialDocument ?? null)
    setError(null)
    setIsLoading(true)

    let cancelled = false

    void getDocumentById(documentId)
      .then((data) => {
        if (!cancelled) {
          setDocumentDetail(data)
          setError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : 'Gagal memuat detail dokumen.'
          setError(message)
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [isOpen, documentId, initialDocument])

  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    globalThis.document.addEventListener('keydown', handleKeyDown)
    return () => globalThis.document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handlePreview = async () => {
    if (!documentDetail || isPreviewLoading || isDownloadLoading) return

    setIsPreviewLoading(true)
    try {
      await openUploadedDocumentPreview(documentDetail)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Gagal membuka preview dokumen.'
      showToast(message, 'error')
    } finally {
      setIsPreviewLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!documentDetail || isDownloadLoading || isPreviewLoading) return

    setIsDownloadLoading(true)
    try {
      await downloadUploadedDocument(documentDetail)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Gagal mengunduh dokumen.'
      showToast(message, 'error')
    } finally {
      setIsDownloadLoading(false)
    }
  }

  if (!isOpen) return null

  const sections = documentDetail
    ? buildDocumentDetailSections(documentDetail, { showUploader })
    : []
  const canPreview = documentDetail
    ? canPreviewUploadedDocument(documentDetail)
    : false

  return h(
    'div',
    {
      className: 'fixed inset-0 z-50 flex items-center justify-center p-4',
      role: 'presentation',
      onClick: onClose,
    },
    h('div', {
      className: 'absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]',
      'aria-hidden': true,
    }),
    h(
      'div',
      {
        role: 'dialog',
        'aria-modal': true,
        'aria-labelledby': 'document-detail-title',
        className:
          'relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl',
        onClick: (event) => event.stopPropagation(),
      },
      h(
        'div',
        {
          className:
            'flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4',
        },
        h(
          'div',
          { className: 'flex min-w-0 items-start gap-3' },
          h(
            'div',
            {
              className:
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100',
            },
            h(FileText, { className: 'h-5 w-5 text-primary-600' }),
          ),
          h(
            'div',
            { className: 'min-w-0' },
            h(
              'h2',
              {
                id: 'document-detail-title',
                className: 'truncate text-lg font-semibold text-slate-900',
              },
              documentDetail?.fileName ?? 'Detail Dokumen',
            ),
            h(
              'p',
              { className: 'mt-1 text-sm text-slate-500' },
              'Informasi lengkap file dan status pemrosesan',
            ),
          ),
        ),
        h(
          'button',
          {
            type: 'button',
            onClick: onClose,
            className:
              'rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600',
            'aria-label': 'Tutup detail dokumen',
          },
          h(X, { className: 'h-5 w-5' }),
        ),
      ),
      h(
        'div',
        { className: 'overflow-y-auto px-6 py-5' },
        isLoading &&
          !documentDetail &&
          h(
            'div',
            {
              className:
                'flex items-center justify-center py-12 text-sm text-slate-500',
            },
            h(Loader2, { className: 'mr-2 h-5 w-5 animate-spin' }),
            'Memuat detail...',
          ),
        error &&
          h(
            'div',
            {
              className:
                'flex items-start gap-2 rounded-lg border border-danger-200 bg-danger-50 px-3 py-2.5 text-sm text-danger-700',
            },
            h(AlertCircle, { className: 'mt-0.5 h-4 w-4 shrink-0' }),
            h('span', null, error),
          ),
        documentDetail &&
          h(
            'div',
            { className: 'space-y-5' },
            h(
              'div',
              { className: 'flex items-center gap-2' },
              h(DocumentStatusBadge, { status: documentDetail.status }),
              isLoading &&
                h(Loader2, {
                  className: 'h-4 w-4 animate-spin text-slate-400',
                }),
            ),
            sections.map((section) =>
              h(
                'div',
                { key: section.title },
                h(
                  'h3',
                  {
                    className:
                      'mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500',
                  },
                  section.title,
                ),
                h(
                  'dl',
                  { className: 'space-y-2.5' },
                  section.rows.map((row) =>
                    h(
                      'div',
                      {
                        key: `${section.title}-${row.label}`,
                        className:
                          'grid grid-cols-[140px_1fr] gap-3 rounded-lg bg-slate-50 px-3 py-2.5',
                      },
                      h(
                        'dt',
                        { className: 'text-sm font-medium text-slate-500' },
                        row.label,
                      ),
                      h(
                        'dd',
                        {
                          className:
                            'break-all text-sm font-medium text-slate-800',
                        },
                        row.value,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
      ),
      h(
        'div',
        {
          className:
            'flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4',
        },
        documentDetail &&
          h(
            'button',
            {
              type: 'button',
              disabled: isDownloadLoading || isLoading || isPreviewLoading,
              onClick: () => void handleDownload(),
              className:
                'inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60',
              title: 'Unduh file asli',
            },
            isDownloadLoading
              ? h(Loader2, { className: 'h-4 w-4 animate-spin' })
              : h(Download, { className: 'h-4 w-4' }),
            isDownloadLoading ? 'Mengunduh...' : 'Unduh',
          ),
        canPreview &&
          h(
            'button',
            {
              type: 'button',
              disabled: isPreviewLoading || isLoading || isDownloadLoading,
              onClick: () => void handlePreview(),
              className:
                'inline-flex items-center justify-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-60',
              title: 'Buka preview di tab browser baru',
            },
            isPreviewLoading
              ? h(Loader2, { className: 'h-4 w-4 animate-spin' })
              : h(Eye, { className: 'h-4 w-4' }),
            isPreviewLoading ? 'Membuka...' : 'Preview',
          ),
        h(
          'button',
          {
            type: 'button',
            onClick: onClose,
            className:
              'rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100',
          },
          'Tutup',
        ),
      ),
    ),
  )
}