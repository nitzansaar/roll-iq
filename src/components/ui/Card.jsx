import { motion } from 'framer-motion'

export default function Card({
  children,
  className = '',
  hover = false,
  padding = true,
  onClick,
  animate = false,
}) {
  const base = `
    card-premium
    ${padding ? 'p-5' : ''}
    ${hover ? 'card-hover cursor-pointer' : ''}
    ${className}
  `

  if (onClick || hover) {
    return (
      <motion.div
        className={base}
        onClick={onClick}
        whileHover={hover ? { y: -1 } : {}}
        transition={{ duration: 0.15 }}
      >
        {children}
      </motion.div>
    )
  }

  if (animate) {
    return (
      <motion.div
        className={base}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {children}
      </motion.div>
    )
  }

  return <div className={base}>{children}</div>
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-sm font-semibold text-[var(--text-primary)] ${className}`}>
      {children}
    </h3>
  )
}
