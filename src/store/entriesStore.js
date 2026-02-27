import { create } from 'zustand'

const useEntriesStore = create((set, get) => ({
  entries: [],
  loading: false,
  error: null,

  // Filters
  searchQuery: '',
  filterType: 'all', // 'all' | 'gi' | 'nogi'
  filterTag: null,
  sortBy: 'date', // 'date' | 'mood' | 'duration'

  // Summary
  summary: null,
  summaryLoading: false,

  // Actions
  setEntries: (entries) => set({ entries }),
  addEntry: (entry) => set((state) => ({ entries: [entry, ...state.entries] })),
  updateEntry: (id, updates) =>
    set((state) => ({
      entries: state.entries.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    })),
  removeEntry: (id) =>
    set((state) => ({ entries: state.entries.filter((e) => e.id !== id) })),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  setSearchQuery: (q) => set({ searchQuery: q }),
  setFilterType: (t) => set({ filterType: t }),
  setFilterTag: (tag) => set({ filterTag: tag }),
  setSortBy: (s) => set({ sortBy: s }),

  setSummary: (summary) => set({ summary }),
  setSummaryLoading: (loading) => set({ summaryLoading: loading }),

  /**
   * Computed: filtered + sorted entries
   */
  getFilteredEntries: () => {
    const { entries, searchQuery, filterType, filterTag, sortBy } = get()
    let result = [...entries]

    if (filterType !== 'all') {
      result = result.filter((e) => e.type === filterType)
    }

    if (filterTag) {
      result = result.filter(
        (e) =>
          e.tags?.includes(filterTag) ||
          e.positions?.includes(filterTag) ||
          e.techniques?.includes(filterTag)
      )
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.notes?.toLowerCase().includes(q) ||
          e.tags?.some((t) => t.includes(q)) ||
          e.positions?.some((p) => p.includes(q))
      )
    }

    if (sortBy === 'mood') {
      result.sort((a, b) => (b.mood || 0) - (a.mood || 0))
    } else if (sortBy === 'duration') {
      result.sort((a, b) => (b.duration || 0) - (a.duration || 0))
    } else {
      result.sort((a, b) => b.date?.localeCompare(a.date))
    }

    return result
  },

  /**
   * Get all unique tags from entries
   */
  getAllTags: () => {
    const { entries } = get()
    const tags = new Set()
    for (const e of entries) {
      e.tags?.forEach((t) => tags.add(t))
      e.positions?.forEach((p) => tags.add(p))
    }
    return Array.from(tags).sort()
  },
}))

export default useEntriesStore
