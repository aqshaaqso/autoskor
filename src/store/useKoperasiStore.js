import { create } from 'zustand'
import { processDokumen } from '@/services/api'

export const useKoperasiStore = create((set, get) => ({
  currentFile: null,
  isProcessing: false,
  processingStep: null,
  processingProgress: 0,
  results: null,
  error: null,

  setFile: (file) => set({ currentFile: file, error: null }),

  clearFile: () => set({ currentFile: null, error: null }),

  processFile: async () => {
    const { currentFile } = get()
    if (!currentFile) return

    set({
      isProcessing: true,
      error: null,
      processingStep: 'Mengunggah dokumen...',
      processingProgress: 0,
    })

    try {
      const results = await processDokumen(currentFile, (step, progress) => {
        set({ processingStep: step, processingProgress: progress })
      })
      set({
        results,
        isProcessing: false,
        processingStep: null,
        processingProgress: 0,
      })
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Gagal memproses dokumen. Silakan coba lagi.'
      set({
        error: message,
        isProcessing: false,
        processingStep: null,
        processingProgress: 0,
      })
    }
  },

  resetResults: () => set({ results: null, error: null }),
}))