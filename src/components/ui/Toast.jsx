import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import useUIStore from '../../store/uiStore'

const icons = {
  success: <CheckCircle size={15} className="text-green-400 flex-shrink-0" />,
  error: <XCircle size={15} className="text-red-400 flex-shrink-0" />,
  info: <Info size={15} className="text-blue-400 flex-shrink-0" />,
}

const styles = {
  success: 'border-green-500/30 bg-green-900/20',
  error: 'border-red-500/30 bg-red-900/20',
  info: 'border-blue-500/30 bg-blue-900/20',
}

export default function ToastContainer() {
  const { toasts, removeToast } = useUIStore()

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 64, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 64, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`
              pointer-events-auto
              flex items-start gap-3 px-4 py-3 rounded-xl
              border backdrop-blur-sm shadow-lg shadow-black/30
              min-w-[260px] max-w-[360px]
              bg-surface-700/90
              ${styles[toast.type] || styles.info}
            `}
          >
            {icons[toast.type] || icons.info}
            <div className="flex-1 min-w-0">
              {toast.title && (
                <p className="text-xs font-semibold text-[var(--text-primary)] mb-0.5">
                  {toast.title}
                </p>
              )}
              <p className="text-xs text-[var(--text-secondary)]">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X size={13} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
