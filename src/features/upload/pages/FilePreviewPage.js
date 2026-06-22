import { createElement as h, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { renderAsync } from 'docx-preview'
import { AlertCircle, FileText, Loader2, X } from 'lucide-react'
import {
  getFileTypeLabel,
  isDocxFile,
} from '@/features/upload/utils/filePreview'
import {
  getPreviewEntry,
  revokePreview,
} from '@/features/upload/utils/previewSession'
import { formatFileSize } from '@/shared/utils/format'

export function FilePreviewPage() {
  const { previewId } = useParams()
  const docxContainerRef = useRef(null)
  const [entry, setEntry] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [previewError, setPreviewError] = useState(null)

  useEffect(() => {
    if (!previewId) {
      setPreviewError('Preview tidak ditemukan.')
      setIsLoading(false)
      return undefined
    }

    const previewEntry = getPreviewEntry(previewId)
    if (!previewEntry) {
      setPreviewError('Preview sudah tidak tersedia. Buka ulang dari halaman upload.')
      setIsLoading(false)
      return undefined
    }

    setEntry(previewEntry)

    const loadDocxPreview = async () => {
      if (!isDocxFile(previewEntry.file)) {
        setPreviewError('Preview halaman ini hanya untuk dokumen DOCX.')
        setIsLoading(false)
        return
      }

      try {
        const container = docxContainerRef.current
        if (!container) return

        container.innerHTML = ''
        await renderAsync(previewEntry.file, container, undefined, {
          className: 'docx-preview-panel',
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
        })
        setIsLoading(false)
      } catch (err) {
        setPreviewError(
          err instanceof Error ? err.message : 'Gagal memuat preview dokumen.',
        )
        setIsLoading(false)
      }
    }

    void loadDocxPreview()

    const handleUnload = () => revokePreview(previewId)
    window.addEventListener('beforeunload', handleUnload)

    return () => {
      window.removeEventListener('beforeunload', handleUnload)
      if (docxContainerRef.current) {
        docxContainerRef.current.innerHTML = ''
      }
    }
  }, [previewId])

  return h(
    'div',
    { className: 'flex min-h-screen flex-col bg-slate-100' },
    h(
      'header',
      {
        className:
          'flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3 shadow-sm',
      },
      h(
        'div',
        { className: 'flex min-w-0 items-center gap-3' },
        h(
          'div',
          {
            className:
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-100',
          },
          h(FileText, { className: 'h-4 w-4 text-primary-600' }),
        ),
        entry
          ? h(
              'div',
              { className: 'min-w-0' },
              h(
                'p',
                { className: 'truncate text-sm font-semibold text-slate-900' },
                entry.fileName,
              ),
              h(
                'p',
                { className: 'text-xs text-slate-500' },
                `${getFileTypeLabel(entry.file)} · ${formatFileSize(entry.file.size)}`,
              ),
            )
          : h('p', { className: 'text-sm font-medium text-slate-700' }, 'Preview Dokumen'),
      ),
      h(
        'button',
        {
          type: 'button',
          className:
            'inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50',
          onClick: () => window.close(),
        },
        h(X, { className: 'h-4 w-4' }),
        'Tutup',
      ),
    ),
    h(
      'main',
      { className: 'relative flex-1' },
      isLoading &&
        h(
          'div',
          {
            className:
              'absolute inset-0 z-10 flex items-center justify-center bg-white/80 text-slate-500',
          },
          h(Loader2, { className: 'mr-2 h-5 w-5 animate-spin' }),
          'Memuat preview...',
        ),
      previewError &&
        h(
          'div',
          {
            className:
              'mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center',
          },
          h(AlertCircle, { className: 'mb-3 h-10 w-10 text-danger-500' }),
          h(
            'p',
            { className: 'text-base font-medium text-danger-700' },
            'Preview tidak tersedia',
          ),
          h('p', { className: 'mt-2 text-sm text-danger-600' }, previewError),
        ),
      !previewError &&
        h(
          'div',
          {
            className:
              'h-full min-h-[calc(100vh-65px)] overflow-auto bg-white p-6 [&_.docx-wrapper]:bg-white',
          },
          h('div', { ref: docxContainerRef }),
        ),
    ),
  )
}