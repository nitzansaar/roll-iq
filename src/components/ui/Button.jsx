import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import Spinner from './Spinner'

const variants = {
  primary: 'bg-blue-600 hover:bg-blue-500 text-white border-transparent shadow-lg shadow-blue-600/20',
  secondary: 'bg-surface-600 hover:bg-surface-500 text-white border-surface-400',
  ghost: 'bg-transparent hover:bg-surface-600/60 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-transparent',
  danger: 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border-red-600/30',
  outline: 'bg-transparent hover:bg-surface-600/40 text-[var(--text-primary)] border-surface-400',
}

const sizes = {
  xs: 'text-xs px-2.5 py-1.5 rounded-md',
  sm: 'text-sm px-3 py-1.5 rounded-lg',
  md: 'text-sm px-4 py-2 rounded-lg',
  lg: 'text-base px-5 py-2.5 rounded-xl',
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
      {loading ? (
        <Spinner size="sm" />
      ) : Icon ? (
        <Icon size={size === 'xs' ? 12 : size === 'sm' ? 14 : size === 'lg' ? 18 : 15} />
      ) : null}
      {children}
      {iconRight && !loading && (
        <span className="ml-auto">{iconRight}</span>
      )}
    </motion.button>
  )
})

Button.displayName = 'Button'
export default Button
