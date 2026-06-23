import { createElement as h, useEffect, useState } from 'react'
import { Download, Eye, Loader2 } from 'lucide-react'
import { ResultPdfPreviewModal } from './ResultPdfPreviewModal'
import { useUiStore } from '@/shared/store'

const btnSecondary =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60'

const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-60'

export function DownloadResultPdfButton({ documentResult }) {
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [isDownloadLoading, setIsDownloadLoading] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [previewFileName, setPreviewFileName] = useState('')
  const showToast = useUiStore((state) => state.showToast)

  const loadPdfUtils = () => import('../utils/generateResultPdf')

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const closePreview = () => {
    setIsPreviewOpen(false)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  const handlePreview = () => {
    if (isPreviewLoading || isDownloadLoading || !documentResult) return

    setIsPreviewLoading(true)

    void loadPdfUtils()
      .then(({ createResultPdfBlob, getResultPdfFileName }) => {
        const blob = createResultPdfBlob(documentResult)
        const url = URL.createObjectURL(blob)
        const fileName = getResultPdfFileName(documentResult)

        if (previewUrl) URL.revokeObjectURL(previewUrl)

        setPreviewFileName(fileName)
        setPreviewUrl(url)
        setIsPreviewOpen(true)
      })
      .catch((err) => {
        const message =
          err instanceof Error ? err.message : 'Gagal membuka pratinjau PDF.'
        showToast(message, 'error')
      })
      .finally(() => {
        setIsPreviewLoading(false)
      })
  }

  const handleDownload = () => {
    if (isPreviewLoading || isDownloadLoading || !documentResult) return

    setIsDownloadLoading(true)

    void loadPdfUtils()
      .then(({ downloadResultPdf }) => {
        downloadResultPdf(documentResult)
        showToast('PDF berhasil diunduh.', 'success')
      })
      .catch((err) => {
        const message =
          err instanceof Error ? err.message : 'Gagal mengunduh PDF.'
        showToast(message, 'error')
      })
      .finally(() => {
        setIsDownloadLoading(false)
      })
  }

  return h(
    'div',
    null,
    h(
      'div',
      { className: 'flex flex-wrap items-center gap-2' },
      h(
        'button',
        {
          type: 'button',
          className: btnSecondary,
          disabled: isPreviewLoading || isDownloadLoading,
          onClick: handlePreview,
          title: 'Buka pratinjau PDF di halaman ini',
        },
        isPreviewLoading
          ? h(Loader2, { className: 'h-4 w-4 animate-spin' })
          : h(Eye, { className: 'h-4 w-4' }),
        isPreviewLoading ? 'Membuka...' : 'Pratinjau PDF',
      ),
      h(
        'button',
        {
          type: 'button',
          className: btnPrimary,
          disabled: isPreviewLoading || isDownloadLoading,
          onClick: handleDownload,
          title: 'Unduh laporan hasil penilaian sebagai PDF',
        },
        isDownloadLoading
          ? h(Loader2, { className: 'h-4 w-4 animate-spin' })
          : h(Download, { className: 'h-4 w-4' }),
        isDownloadLoading ? 'Mengunduh...' : 'Unduh PDF',
      ),
    ),
    h(ResultPdfPreviewModal, {
      isOpen: isPreviewOpen,
      previewUrl,
      fileName: previewFileName,
      isDownloadLoading,
      onClose: closePreview,
      onDownload: handleDownload,
    }),
  )
}