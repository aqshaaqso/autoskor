import { create } from 'zustand'
import {
  uploadDocuments,
  getDocuments,
  getDocumentResults,
} from '@/services/api'

export const useKoperasiStore = create((set, get) => ({
  sidebarCollapsed: false,
  selectedFiles: [],
  isUploading: false,
  uploadProgress: 0,
  uploadError: null,
  toast: null,

  queueDocuments: [],
  processedDocuments: [],
  isLoadingQueue: false,
  isLoadingProcessed: false,
  listError: null,

  documentResult: null,
  isLoadingResult: false,
  resultError: null,
  documentStatusMap: {},

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setSelectedFiles: (files) => set({ selectedFiles: files, uploadError: null }),

  removeSelectedFile: (index) =>
    set((state) => ({
      selectedFiles: state.selectedFiles.filter((_, i) => i !== index),
      uploadError: null,
    })),

  clearSelectedFiles: () => set({ selectedFiles: [], uploadError: null }),

  showToast: (message, type = 'success', options = {}) =>
    set({
      toast: {
        message,
        type,
        documentId: options.documentId ?? null,
      },
    }),

  clearToast: () => set({ toast: null }),

  uploadFiles: async () => {
    const { selectedFiles } = get()
    if (selectedFiles.length === 0) return

    set({
      isUploading: true,
      uploadError: null,
      uploadProgress: 0,
    })

    try {
      const response = await uploadDocuments(selectedFiles, (progress) => {
        set({ uploadProgress: progress })
      })

      set({
        isUploading: false,
        uploadProgress: 0,
        selectedFiles: [],
      })

      get().showToast(
        response.message ??
          `${selectedFiles.length} dokumen berhasil diupload`,
      )
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Gagal mengupload dokumen. Silakan coba lagi.'
      set({
        uploadError: message,
        isUploading: false,
        uploadProgress: 0,
      })
    }
  },

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
      const documents = await getDocuments('done')
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

      for (const doc of allDocuments) {
        const previousStatus = documentStatusMap[doc.id]

        if (
          doc.status === 'done' &&
          (previousStatus === 'queued' || previousStatus === 'processing')
        ) {
          get().showToast(
            `Dokumen "${doc.fileName}" selesai diproses.`,
            'success',
            { documentId: doc.id },
          )
          hasNewlyCompleted = true
        }

        nextStatusMap[doc.id] = doc.status
      }

      set({ documentStatusMap: nextStatusMap })

      if (hasNewlyCompleted) {
        void get().fetchProcessedDocuments()
        void get().fetchQueueDocuments()
      }
    } catch {
      // Abaikan error polling — tidak mengganggu UX utama
    }
  },
}))