import { motion } from 'framer-motion'
import { Clock, Swords, ChevronRight, Trash2, Edit } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatDate, formatDuration } from '../../utils/dateHelpers'
import { formatTag } from '../../utils/tagParser'
import Badge, { MoodBadge } from '../ui/Badge'
import useUIStore from '../../store/uiStore'

export default function EntryCard({ entry, onDelete, compact = false }) {
  const navigate = useNavigate()
  const { openModal } = useUIStore()

  const winRate = entry.wins + entry.losses > 0
    ? Math.round((entry.wins / (entry.wins + entry.losses)) * 100)
    : null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-surface-700 border border-surface-500/40 rounded-xl hover:border-surface-400/60 transition-all duration-200 group"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded border ${
                entry.type === 'gi'
                  ? 'bg-blue-900/30 text-blue-300 border-blue-700/40'
                  : 'bg-orange-900/30 text-orange-300 border-orange-700/40'
              }`}>
                {entry.type === 'gi' ? 'Gi' : 'No-Gi'}
              </span>
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
          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3 leading-relaxed">
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

        {/* Tags */}
        {entry.positions?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {entry.positions.slice(0, compact ? 2 : 4).map(pos => (
              <Badge key={pos} position={pos} />
            ))}
            {entry.positions.length > (compact ? 2 : 4) && (
              <span className="text-xs text-[var(--text-muted)]">
                +{entry.positions.length - (compact ? 2 : 4)} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions footer */}
      {!compact && (
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-surface-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1">
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(entry.id) }}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-900/20 transition-all"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
          <button
            onClick={() => navigate(`/journal/${entry.id}`)}
            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            View details <ChevronRight size={12} />
          </button>
        </div>
      )}
    </motion.div>
  )
}
