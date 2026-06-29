import { createElement as h, useState } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import { useDocumentStore } from '../store/useDocumentStore'
import { ConfirmDialog } from '@/shared/ui'
import { useUiStore } from '@/shared/store'

const btnDanger =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-danger-200 bg-danger-50 px-3 py-1.5 text-sm font-medium text-danger-700 transition-colors hover:bg-danger-100 disabled:cursor-not-allowed disabled:opacity-60'

export function ClearAllDocumentsButton() {
  const queuePagination = useDocumentStore((state) => state.queuePagination)
  const processedPagination = useDocumentStore(
    (state) => state.processedPagination,
  )
  const clearAllDocuments = useDocumentStore((state) => state.clearAllDocuments)
  const isClearingAllDocuments = useDocumentStore(
    (state) => state.isClearingAllDocuments,
  )
  const showToast = useUiStore((state) => state.showToast)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const queueCount = queuePagination.total
  const processedCount = processedPagination.total

  if (queueCount === 0) return null

  const handleConfirm = async () => {
    try {
      await clearAllDocuments()
      setConfirmOpen(false)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Gagal menghapus semua dokumen.'
      showToast(message, 'error')
      setConfirmOpen(false)
    }
  }

  return h(
    'div',
    null,
    h(
      'button',
      {
        type: 'button',
        className: btnDanger,
        disabled: isClearingAllDocuments,
        onClick: () => setConfirmOpen(true),
      },
      isClearingAllDocuments
        ? h(Loader2, { className: 'h-4 w-4 animate-spin' })
        : h(Trash2, { className: 'h-4 w-4' }),
      'Hapus Semua',
    ),
    h(ConfirmDialog, {
      isOpen: confirmOpen,
      title: 'Hapus Semua Dokumen?',
      message: `Batalkan ${queueCount} dokumen di antrian? Dokumen selesai (${processedCount}) tidak akan dihapus.`,
      confirmLabel: 'Ya, Hapus Semua',
      cancelLabel: 'Batal',
      isLoading: isClearingAllDocuments,
      onConfirm: handleConfirm,
      onCancel: () => {
        if (!isClearingAllDocuments) setConfirmOpen(false)
      },
    }),
  )
}