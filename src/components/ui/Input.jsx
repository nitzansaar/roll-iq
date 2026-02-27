import { forwardRef } from 'react'

const Input = forwardRef(({
  label,
  error,
  hint,
  icon: Icon,
  className = '',
  containerClass = '',
  type = 'text',
  ...props
}, ref) => {
  return (
    <div className={`space-y-1.5 ${containerClass}`}>
      {label && (
        <label className="block text-xs font-medium text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Icon size={14} className="text-[var(--text-muted)]" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`
            input-base
            ${Icon ? 'pl-9' : ''}
            ${error ? 'border-red-500/60 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
    </div>
  )
})

Input.displayName = 'Input'

export const Textarea = forwardRef(({
  label,
  error,
  hint,
  className = '',
  containerClass = '',
  rows = 4,
  ...props
}, ref) => {
  return (
    <div className={`space-y-1.5 ${containerClass}`}>
      {label && (
        <label className="block text-xs font-medium text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`
          input-base resize-none
          ${error ? 'border-red-500/60 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export const Select = forwardRef(({
  label,
  error,
  options = [],
  className = '',
  containerClass = '',
  ...props
}, ref) => {
  return (
    <div className={`space-y-1.5 ${containerClass}`}>
      {label && (
        <label className="block text-xs font-medium text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`
          input-base appearance-none cursor-pointer
          ${error ? 'border-red-500/60' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-[#1a1a24]">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
})

Select.displayName = 'Select'

export default Input
