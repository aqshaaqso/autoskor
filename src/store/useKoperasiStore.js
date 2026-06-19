import { create } from 'zustand'
import { processDokumen } from '@/services/api'

export const useKoperasiStore = create((set, get) => ({
  currentFile: null,
  isProcessing: false,
  results: null,
  error: null,

  setFile: (file) => set({ currentFile: file, error: null }),

  clearFile: () => set({ currentFile: null, error: null }),

  processFile: async () => {
    const { currentFile } = get()
    if (!currentFile) return

    set({ isProcessing: true, error: null })

    try {
      const results = await processDokumen(currentFile)
      set({ results, isProcessing: false })
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Gagal memproses dokumen. Silakan coba lagi.'
      set({ error: message, isProcessing: false })
    }
  },

  resetResults: () => set({ results: null, error: null }),
}))