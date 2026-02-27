import { useEffect, useCallback } from 'react'
import useEntriesStore from '../store/entriesStore'
import useAuthStore from '../store/authStore'
import useUIStore from '../store/uiStore'
import { fetchEntries, createEntry, updateEntry, deleteEntry } from '../lib/supabase'
import { extractTags } from '../utils/tagParser'

export function useEntries() {
  const {
    entries, loading, error,
    setEntries, addEntry, updateEntry: storeUpdate, removeEntry,
    setLoading, setError,
    getFilteredEntries,
    searchQuery, setSearchQuery,
    filterType, setFilterType,
    filterTag, setFilterTag,
    sortBy, setSortBy,
    getAllTags,
  } = useEntriesStore()

  const { user } = useAuthStore()
  const { toast } = useUIStore()

  const loadEntries = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await fetchEntries(user.id)
    if (error) {
      setError(error.message)
      toast.error('Failed to load entries')
    } else {
      setEntries(data)
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
      // Auto-extract tags from notes
      const autoTags = extractTags(entryData.notes || '')
      const positions = [...new Set([...(entryData.positions || []), ...autoTags])]

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

  return {
    entries,
    filteredEntries: getFilteredEntries(),
    loading,
    error,
    searchQuery,
    filterType,
    filterTag,
    sortBy,
    allTags: getAllTags(),
    loadEntries,
    saveEntry,
    editEntry,
    removeEntry: removeEntryById,
    setSearchQuery,
    setFilterType,
    setFilterTag,
    setSortBy,
  }
}
