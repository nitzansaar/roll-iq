import { motion } from 'framer-motion'

export default function Toggle({ checked, onChange, label, size = 'md', disabled = false }) {
  const sizes = {
    sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translateX(16px)' },
    md: { track: 'w-10 h-5', thumb: 'w-4 h-4', translate: 'translateX(20px)' },
    lg: { track: 'w-12 h-6', thumb: 'w-5 h-5', translate: 'translateX(24px)' },
  }

  const { track, thumb, translate } = sizes[size]

  return (
    <label className={`flex items-center gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <div
        className={`relative ${track} rounded-full transition-colors duration-200 ${
          checked ? 'bg-blue-600' : 'bg-surface-500'
        }`}
        onClick={!disabled ? () => onChange(!checked) : undefined}
      >
        <motion.div
          className={`absolute top-0.5 left-0.5 ${thumb} bg-white rounded-full shadow-sm`}
          animate={{ x: checked ? parseInt(translate) - (size === 'sm' ? 16 : size === 'md' ? 20 : 24) + parseInt(translate) / 4 : 0 }}
          style={{ x: checked ? (size === 'sm' ? 16 : size === 'md' ? 20 : 24) : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
      {label && (
        <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      )}
    </label>
  )
}

export function SegmentedControl({ options, value, onChange, className = '' }) {
  return (
    <div className={`flex items-center bg-surface-800 rounded-lg p-1 gap-0.5 ${className}`}>
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`
            relative px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150
            ${value === opt.value
              ? 'bg-surface-500 text-[var(--text-primary)] shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }
          `}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
