import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, SlidersHorizontal } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEntries } from '../hooks/useEntries'
import EntryCard from '../components/journal/EntryCard'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { SegmentedControl } from '../components/ui/Toggle'
import { PageSpinner } from '../components/ui/Spinner'
import { groupByWeek } from '../utils/dateHelpers'

const SORT_OPTIONS = [
  { value: 'date', label: 'Recent' },
  { value: 'mood', label: 'Mood' },
  { value: 'duration', label: 'Duration' },
]

export default function JournalPage() {
  const {
    filteredEntries, loading,
    searchQuery, setSearchQuery,
    sortBy, setSortBy,
    removeEntry,
  } = useEntries()

  const [showFilters, setShowFilters] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const grouped = groupByWeek(filteredEntries)

  const handleDeleteRequest = (id) => setPendingDelete(id)
  const handleDeleteConfirm = async () => {
    if (pendingDelete) {
      await removeEntry(pendingDelete)
      setPendingDelete(null)
    }
  }

  if (loading) return <PageSpinner />

  return (
    <div className="p-5 md:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold text-[var(--text-primary)]">Training Journal</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {filteredEntries.length} session{filteredEntries.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link to="/new">
          <Button size="sm" icon={Plus}>Log Session</Button>
        </Link>
      </div>

      {/* Search & Filter bar */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1">
          <Input
            icon={Search}
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant="secondary"
          size="md"
          icon={SlidersHorizontal}
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? 'border-blue-500/50 text-blue-400' : ''}
        >
          Filter
        </Button>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-panel p-4 mb-5 flex flex-wrap items-center gap-5">
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-2">Sort by</p>
                <SegmentedControl
                  options={SORT_OPTIONS}
                  value={sortBy}
                  onChange={setSortBy}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entries */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-[var(--text-secondary)] font-medium">No sessions found</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {searchQuery ? 'Try a different search term' : 'Log your first training session'}
          </p>
          {!searchQuery && (
            <Link to="/new">
              <Button size="sm" icon={Plus} className="mt-4">Log Session</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ weekStart, label, entries }) => (
            <div key={weekStart}>
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                {label} · {entries.length} session{entries.length !== 1 ? 's' : ''}
              </p>
              <div className="space-y-3">
                <AnimatePresence>
                  {entries.map(entry => (
                    <EntryCard
                      key={entry.id}
                      entry={entry}
                      onDelete={handleDeleteRequest}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Delete confirmation */}
      <AnimatePresence>
        {pendingDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setPendingDelete(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative glass border-white/10 p-6 w-full max-w-sm shadow-[0_0_40px_rgba(0,0,0,0.5)]"
            >
              <h3 className="text-lg font-bold text-white mb-2">Delete entry?</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-5">This can't be undone.</p>
              <div className="flex gap-3 justify-end">
                <Button variant="secondary" size="sm" onClick={() => setPendingDelete(null)}>Cancel</Button>
                <Button variant="danger" size="sm" onClick={handleDeleteConfirm}>Delete</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
