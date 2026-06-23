import { createElement as h, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, ChevronRight, Loader2, Trash2 } from 'lucide-react'
import { DocumentStatusBadge } from './DocumentStatusBadge'
import { DocumentDetailModal } from './DocumentDetailModal'
import { ConfirmDialog } from '@/shared/ui'
import { formatFileSize, formatDateTime } from '@/shared/utils/format'

function canRemoveFromQueue(document) {
  return document.status === 'queued' || document.status === 'processing'
}

const clickableCellClass =
  'cursor-pointer rounded-md text-left transition-colors hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30'

export function DocumentTable({
  documents,
  showDetailLink = false,
  showWorker = false,
  showUploader = false,
  enableDetailOnClick = false,
  enableCancelAction = false,
  onCancelDocument,
  isCanceling = false,
  emptyMessage,
}) {
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [cancelTarget, setCancelTarget] = useState(null)
  const showActionsColumn = showDetailLink || enableCancelAction

  const openDocumentDetail = (doc) => {
    if (!enableDetailOnClick) return
    setSelectedDocument(doc)
  }

  const closeDocumentDetail = () => setSelectedDocument(null)

  const handleConfirmCancel = async () => {
    if (!cancelTarget || !onCancelDocument) return

    try {
      await onCancelDocument(cancelTarget)
      setCancelTarget(null)
    } catch {
      setCancelTarget(null)
    }
  }

  if (documents.length === 0) {
    return h(
      'div',
      {
        className:
          'rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center',
      },
      h('p', { className: 'text-sm text-slate-500' }, emptyMessage),
    )
  }

  return h(
    'div',
    null,
    h(
      'div',
      {
        className:
          'overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm',
      },
      enableDetailOnClick &&
        h(
          'p',
          { className: 'border-b border-slate-100 px-4 py-2 text-xs text-slate-500' },
          'Klik nama file atau kolom Uploaded untuk melihat detail lengkap.',
        ),
      h(
        'div',
        { className: 'overflow-x-auto' },
        h(
          'table',
          { className: 'w-full min-w-[720px] text-left text-sm' },
          h(
            'thead',
            null,
            h(
              'tr',
              { className: 'border-b border-slate-200 bg-slate-50' },
              h(
                'th',
                { className: 'px-4 py-3 font-semibold text-slate-700' },
                'Dokumen',
              ),
              h(
                'th',
                { className: 'px-4 py-3 font-semibold text-slate-700' },
                'Size',
              ),
              h(
                'th',
                { className: 'px-4 py-3 font-semibold text-slate-700' },
                'Uploaded',
              ),
              showUploader &&
                h(
                  'th',
                  { className: 'px-4 py-3 font-semibold text-slate-700' },
                  'Uploader',
                ),
              h(
                'th',
                { className: 'px-4 py-3 font-semibold text-slate-700' },
                'Status',
              ),
              showWorker &&
                h(
                  'th',
                  { className: 'px-4 py-3 font-semibold text-slate-700' },
                  'Worker',
                ),
              showActionsColumn &&
                h(
                  'th',
                  {
                    className:
                      'px-4 py-3 text-right font-semibold text-slate-700',
                  },
                  'Aksi',
                ),
            ),
          ),
          h(
            'tbody',
            null,
            documents.map((doc) =>
              h(
                'tr',
                {
                  key: doc.id,
                  className:
                    'border-b border-slate-100 transition-colors hover:bg-slate-50/80',
                },
                h(
                  'td',
                  { className: 'px-4 py-3' },
                  h(
                    'div',
                    { className: 'flex items-center gap-3' },
                    h(
                      'div',
                      {
                        className:
                          'flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100',
                      },
                      h(FileText, { className: 'h-4 w-4 text-primary-600' }),
                    ),
                    enableDetailOnClick
                      ? h(
                          'button',
                          {
                            type: 'button',
                            className: `min-w-0 text-left ${clickableCellClass}`,
                            onClick: () => openDocumentDetail(doc),
                            title: 'Lihat detail dokumen',
                          },
                          h(
                            'span',
                            { className: 'font-medium text-slate-800' },
                            doc.fileName,
                          ),
                          doc.failureReason &&
                            h(
                              'p',
                              { className: 'mt-0.5 text-xs text-danger-600' },
                              doc.failureReason,
                            ),
                        )
                      : h(
                          'div',
                          { className: 'min-w-0' },
                          h(
                            'span',
                            { className: 'font-medium text-slate-800' },
                            doc.fileName,
                          ),
                          doc.failureReason &&
                            h(
                              'p',
                              { className: 'mt-0.5 text-xs text-danger-600' },
                              doc.failureReason,
                            ),
                        ),
                  ),
                ),
                h(
                  'td',
                  { className: 'px-4 py-3 text-slate-600' },
                  formatFileSize(doc.fileSize),
                ),
                h(
                  'td',
                  { className: 'px-4 py-3' },
                  enableDetailOnClick
                    ? h(
                        'button',
                        {
                          type: 'button',
                          className: `${clickableCellClass} px-2 py-1 text-slate-600`,
                          onClick: () => openDocumentDetail(doc),
                          title: 'Lihat detail upload',
                        },
                        formatDateTime(doc.uploadedAt),
                      )
                    : h(
                        'span',
                        { className: 'text-slate-600' },
                        formatDateTime(doc.uploadedAt),
                      ),
                ),
                showUploader &&
                  h(
                    'td',
                    { className: 'px-4 py-3' },
                    doc.uploadedBy
                      ? h(
                          'div',
                          null,
                          h(
                            'p',
                            { className: 'font-medium text-slate-800' },
                            doc.uploadedBy.name,
                          ),
                          h(
                            'p',
                            { className: 'text-xs text-slate-500' },
                            doc.uploadedBy.email,
                          ),
                        )
                      : h('span', { className: 'text-slate-400' }, '-'),
                  ),
                h(
                  'td',
                  { className: 'px-4 py-3' },
                  h(DocumentStatusBadge, { status: doc.status }),
                ),
                showWorker &&
                  h(
                    'td',
                    { className: 'px-4 py-3 text-slate-600' },
                    doc.workerId ?? '-',
                  ),
                showActionsColumn &&
                  h(
                    'td',
                    { className: 'px-4 py-3 text-right' },
                    enableCancelAction && canRemoveFromQueue(doc)
                      ? h(
                          'button',
                          {
                            type: 'button',
                            disabled: isCanceling,
                            onClick: () => setCancelTarget(doc),
                            className:
                              'inline-flex items-center gap-1.5 rounded-lg border border-danger-200 bg-danger-50 px-3 py-1.5 text-sm font-medium text-danger-700 transition-colors hover:bg-danger-100 disabled:cursor-not-allowed disabled:opacity-60',
                            title: 'Hapus dari antrian',
                          },
                          isCanceling && cancelTarget?.id === doc.id
                            ? h(Loader2, { className: 'h-4 w-4 animate-spin' })
                            : h(Trash2, { className: 'h-4 w-4' }),
                          'Hapus',
                        )
                      : showDetailLink && doc.status === 'done'
                        ? h(
                            Link,
                            {
                              to: `/processed/${doc.id}`,
                              className:
                                'inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700',
                            },
                            'Lihat Hasil',
                            h(ChevronRight, { className: 'h-4 w-4' }),
                          )
                        : h('span', { className: 'text-sm text-slate-400' }, '-'),
                  ),
              ),
            ),
          ),
        ),
      ),
    ),
    h(DocumentDetailModal, {
      documentId: selectedDocument?.id ?? null,
      initialDocument: selectedDocument,
      isOpen: !!selectedDocument,
      onClose: closeDocumentDetail,
      showUploader,
    }),
    h(ConfirmDialog, {
      isOpen: !!cancelTarget,
      title: 'Hapus dari Antrian?',
      message: cancelTarget
        ? `Hapus "${cancelTarget.fileName}" dari antrian? Dokumen akan dibatalkan dan tidak diproses lebih lanjut.`
        : '',
      confirmLabel: 'Ya, Hapus',
      cancelLabel: 'Batal',
      isLoading: isCanceling,
      onConfirm: handleConfirmCancel,
      onCancel: () => {
        if (!isCanceling) setCancelTarget(null)
      },
    }),
  )
}