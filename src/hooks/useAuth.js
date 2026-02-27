import { useEffect } from 'react'
import useAuthStore from '../store/authStore'
import { getSession, onAuthChange, signIn, signUp, signOut, signInWithGoogle, IS_MOCK } from '../lib/supabase'
import useUIStore from '../store/uiStore'

export function useAuth() {
  const { user, session, loading, error, isDemoMode, setUser, setSession, setLoading, setError, loginDemo, logout } = useAuthStore()
  const { toast } = useUIStore()

  useEffect(() => {
    // On mount, restore session
    const init = async () => {
      try {
        const { data } = await getSession()
        if (data?.session) {
          setSession(data.session)
          setUser(data.session.user)
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }

    if (!session) {
      init()
    } else {
      setLoading(false)
    }

    if (!IS_MOCK) {
      const { data: { subscription } } = onAuthChange((event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
      })
      return () => subscription.unsubscribe()
    }
  }, [])

  const handleSignIn = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await signIn(email, password)
      if (error) throw error
      setSession(data.session)
      setUser(data.user)
      toast.success('Welcome back!')
    } catch (err) {
      setError(err.message)
      toast.error(err.message, 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (email, password, name) => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await signUp(email, password, name)
      if (error) throw error
      setUser(data.user)
      toast.success('Account created! Welcome to RollIQ.')
    } catch (err) {
      setError(err.message)
      toast.error(err.message, 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    logout()
    toast.info('Signed out successfully.')
  }

  const handleGoogleSignIn = async () => {
    const { data, error } = await signInWithGoogle()
    if (!error && data?.user) {
      setUser(data.user)
      setSession({ access_token: 'google-oauth', user: data.user })
    } else if (error) {
      toast.error(error.message)
    }
  }

  return {
    user,
    session,
    loading,
    error,
    isDemoMode,
    isAuthenticated: !!session,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    signInWithGoogle: handleGoogleSignIn,
    loginDemo,
  }
}
