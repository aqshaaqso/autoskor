import { create } from 'zustand'
import {
  getDocuments,
  getDocumentResults,
  cancelDocument,
  clearAllDocuments as clearAllDocumentsApi,
} from '../api/documentsApi'
import { USE_MOCK_DOCUMENTS } from '@/shared/api/config'
import { filterDocumentsByStatus } from '@/shared/api/scoringJobs/scoringJobsMapper'
import { useUiStore } from '@/shared/store'

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
  isCancelingDocument: false,
  cancelError: null,
  isClearingAllDocuments: false,

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

  clearAllDocuments: async () => {
    set({ isClearingAllDocuments: true, listError: null })

    try {
      const result = await clearAllDocumentsApi()

      set({
        queueDocuments: [],
        ...(USE_MOCK_DOCUMENTS
          ? {
              processedDocuments: [],
              documentResult: null,
              resultError: null,
            }
          : null),
        documentStatusMap: {},
        hasPendingDocuments: false,
        isClearingAllDocuments: false,
      })

      await Promise.all([
        get().fetchQueueDocuments(),
        get().fetchProcessedDocuments(),
      ])

      const toastMessage = USE_MOCK_DOCUMENTS
        ? (result?.message ?? 'Semua dokumen berhasil dihapus.')
        : result?.cleared > 0
          ? `${result.cleared} dokumen diantrian dibatalkan. Dokumen selesai tetap tersimpan.`
          : 'Tidak ada dokumen aktif di antrian. Dokumen selesai tetap tersimpan.'

      useUiStore.getState().showToast(toastMessage, 'success')
    } catch (err) {
      const message =
        err?.response?.data?.message ??
        (err instanceof Error
          ? err.message
          : 'Gagal menghapus semua dokumen.')

      set({ isClearingAllDocuments: false, listError: message })
      throw new Error(message)
    }
  },

  cancelQueueDocument: async (id) => {
    set({ isCancelingDocument: true, cancelError: null })

    try {
      await cancelDocument(id)

      const { queueDocuments, documentStatusMap } = get()
      const nextQueue = queueDocuments.filter((doc) => doc.id !== id)
      const nextStatusMap = { ...documentStatusMap }
      delete nextStatusMap[id]

      set({
        queueDocuments: nextQueue,
        documentStatusMap: nextStatusMap,
        hasPendingDocuments: nextQueue.some(
          (doc) => doc.status === 'queued' || doc.status === 'processing',
        ),
        isCancelingDocument: false,
        cancelError: null,
      })

      useUiStore
        .getState()
        .showToast('Dokumen dihapus dari antrian.', 'success')

      void get().fetchQueueDocuments()
    } catch (err) {
      const message =
        err?.response?.data?.message ??
        (err instanceof Error
          ? err.message
          : 'Gagal menghapus dokumen dari antrian.')

      set({ isCancelingDocument: false, cancelError: message })
      throw new Error(message)
    }
  },

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
          doc.middlewareStatus !== 'canceled' &&
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
        updates.queueDocuments = filterDocumentsByStatus(allDocuments, 'queue')
        updates.processedDocuments = filterDocumentsByStatus(allDocuments, 'processed')
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