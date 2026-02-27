/**
 * Supabase client with mock fallback.
 * When VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set, uses real Supabase.
 * Otherwise uses in-memory mock store.
 */

import { allMockEntries, mockUser } from '../utils/mockData'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const isValidUrl = (v) => v && v.startsWith('https://') && !v.includes('your_')
export const IS_MOCK = !isValidUrl(SUPABASE_URL) || !SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes('your_')

let supabase = null

if (!IS_MOCK) {
  const { createClient } = await import('@supabase/supabase-js')
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

// ─── Mock in-memory store ────────────────────────────────────────────────────
let mockStore = {
  session: null,
  user: null,
  entries: [...allMockEntries],
}

// ─── Auth helpers ────────────────────────────────────────────────────────────
export async function signIn(email, password) {
  if (IS_MOCK) {
    // Accept any credentials in demo mode
    mockStore.user = { ...mockUser, email }
    mockStore.session = { access_token: 'mock-token', user: mockStore.user }
    return { data: { user: mockStore.user, session: mockStore.session }, error: null }
  }
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signUp(email, password, name) {
  if (IS_MOCK) {
    mockStore.user = { ...mockUser, email, name: name || mockUser.name }
    mockStore.session = { access_token: 'mock-token', user: mockStore.user }
    return { data: { user: mockStore.user }, error: null }
  }
  return supabase.auth.signUp({
    email,
    password,
    options: { data: { name } }
  })
}

export async function signOut() {
  if (IS_MOCK) {
    mockStore.session = null
    mockStore.user = null
    return { error: null }
  }
  return supabase.auth.signOut()
}

export async function signInWithGoogle() {
  if (IS_MOCK) {
    mockStore.user = { ...mockUser }
    mockStore.session = { access_token: 'mock-token', user: mockStore.user }
    return { data: { user: mockStore.user }, error: null }
  }
  return supabase.auth.signInWithOAuth({ provider: 'google' })
}

export async function getSession() {
  if (IS_MOCK) {
    return { data: { session: mockStore.session }, error: null }
  }
  return supabase.auth.getSession()
}

export function onAuthChange(callback) {
  if (IS_MOCK) {
    // No-op in mock mode — auth state managed by store directly
    return { data: { subscription: { unsubscribe: () => {} } } }
  }
  return supabase.auth.onAuthStateChange(callback)
}

// ─── Entries CRUD ────────────────────────────────────────────────────────────
export async function fetchEntries(userId) {
  if (IS_MOCK) {
    const entries = mockStore.entries
      .filter(e => e.userId === (userId || mockUser.id))
      .sort((a, b) => b.date.localeCompare(a.date))
    return { data: entries, error: null }
  }

  return supabase
    .from('entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
}

export async function createEntry(entry) {
  if (IS_MOCK) {
    const newEntry = {
      ...entry,
      id: `entry-${Date.now()}`,
      userId: mockUser.id,
      createdAt: new Date().toISOString(),
    }
    mockStore.entries = [newEntry, ...mockStore.entries]
    return { data: newEntry, error: null }
  }

  return supabase.from('entries').insert(entry).select().single()
}

export async function updateEntry(id, updates) {
  if (IS_MOCK) {
    mockStore.entries = mockStore.entries.map(e =>
      e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
    )
    const updated = mockStore.entries.find(e => e.id === id)
    return { data: updated, error: null }
  }

  return supabase.from('entries').update(updates).eq('id', id).select().single()
}

export async function deleteEntry(id) {
  if (IS_MOCK) {
    mockStore.entries = mockStore.entries.filter(e => e.id !== id)
    return { data: null, error: null }
  }

  return supabase.from('entries').delete().eq('id', id)
}

// ─── Video interactions ──────────────────────────────────────────────────────
export async function saveVideoInteraction(userId, videoId, action) {
  if (IS_MOCK) return { data: { videoId, action }, error: null }
  return supabase.from('video_interactions').upsert({ user_id: userId, video_id: videoId, action })
}

export { supabase }
