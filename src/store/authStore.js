import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockUser } from '../utils/mockData'
import { IS_MOCK } from '../lib/supabase'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      loading: true,
      error: null,
      isDemoMode: IS_MOCK,

      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      /**
       * Demo login — bypasses Supabase entirely
       */
      loginDemo: () => {
        set({
          user: mockUser,
          session: { access_token: 'demo', user: mockUser },
          loading: false,
          error: null,
        })
      },

      logout: () => {
        set({ user: null, session: null, error: null })
      },

      isAuthenticated: () => !!get().session,
    }),
    {
      name: 'rolliq-auth',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
      }),
    }
  )
)

export default useAuthStore
