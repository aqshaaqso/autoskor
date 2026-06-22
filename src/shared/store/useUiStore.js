import { create } from 'zustand'

export const useUiStore = create((set) => ({
  sidebarCollapsed: false,
  toast: null,

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  showToast: (message, type = 'success', options = {}) =>
    set({
      toast: {
        message,
        type,
        documentId: options.documentId ?? null,
      },
    }),

  clearToast: () => set({ toast: null }),
}))