import { getTagColor, formatTag } from '../../utils/tagParser'

const variants = {
  default: 'bg-surface-500 text-[var(--text-secondary)] border-surface-400',
  blue: 'bg-blue-900/40 text-blue-300 border-blue-700/50',
  green: 'bg-green-900/40 text-green-300 border-green-700/50',
  red: 'bg-red-900/40 text-red-300 border-red-700/50',
  orange: 'bg-orange-900/40 text-orange-300 border-orange-700/50',
  purple: 'bg-purple-900/40 text-purple-300 border-purple-700/50',
  yellow: 'bg-yellow-900/40 text-yellow-300 border-yellow-700/50',
}

export default function Badge({
  children,
  variant = 'default',
  position, // if set, use position-based coloring
  className = '',
  onRemove,
}) {
  const colorClass = position ? getTagColor(position) : (variants[variant] || variants.default)

  return (
    <span className={`badge border ${colorClass} ${className}`}>
      {position ? formatTag(position) : children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 opacity-60 hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      )}
    </span>
  )
}

export function MoodBadge({ mood }) {
  const moods = {
    1: { emoji: '😴', label: 'Low', color: 'bg-surface-600 text-[var(--text-muted)]' },
    2: { emoji: '😕', label: 'Poor', color: 'bg-red-900/30 text-red-400' },
    3: { emoji: '😐', label: 'Okay', color: 'bg-yellow-900/30 text-yellow-400' },
    4: { emoji: '😊', label: 'Good', color: 'bg-green-900/30 text-green-400' },
    5: { emoji: '🔥', label: 'Great', color: 'bg-blue-900/30 text-blue-400' },
  }

  const { emoji, label, color } = moods[mood] || moods[3]

  return (
    <span className={`badge border-0 ${color}`}>
      {emoji} {label}
    </span>
  )
}
