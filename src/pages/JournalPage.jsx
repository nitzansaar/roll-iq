import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Filter, SlidersHorizontal } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEntries } from '../hooks/useEntries'
import EntryCard from '../components/journal/EntryCard'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { SegmentedControl } from '../components/ui/Toggle'
import { PageSpinner } from '../components/ui/Spinner'
import { groupByWeek } from '../utils/dateHelpers'

const TYPE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'gi', label: 'Gi' },
  { value: 'nogi', label: 'No-Gi' },
]

const SORT_OPTIONS = [
  { value: 'date', label: 'Recent' },
  { value: 'mood', label: 'Mood' },
  { value: 'duration', label: 'Duration' },
]

export default function JournalPage() {
  const {
    filteredEntries, loading,
    searchQuery, setSearchQuery,
    filterType, setFilterType,
    sortBy, setSortBy,
    removeEntry,
  } = useEntries()

  const [showFilters, setShowFilters] = useState(false)
  const grouped = groupByWeek(filteredEntries)

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
            <div className="bg-surface-700 border border-surface-500/40 rounded-xl p-4 mb-4 flex flex-wrap items-center gap-4">
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-2">Type</p>
                <SegmentedControl
                  options={TYPE_OPTIONS}
                  value={filterType}
                  onChange={setFilterType}
                />
              </div>
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
                      onDelete={removeEntry}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
