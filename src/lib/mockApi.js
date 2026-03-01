import { allMockEntries, mockUser } from '../utils/mockData'

export let mockStore = {
    session: null,
    user: null,
    entries: [...allMockEntries],
}

// ─── Auth helpers ────────────────────────────────────────────────────────────
export async function signInMock(email, password) {
    mockStore.user = { ...mockUser, email }
    mockStore.session = { access_token: 'mock-token', user: mockStore.user }
    return { data: { user: mockStore.user, session: mockStore.session }, error: null }
}

export async function signUpMock(email, password, name) {
    mockStore.user = { ...mockUser, email, name: name || mockUser.name }
    mockStore.session = { access_token: 'mock-token', user: mockStore.user }
    return { data: { user: mockStore.user }, error: null }
}

export async function signOutMock() {
    mockStore.session = null
    mockStore.user = null
    return { error: null }
}

export async function signInWithGoogleMock() {
    mockStore.user = { ...mockUser }
    mockStore.session = { access_token: 'mock-token', user: mockStore.user }
    return { data: { user: mockStore.user }, error: null }
}

export async function getSessionMock() {
    return { data: { session: mockStore.session }, error: null }
}

export function onAuthChangeMock(callback) {
    // No-op in mock mode
    return { data: { subscription: { unsubscribe: () => { } } } }
}

// ─── Entries CRUD ────────────────────────────────────────────────────────────
export async function fetchEntriesMock(userId) {
    const entries = mockStore.entries
        .filter(e => e.userId === (userId || mockUser.id))
        .sort((a, b) => b.date.localeCompare(a.date))
    return { data: entries, error: null }
}

export async function createEntryMock(entry) {
    const newEntry = {
        ...entry,
        id: `entry-${Date.now()}`,
        userId: mockUser.id,
        createdAt: new Date().toISOString(),
    }
    mockStore.entries = [newEntry, ...mockStore.entries]
    return { data: newEntry, error: null }
}

export async function updateEntryMock(id, updates) {
    mockStore.entries = mockStore.entries.map(e =>
        e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
    )
    const updated = mockStore.entries.find(e => e.id === id)
    return { data: updated, error: null }
}

export async function deleteEntryMock(id) {
    mockStore.entries = mockStore.entries.filter(e => e.id !== id)
    return { data: null, error: null }
}

// ─── Video interactions ──────────────────────────────────────────────────────
export async function saveVideoInteractionMock(userId, videoId, action) {
    return { data: { videoId, action }, error: null }
}
