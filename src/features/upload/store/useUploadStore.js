import { create } from 'zustand'
import { uploadDocument, useDocumentStore } from '@/features/documents'
import { getApiErrorMessage } from '@/shared/api/client'
import { useUiStore } from '@/shared/store'
import {
  findOversizedFile,
  MAX_FILE_UPLOAD_BYTES,
} from '@/shared/constants/upload'
import { formatFileSize } from '@/shared/utils/format'

function createUploadQueueItem(file) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    file,
    status: 'pending',
    error: null,
  }
}

export const useUploadStore = create((set, get) => ({
  selectedFiles: [],
  uploadQueue: [],
  isUploadProcessorRunning: false,
  uploadProgress: 0,
  uploadQueueTotal: 0,
  currentUploadFileName: null,
  uploadError: null,

  setSelectedFiles: (files) => set({ selectedFiles: files, uploadError: null }),

  removeSelectedFile: (index) =>
    set((state) => ({
      selectedFiles: state.selectedFiles.filter((_, i) => i !== index),
      uploadError: null,
    })),

  clearSelectedFiles: () => set({ selectedFiles: [], uploadError: null }),

  removeUploadQueueItem: (id) =>
    set((state) => ({
      uploadQueue: state.uploadQueue.filter((item) => item.id !== id),
    })),

  retryUploadQueueItem: (id) => {
    set((state) => ({
      uploadQueue: state.uploadQueue.map((item) =>
        item.id === id ? { ...item, status: 'pending', error: null } : item,
      ),
      uploadError: null,
    }))
    void get().processUploadQueue()
  },

  uploadFiles: () => {
    const { selectedFiles } = get()
    if (selectedFiles.length === 0) return

    const oversizedFile = findOversizedFile(selectedFiles)
    if (oversizedFile) {
      set({
        uploadError: `File "${oversizedFile.name}" melebihi batas ${formatFileSize(MAX_FILE_UPLOAD_BYTES)} per file.`,
      })
      return
    }

    const newItems = selectedFiles.map((file) => createUploadQueueItem(file))

    set((state) => ({
      selectedFiles: [],
      uploadQueue: [...state.uploadQueue, ...newItems],
      uploadError: null,
    }))

    void get().processUploadQueue()
  },

  processUploadQueue: async () => {
    if (get().isUploadProcessorRunning) return

    set({ isUploadProcessorRunning: true })
    let uploadedCount = 0

    try {
      while (get().uploadQueue.some((item) => item.status === 'pending')) {
        const { uploadQueue } = get()
        const nextItem = uploadQueue.find((item) => item.status === 'pending')
        if (!nextItem) break

        const activeCount = uploadQueue.filter(
          (item) => item.status === 'pending' || item.status === 'uploading',
        ).length

        set((state) => ({
          uploadQueue: state.uploadQueue.map((item) =>
            item.id === nextItem.id ? { ...item, status: 'uploading' } : item,
          ),
          currentUploadFileName: nextItem.file.name,
          uploadQueueTotal: activeCount,
          uploadProgress: 0,
        }))

        try {
          await uploadDocument(nextItem.file, (progress) => {
            set({ uploadProgress: progress })
          })

          uploadedCount += 1
          set((state) => ({
            uploadQueue: state.uploadQueue.filter(
              (item) => item.id !== nextItem.id,
            ),
          }))
          useDocumentStore.setState({ hasPendingDocuments: true })
        } catch (err) {
          const message = getApiErrorMessage(
            err,
            'Gagal mengupload dokumen. Silakan coba lagi.',
          )

          set((state) => ({
            uploadQueue: state.uploadQueue.map((item) =>
              item.id === nextItem.id
                ? { ...item, status: 'failed', error: message }
                : item,
            ),
            uploadError: `Gagal mengupload "${nextItem.file.name}": ${message}`,
          }))
        }
      }

      if (uploadedCount > 0) {
        useUiStore
          .getState()
          .showToast(`${uploadedCount} dokumen berhasil diupload`)
        void useDocumentStore.getState().checkDocumentStatusUpdates()
      }
    } finally {
      set({
        isUploadProcessorRunning: false,
        uploadProgress: 0,
        uploadQueueTotal: 0,
        currentUploadFileName: null,
      })

      if (get().uploadQueue.some((item) => item.status === 'pending')) {
        void get().processUploadQueue()
      }
    }
  },
}))