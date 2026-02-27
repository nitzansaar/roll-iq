import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import useUIStore from '../../store/uiStore'

export default function Modal({ name, children, title, size = 'md' }) {
  const { activeModal, closeModal } = useUIStore()
  const isOpen = activeModal === name

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-4xl',
  }

  useEffect(() => {
    const handle = (e) => {
      if (e.key === 'Escape' && isOpen) closeModal()
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          />
          <motion.div
            className={`relative w-full ${sizes[size]} bg-surface-700 border border-surface-500/50 rounded-2xl shadow-2xl shadow-black/50`}
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          >
            {title && (
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-surface-600">
                <h2 className="text-base font-semibold text-[var(--text-primary)]">{title}</h2>
                <button
                  onClick={closeModal}
                  className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-surface-600 transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function ConfirmModal({ name, title, message, onConfirm, confirmLabel = 'Confirm', danger = false }) {
  const { closeModal } = useUIStore()

  return (
    <Modal name={name} title={title} size="sm">
      <p className="text-sm text-[var(--text-secondary)] mb-5">{message}</p>
      <div className="flex justify-end gap-3">
        <button onClick={closeModal} className="btn-secondary text-sm px-4 py-2 rounded-lg">
          Cancel
        </button>
        <button
          onClick={() => { onConfirm(); closeModal() }}
          className={`text-sm px-4 py-2 rounded-lg font-medium transition-all ${
            danger
              ? 'bg-red-600 hover:bg-red-500 text-white'
              : 'btn-primary'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
