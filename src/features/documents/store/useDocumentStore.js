import { create } from 'zustand'
import {
  getDocuments,
  getDocumentList,
  getDocumentResults,
  getDocumentById,
  cancelDocument,
  clearAllDocuments as clearAllDocumentsApi,
} from '../api/documentsApi'
import { getApiErrorMessage } from '@/shared/api/client'
import { DEFAULT_TABLE_PAGE_SIZE } from '@/shared/constants/pagination'
import { useUiStore } from '@/shared/store'

const MAX_STATUS_MAP_ENTRIES = 200

function createPaginationState(limit = DEFAULT_TABLE_PAGE_SIZE) {
  return {
    offset: 0,
    limit,
    total: 0,
  }
}

function pruneDocumentStatusMap(statusMap, activeDocuments) {
  const activeIds = new Set(activeDocuments.map((doc) => doc.id))
  const prunedMap = { ...statusMap }

  for (const id of Object.keys(prunedMap)) {
    if (!activeIds.has(id)) {
      delete prunedMap[id]
    }
  }

  const entries = Object.entries(prunedMap)
  if (entries.length <= MAX_STATUS_MAP_ENTRIES) {
    return prunedMap
  }

  return Object.fromEntries(entries.slice(entries.length - MAX_STATUS_MAP_ENTRIES))
}

async function fetchDocumentPage(status, pagination) {
  let result = await getDocumentList(status, pagination)

  if (
    result.documents.length === 0 &&
    result.pagination.total > 0 &&
    pagination.offset > 0
  ) {
    const newOffset = Math.max(0, pagination.offset - pagination.limit)
    result = await getDocumentList(status, {
      offset: newOffset,
      limit: pagination.limit,
    })
  }

  return result
}

