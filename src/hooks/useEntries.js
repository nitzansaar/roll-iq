import { useEffect, useCallback, useMemo } from 'react'
import useEntriesStore from '../store/entriesStore'
import useAuthStore from '../store/authStore'
import useUIStore from '../store/uiStore'
import { fetchEntries, createEntry, updateEntry, deleteEntry } from '../lib/supabase'
import { extractPrimaryTag } from '../utils/tagParser'

export function useEntries() {
  const {
    entries, loading, error,
    setEntries, addEntry, updateEntry: storeUpdate, removeEntry,
    setLoading, setError,
    searchQuery, setSearchQuery,
    filterTag, setFilterTag,
    sortBy, setSortBy,
  } = useEntriesStore()

  const { user } = useAuthStore()
  const { toast } = useUIStore()

  const loadEntries = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data, error } = await fetchEntries(user.id)
      if (error) {
        // 404 means the table doesn't exist yet — silently ignore
        if (error.code === '42P01' || error.message?.includes('does not exist') || error.message?.includes('404')) {
          setEntries([])
        } else {
          setError(error.message)
          toast.error('Failed to load entries — check Supabase table setup')
        }
      } else {
        setEntries(data || [])
      }
    } catch (err) {
      setEntries([])
    }
    setLoading(false)
  }, [user?.id])

  useEffect(() => {
    if (user && entries.length === 0) {
      loadEntries()
    }
  }, [user?.id])

  const saveEntry = async (entryData) => {
    try {
      // Find the single most-prominent area from all text fields
      const fullText = [entryData.notes, entryData.improvements, entryData.highlights]
        .filter(Boolean).join(' ')
      const primaryTag = extractPrimaryTag(fullText)
      const manualPositions = entryData.positions || []
      // Primary tag goes first so positions[0] is always the main focus
      const positions = primaryTag
        ? [primaryTag, ...manualPositions.filter(p => p !== primaryTag)]
        : manualPositions

      const payload = {
        ...entryData,
        positions,
        userId: user?.id,
      }

      const { data, error } = await createEntry(payload)
      if (error) throw new Error(error.message)

      addEntry(data)
      toast.success('Entry saved!')
      return data
    } catch (err) {
      toast.error(err.message, 'Failed to save entry')
      throw err
    }
  }

  const editEntry = async (id, updates) => {
    try {
      const { data, error } = await updateEntry(id, updates)
      if (error) throw new Error(error.message)
      storeUpdate(id, data || updates)
      toast.success('Entry updated!')
      return data
    } catch (err) {
      toast.error(err.message, 'Failed to update entry')
      throw err
    }
  }

  const removeEntryById = async (id) => {
    try {
      const { error } = await deleteEntry(id)
      if (error) throw new Error(error.message)
      removeEntry(id)
      toast.success('Entry deleted.')
    } catch (err) {
      toast.error(err.message, 'Failed to delete entry')
    }
  }

  const filteredEntries = useMemo(() => {
    let result = [...entries]

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
  }, [entries, filterTag, searchQuery, sortBy])

  const allTags = useMemo(() => {
    const tags = new Set()
    for (const e of entries) {
      e.tags?.forEach((t) => tags.add(t))
      e.positions?.forEach((p) => tags.add(p))
    }
    return Array.from(tags).sort()
  }, [entries])

  return {
    entries,
    filteredEntries,
    loading,
    error,
    searchQuery,
    filterTag,
    sortBy,
    allTags,
    loadEntries,
    saveEntry,
    editEntry,
    removeEntry: removeEntryById,
    setSearchQuery,
    setFilterTag,
    setSortBy,
  }
}
