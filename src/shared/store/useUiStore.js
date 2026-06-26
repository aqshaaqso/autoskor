import { create } from 'zustand'

function createToastEntry(message, type, options = {}) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    message,
    type,
    documentId: options.documentId ?? null,
    linkTo: options.linkTo ?? null,
    linkLabel: options.linkLabel ?? null,
  }
}

export const useUiStore = create((set) => ({
  sidebarCollapsed: false,
  toast: null,
  toastQueue: [],

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  showToast: (message, type = 'success', options = {}) =>
    set((state) => {
      const entry = createToastEntry(message, type, options)

      if (!state.toast) {
        return { toast: entry }
      }

      return { toastQueue: [...state.toastQueue, entry] }
    }),

  clearToast: () =>
    set((state) => {
      const [nextToast, ...remainingQueue] = state.toastQueue
      return {
        toast: nextToast ?? null,
        toastQueue: remainingQueue,
      }
    }),
}))