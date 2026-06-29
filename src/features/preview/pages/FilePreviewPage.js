import { createElement as h, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { renderAsync } from 'docx-preview'
import DOMPurify from 'dompurify'
import { AlertCircle, Download, FileText, Loader2, X } from 'lucide-react'
import {
  fetchDocumentFile,
  getDocumentById,
  downloadUploadedDocument,
} from '@/features/documents'
import { downloadPreviewFile } from '../utils/downloadPreviewFile'
import { getPreviewEntry, revokePreview } from '../utils/previewSession'
import {
  canPreviewFile,
  getFileTypeLabel,
  isDocxFile,
  isPdfFile,
  toPreviewFile,
} from '@/shared/utils/file'
import { formatFileSize } from '@/shared/utils/format'

export function FilePreviewPage() {
  const { previewId, documentId } = useParams()
  const docxContainerRef = useRef(null)
  const [previewFile, setPreviewFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [documentMeta, setDocumentMeta] = useState(null)
  const [pdfObjectUrl, setPdfObjectUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [previewError, setPreviewError] = useState(null)

  useEffect(() => {
    let cancelled = false

    const fail = (message) => {
      if (cancelled) return
      setPreviewError(message)
      setIsLoading(false)
    }

    const loadDocumentPreview = async () => {
      try {
        const document = await getDocumentById(documentId)
        if (cancelled) return

        if (!document?.fileName) {
          fail('Data dokumen tidak lengkap untuk preview.')
          return
        }

        setDocumentMeta(document)
        setFileName(document.fileName)

        const blob = await fetchDocumentFile(documentId, { disposition: 'inline' })
        if (cancelled) return

        const file = toPreviewFile(blob, document.fileName, document.mimeType)

        if (!canPreviewFile(file)) {
          fail('Format file tidak mendukung preview. Gunakan PDF atau DOCX.')
          return
        }

        setPreviewFile(file)
      } catch (err) {
        fail(
          err instanceof Error ? err.message : 'Gagal memuat preview dokumen.',
        )
      }
    }

    const loadSessionPreview = () => {
      const previewEntry = getPreviewEntry(previewId)
      if (!previewEntry) {
        fail('Preview sudah tidak tersedia. Buka ulang dari daftar dokumen.')
        return
      }

      setFileName(previewEntry.fileName)
      setPreviewFile(previewEntry.file)
    }

    setPreviewError(null)
    setIsLoading(true)
    setPreviewFile(null)
    setFileName('')
    setDocumentMeta(null)
    setPdfObjectUrl(null)

    if (documentId) {
      void loadDocumentPreview()
    } else if (previewId) {
      loadSessionPreview()
    } else {
      fail('Preview tidak ditemukan.')
    }

    const handleUnload = () => {
      if (previewId) revokePreview(previewId)
    }
    window.addEventListener('beforeunload', handleUnload)

    return () => {
      cancelled = true
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [previewId, documentId])

  useEffect(() => {
    if (!previewFile || previewError) return undefined

    if (isPdfFile(previewFile)) {
      const objectUrl = URL.createObjectURL(previewFile)
      setPdfObjectUrl(objectUrl)
      setIsLoading(false)

      return () => {
        URL.revokeObjectURL(objectUrl)
      }
    }

    if (!isDocxFile(previewFile)) {
      setPreviewError('Format file tidak mendukung preview. Gunakan PDF atau DOCX.')
      setIsLoading(false)
      return undefined
    }

    let cancelled = false

    const renderDocx = async () => {
      const container = docxContainerRef.current
      if (!container) return

      try {
        container.innerHTML = ''
        await renderAsync(previewFile, container, undefined, {
          className: 'docx-preview-panel',
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
        })
        if (cancelled) return
        container.innerHTML = DOMPurify.sanitize(container.innerHTML)
        setIsLoading(false)
      } catch (err) {
        if (cancelled) return
        setPreviewError(
          err instanceof Error ? err.message : 'Gagal memuat preview dokumen.',
        )
        setIsLoading(false)
      }
    }

    void renderDocx()

    return () => {
      cancelled = true
      if (docxContainerRef.current) {
        docxContainerRef.current.innerHTML = ''
      }
    }
  }, [previewFile, previewError])

  const isPdfPreview = previewFile ? isPdfFile(previewFile) : false

  const handleDownload = () => {
    try {
      if (documentMeta) {
        void downloadUploadedDocument(documentMeta)
        return
      }

      if (previewFile) {
        downloadPreviewFile(previewFile)
      }
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : 'Gagal mengunduh dokumen.',
      )
    }
  }

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
        previewFile
          ? h(
              'div',
              { className: 'min-w-0' },
              h(
                'p',
                { className: 'truncate text-sm font-semibold text-slate-900' },
                fileName,
              ),
              h(
                'p',
                { className: 'text-xs text-slate-500' },
                `${getFileTypeLabel(previewFile)} · ${formatFileSize(previewFile.size)}`,
              ),
            )
          : h('p', { className: 'text-sm font-medium text-slate-700' }, 'Preview Dokumen'),
      ),
      h(
        'div',
        { className: 'flex shrink-0 items-center gap-2' },
        previewFile &&
          h(
            'button',
            {
              type: 'button',
              className:
                'inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50',
              onClick: handleDownload,
            },
            h(Download, { className: 'h-4 w-4' }),
            'Unduh',
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
        !isLoading &&
        isPdfPreview &&
        pdfObjectUrl &&
        h('iframe', {
          title: fileName || 'Preview PDF',
          src: pdfObjectUrl,
          className: 'h-[calc(100vh-65px)] w-full border-0 bg-white',
        }),
      !previewError &&
        !isPdfPreview &&
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