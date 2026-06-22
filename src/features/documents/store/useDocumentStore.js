import { create } from 'zustand'
import {
  getDocuments,
  getDocumentResults,
  filterQueueDocuments,
  filterProcessedDocuments,
} from '@/features/documents/api/documentsApi'
import { useUiStore } from '@/shared/store/useUiStore'

export const useDocumentStore = create((set, get) => ({
  queueDocuments: [],
  processedDocuments: [],
  isLoadingQueue: false,
  isLoadingProcessed: false,
  listError: null,

  documentResult: null,
  isLoadingResult: false,
  resultError: null,
  documentStatusMap: {},
  hasPendingDocuments: false,

  fetchQueueDocuments: async () => {
    set({ isLoadingQueue: true, listError: null })
    try {
      const documents = await getDocuments('queue')
      set({ queueDocuments: documents, isLoadingQueue: false })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Gagal memuat antrian dokumen.'
      set({ listError: message, isLoadingQueue: false })
    }
  },

  fetchProcessedDocuments: async () => {
    set({ isLoadingProcessed: true, listError: null })
    try {
      const documents = await getDocuments('processed')
      set({ processedDocuments: documents, isLoadingProcessed: false })
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Gagal memuat dokumen selesai.'
      set({ listError: message, isLoadingProcessed: false })
    }
  },

  fetchDocumentResults: async (id) => {
    set({ isLoadingResult: true, resultError: null, documentResult: null })
    try {
      const data = await getDocumentResults(id)
      set({ documentResult: data, isLoadingResult: false })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Gagal memuat hasil penilaian.'
      set({ resultError: message, isLoadingResult: false })
    }
  },

  clearDocumentResult: () =>
    set({ documentResult: null, resultError: null, isLoadingResult: false }),

  checkDocumentStatusUpdates: async () => {
    try {
      const allDocuments = await getDocuments()
      const { documentStatusMap } = get()
      const nextStatusMap = { ...documentStatusMap }
      let hasNewlyCompleted = false
      let hasNewlyFailed = false
      let statusChanged = false

      for (const doc of allDocuments) {
        const previousStatus = documentStatusMap[doc.id]

        if (previousStatus !== doc.status) {
          statusChanged = true
        }

        if (
          doc.status === 'done' &&
          (previousStatus === 'queued' || previousStatus === 'processing')
        ) {
          useUiStore.getState().showToast(
            `Dokumen "${doc.fileName}" selesai diproses.`,
            'success',
            { documentId: doc.id, linkTo: `/processed/${doc.id}`, linkLabel: 'Lihat Hasil →' },
          )
          hasNewlyCompleted = true
        }

        if (
          doc.status === 'failed' &&
          (previousStatus === 'queued' || previousStatus === 'processing')
        ) {
          const workerLabel = doc.workerId ? ` (${doc.workerId})` : ''
          useUiStore.getState().showToast(
            `Worker gagal memproses "${doc.fileName}"${workerLabel}.`,
            'error',
            { documentId: doc.id, linkTo: '/processed', linkLabel: 'Lihat di Selesai →' },
          )
          hasNewlyFailed = true
        }

        nextStatusMap[doc.id] = doc.status
      }

      const hasPending = allDocuments.some(
        (doc) => doc.status === 'queued' || doc.status === 'processing',
      )

      const updates = {
        documentStatusMap: nextStatusMap,
        hasPendingDocuments: hasPending,
      }

      if (statusChanged) {
        updates.queueDocuments = filterQueueDocuments(allDocuments)
        updates.processedDocuments = filterProcessedDocuments(allDocuments)
      }

      set(updates)

      if (hasNewlyCompleted || hasNewlyFailed) {
        void get().fetchProcessedDocuments()
      }
    } catch {
      // Abaikan error polling — tidak mengganggu UX utama
    }
  },
}))