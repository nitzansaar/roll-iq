import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import Spinner from './Spinner'

const variants = {
  primary: 'bg-gradient-to-br from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white border-white/10 shadow-lg shadow-brand-500/20 ring-1 ring-white/5 overflow-hidden relative group',
  secondary: 'bg-surface-800/80 hover:bg-surface-700/80 backdrop-blur-md text-white border-white/10 shadow-md',
  ghost: 'bg-transparent hover:bg-white/5 text-[var(--text-secondary)] hover:text-white border-transparent',
  danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20 shadow-lg shadow-red-500/10',
  outline: 'glass hover:bg-white/5 text-[var(--text-primary)] border-white/10 shadow-sm hover:shadow-md',
}

const sizes = {
  xs: 'text-xs px-2.5 py-1.5 rounded-lg',
  sm: 'text-sm px-3 py-1.5 rounded-xl',
  md: 'text-sm px-4 py-2.5 rounded-xl',
  lg: 'text-base px-5 py-3 rounded-2xl',
}

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconRight,
  className = '',
  onClick,
  type = 'button',
  fullWidth = false,
  ...props
}, ref) => {
  const isDisabled = disabled || loading

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      className={`
        inline-flex items-center justify-center gap-2 font-medium border
        transition-all duration-150 cursor-pointer select-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      <div className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-200 ${variant === 'primary' ? 'group-hover:opacity-100' : ''}`} />
      <div className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <Spinner size="sm" />
        ) : Icon ? (
          <Icon size={size === 'xs' ? 12 : size === 'sm' ? 14 : size === 'lg' ? 18 : 15} />
        ) : null}
        {children}
        {iconRight && !loading && (
          <span className="ml-auto">{iconRight}</span>
        )}
      </div>
    </motion.button>
  )
})

Button.displayName = 'Button'
export default Button
