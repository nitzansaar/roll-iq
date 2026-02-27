const MOODS = [
  { value: 1, emoji: '😴', label: 'Rough' },
  { value: 2, emoji: '😕', label: 'Poor' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '😊', label: 'Good' },
  { value: 5, emoji: '🔥', label: 'Great' },
]

export default function MoodPicker({ value, onChange, label = 'Mood' }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-[var(--text-secondary)]">{label}</label>
      <div className="flex gap-2">
        {MOODS.map(mood => (
          <button
            key={mood.value}
            type="button"
            onClick={() => onChange(mood.value)}
            className={`
              flex flex-col items-center gap-1 px-3 py-2 rounded-xl border transition-all duration-150 flex-1
              ${value === mood.value
                ? 'bg-blue-600/20 border-blue-500/60 text-blue-300'
                : 'bg-surface-800 border-surface-600 text-[var(--text-muted)] hover:border-surface-400 hover:text-[var(--text-secondary)]'
              }
            `}
          >
            <span className="text-xl">{mood.emoji}</span>
            <span className="text-xs font-medium">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function EnergyPicker({ value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-[var(--text-secondary)]">Energy Level</label>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map(level => (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            className={`
              h-2 flex-1 rounded-full transition-all duration-150
              ${level <= value
                ? 'bg-blue-500'
                : 'bg-surface-600 hover:bg-surface-500'
              }
            `}
          />
        ))}
        <span className="text-xs text-[var(--text-muted)] w-4 text-center">{value}/5</span>
      </div>
    </div>
  )
}
