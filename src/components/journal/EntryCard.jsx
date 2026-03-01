import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Swords, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { formatDate, formatDuration } from '../../utils/dateHelpers'
import Badge, { MoodBadge } from '../ui/Badge'

export default function EntryCard({ entry, onDelete, compact = false }) {
  const [expanded, setExpanded] = useState(false)

  const hasDetails = entry.highlights || entry.improvements || entry.instructorFeedback
  const notesLong = (entry.notes?.length ?? 0) > 120
  const expandable = !compact && (hasDetails || notesLong)

  const winRate = entry.wins + entry.losses > 0
    ? Math.round((entry.wins / (entry.wins + entry.losses)) * 100)
    : null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`card-premium group ${compact ? 'p-3' : ''}`}
    >
      <div className={compact ? '' : 'p-4'}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-[var(--text-muted)]">
                {formatDate(entry.date)}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] leading-tight line-clamp-1">
              {entry.title || 'Training session'}
            </h3>
          </div>
          <MoodBadge mood={entry.mood} />
        </div>

        {/* Notes preview */}
        {entry.notes && !compact && (
          <p className={`text-xs text-[var(--text-secondary)] mb-3 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
            {entry.notes}
          </p>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <Clock size={12} />
            <span>{formatDuration(entry.duration)}</span>
          </div>
          {winRate !== null && (
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <Swords size={12} />
              <span>{entry.wins}W {entry.losses}L</span>
              <span className={winRate >= 60 ? 'text-green-400' : winRate >= 40 ? 'text-yellow-400' : 'text-red-400'}>
                ({winRate}%)
              </span>
            </div>
          )}
        </div>

        {/* Primary focus area */}
        {entry.positions?.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Focus</span>
            <Badge position={entry.positions[0]} />
          </div>
        )}
      </div>

      {/* Expanded detail section */}
      <AnimatePresence>
        {expanded && !compact && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-surface-600 pt-3">
              {entry.highlights && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-green-500 mb-1">Highlights</p>
                  <p className="text-xs text-[var(--text-secondary)]">{entry.highlights}</p>
                </div>
              )}
              {entry.improvements && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-orange-400 mb-1">Needs work</p>
                  <p className="text-xs text-[var(--text-secondary)]">{entry.improvements}</p>
                </div>
              )}
              {entry.instructorFeedback && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-400 mb-1">Coach feedback</p>
                  <p className="text-xs text-[var(--text-secondary)]">{entry.instructorFeedback}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions footer */}
      {!compact && (expandable || onDelete) && (
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-surface-600">
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(entry.id) }}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-900/20 transition-all"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
          {expandable && (
            <button
              onClick={() => setExpanded(v => !v)}
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              {expanded ? 'Show less' : 'Read more'}
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}