export const useDocumentStore = create((set, get) => ({
  queueDocuments: [],
  processedDocuments: [],
  queuePagination: createPaginationState(),
  processedPagination: createPaginationState(),
  isLoadingQueue: false,
  isLoadingProcessed: false,
  queueListError: null,
  processedListError: null,

  documentResult: null,
  isLoadingResult: false,
  resultError: null,
  documentStatusMap: {},
  hasPendingDocuments: false,
  isCancelingDocument: false,
  cancelError: null,
  isClearingAllDocuments: false,

  fetchQueueDocuments: async (options = {}) => {
    const { queuePagination } = get()
    const offset = options.offset ?? queuePagination.offset
    const limit = options.limit ?? queuePagination.limit

    set({ isLoadingQueue: true, queueListError: null })

    try {
      const { documents, pagination } = await fetchDocumentPage('queue', {
        offset,
        limit,
      })

      set({
        queueDocuments: documents,
        queuePagination: {
          offset: pagination.offset,
          limit: pagination.limit,
          total: pagination.total,
        },
        isLoadingQueue: false,
      })
    } catch (err) {
      const message = getApiErrorMessage(err, 'Gagal memuat antrian dokumen.')
      set({ queueListError: message, isLoadingQueue: false })
    }
  },

  setQueuePage: (page) => {
    const { limit } = get().queuePagination
    void get().fetchQueueDocuments({ offset: (page - 1) * limit })
  },

  setQueuePageSize: (limit) => {
    void get().fetchQueueDocuments({ offset: 0, limit })
  },

  fetchProcessedDocuments: async (options = {}) => {
    const { processedPagination } = get()
    const offset = options.offset ?? processedPagination.offset
    const limit = options.limit ?? processedPagination.limit

    set({ isLoadingProcessed: true, processedListError: null })

    try {
      const { documents, pagination } = await fetchDocumentPage('processed', {
        offset,
        limit,
      })

      set({
        processedDocuments: documents,
        processedPagination: {
          offset: pagination.offset,
          limit: pagination.limit,
          total: pagination.total,
        },
        isLoadingProcessed: false,
      })
    } catch (err) {
      const message = getApiErrorMessage(err, 'Gagal memuat dokumen selesai.')
      set({ processedListError: message, isLoadingProcessed: false })
    }
  },

  setProcessedPage: (page) => {
    const { limit } = get().processedPagination
    void get().fetchProcessedDocuments({ offset: (page - 1) * limit })
  },

  setProcessedPageSize: (limit) => {
    void get().fetchProcessedDocuments({ offset: 0, limit })
  },

  fetchDocumentResults: async (id) => {
    set({ isLoadingResult: true, resultError: null, documentResult: null })

    try {
      const data = await getDocumentResults(id)
      set({ documentResult: data, isLoadingResult: false })
    } catch (err) {
      try {
        const document = await getDocumentById(id)
        if (document.status === 'failed') {
          set({
            documentResult: {
              document,
              results: null,
              isFailed: true,
            },
            isLoadingResult: false,
          })
          return
        }
      } catch {
        // Lanjut ke pesan error default
      }

      const message = getApiErrorMessage(err, 'Gagal memuat hasil penilaian.')
      set({ resultError: message, isLoadingResult: false })
    }
  },

  clearDocumentResult: () =>
    set({ documentResult: null, resultError: null, isLoadingResult: false }),

  clearAllDocuments: async () => {
    set({ isClearingAllDocuments: true, queueListError: null })

    try {
      const result = await clearAllDocumentsApi()

      set({
        queueDocuments: [],
        queuePagination: createPaginationState(get().queuePagination.limit),
        documentStatusMap: {},
        hasPendingDocuments: false,
        isClearingAllDocuments: false,
      })

      await Promise.all([
        get().fetchQueueDocuments({ offset: 0 }),
        get().fetchProcessedDocuments({ offset: 0 }),
      ])

      const toastMessage = result?.cleared > 0
        ? `${result.cleared} dokumen diantrian dibatalkan. Dokumen selesai tetap tersimpan.`
        : 'Tidak ada dokumen aktif di antrian. Dokumen selesai tetap tersimpan.'

      useUiStore.getState().showToast(toastMessage, 'success')
    } catch (err) {
      const message = getApiErrorMessage(err, 'Gagal menghapus semua dokumen.')
      set({ isClearingAllDocuments: false, queueListError: message })
      throw new Error(message)
    }
  },

  cancelQueueDocument: async (id) => {
    set({ isCancelingDocument: true, cancelError: null })

    try {
      await cancelDocument(id)

      const { queueDocuments, queuePagination, documentStatusMap } = get()
      const nextQueue = queueDocuments.filter((doc) => doc.id !== id)
      const nextStatusMap = { ...documentStatusMap }
      delete nextStatusMap[id]

      set({
        queueDocuments: nextQueue,
        queuePagination: {
          ...queuePagination,
          total: Math.max(0, queuePagination.total - 1),
        },
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
      const message = getApiErrorMessage(
        err,
        'Gagal menghapus dokumen dari antrian.',
      )
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
            {
              documentId: doc.id,
              linkTo: `/processed/${doc.id}`,
              linkLabel: 'Lihat Hasil →',
            },
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
            {
              documentId: doc.id,
              linkTo: '/processed',
              linkLabel: 'Lihat di Selesai →',
            },
          )
          hasNewlyFailed = true
        }

        nextStatusMap[doc.id] = doc.status
      }

      const hasPending = allDocuments.some(
        (doc) => doc.status === 'queued' || doc.status === 'processing',
      )

      set({
        documentStatusMap: pruneDocumentStatusMap(nextStatusMap, allDocuments),
        hasPendingDocuments: hasPending,
      })

      if (hasPending || statusChanged) {
        void get().fetchQueueDocuments()
      }

      if (statusChanged || hasNewlyCompleted || hasNewlyFailed) {
        void get().fetchProcessedDocuments()
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn('Polling status dokumen gagal:', err)
      }
    }
  },
}))