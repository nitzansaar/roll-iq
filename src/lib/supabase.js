/**
 * Supabase client with mock fallback validation.
 * When VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set, uses real Supabase.
 * Otherwise falls back to mock Api endpoints.
 */

import { createClient } from '@supabase/supabase-js'
import * as mockApi from './mockApi'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const isValidUrl = (v) => v && v.startsWith('https://') && !v.includes('your_')
export const IS_MOCK = !isValidUrl(SUPABASE_URL) || !SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes('your_')

const supabase = IS_MOCK ? null : createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ─── Auth helpers ────────────────────────────────────────────────────────────
export async function signIn(email, password) {
  if (IS_MOCK) return mockApi.signInMock(email, password)
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signUp(email, password, name) {
  if (IS_MOCK) return mockApi.signUpMock(email, password, name)
  return supabase.auth.signUp({
    email,
    password,
    options: { data: { name } }
  })
}

export async function signOut() {
  if (IS_MOCK) return mockApi.signOutMock()
  return supabase.auth.signOut()
}

export async function signInWithGoogle() {
  if (IS_MOCK) return mockApi.signInWithGoogleMock()
  return supabase.auth.signInWithOAuth({ provider: 'google' })
}

export async function getSession() {
  if (IS_MOCK) return mockApi.getSessionMock()
  return supabase.auth.getSession()
}

export function onAuthChange(callback) {
  if (IS_MOCK) return mockApi.onAuthChangeMock(callback)
  return supabase.auth.onAuthStateChange(callback)
}

// ─── camelCase ↔ snake_case helpers ─────────────────────────────────────────
function toSnake(entry) {
  return {
    user_id: entry.userId,
    date: entry.date,
    type: entry.type,
    duration: entry.duration,
    mood: entry.mood,
    energy: entry.energy,
    title: entry.title,
    notes: entry.notes,
    techniques: entry.techniques,
    positions: entry.positions,
    tags: entry.tags,
    wins: entry.wins,
    losses: entry.losses,
    highlights: entry.highlights,
    improvements: entry.improvements,
    instructor_feedback: entry.instructorFeedback,
  }
}

function toCamel(row) {
  return {
    id: row.id,
    userId: row.user_id,
    date: row.date,
    type: row.type,
    duration: row.duration,
    mood: row.mood,
    energy: row.energy,
    title: row.title,
    notes: row.notes,
    techniques: row.techniques ?? [],
    positions: row.positions ?? [],
    tags: row.tags ?? [],
    wins: row.wins,
    losses: row.losses,
    highlights: row.highlights,
    improvements: row.improvements,
    instructorFeedback: row.instructor_feedback,
    createdAt: row.created_at,
  }
}

// ─── Entries CRUD ────────────────────────────────────────────────────────────
export async function fetchEntries(userId) {
  if (IS_MOCK) return mockApi.fetchEntriesMock(userId)

  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })

  return { data: data ? data.map(toCamel) : [], error }
}

export async function createEntry(entry) {
  if (IS_MOCK) return mockApi.createEntryMock(entry)

  const { data, error } = await supabase
    .from('entries')
    .insert(toSnake(entry))
    .select()
    .single()

  return { data: data ? toCamel(data) : null, error }
}

export async function updateEntry(id, updates) {
  if (IS_MOCK) return mockApi.updateEntryMock(id, updates)

  const { data, error } = await supabase
    .from('entries')
    .update(toSnake(updates))
    .eq('id', id)
    .select()
    .single()

  return { data: data ? toCamel(data) : null, error }
}

export async function deleteEntry(id) {
  if (IS_MOCK) return mockApi.deleteEntryMock(id)
  return supabase.from('entries').delete().eq('id', id)
}

// ─── Video interactions ──────────────────────────────────────────────────────
export async function saveVideoInteraction(userId, videoId, action) {
  if (IS_MOCK) return mockApi.saveVideoInteractionMock(userId, videoId, action)
  return supabase.from('video_interactions').upsert({ user_id: userId, video_id: videoId, action })
}

export { supabase }
