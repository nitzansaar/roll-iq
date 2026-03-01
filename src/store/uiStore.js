import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useUIStore = create(
  persist(
    (set, get) => ({
      // Layout
      sidebarOpen: true,
      sidebarCollapsed: false,

      // Toasts
      toasts: [],

      // Modals
      activeModal: null,
      modalData: null,

      // Preferences
      darkMode: true,
      instructor: '',

      // Actions
      setInstructor: (name) => set({ instructor: name }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      openModal: (name, data = null) => set({ activeModal: name, modalData: data }),
      closeModal: () => set({ activeModal: null, modalData: null }),

      addToast: (toast) => {
        const id = Date.now().toString()
        const newToast = { id, duration: 3500, ...toast }
        set((s) => ({ toasts: [...s.toasts, newToast] }))

        // Auto-remove
        setTimeout(() => {
          set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
        }, newToast.duration + 300)
      },

      removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      toast: {
        success: (message, title) =>
          get().addToast({ type: 'success', message, title }),
        error: (message, title) =>
          get().addToast({ type: 'error', message, title, duration: 5000 }),
        info: (message, title) =>
          get().addToast({ type: 'info', message, title }),
      },
    }),
    {
      name: 'rolliq-ui',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        darkMode: state.darkMode,
        instructor: state.instructor,
      }),
    }
  )
)

export default useUIStore
