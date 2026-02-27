import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, BookOpen, Plus, Sparkles, Video,
  Settings, ChevronLeft, ChevronRight, LogOut, Wifi, WifiOff
} from 'lucide-react'
import useUIStore from '../../store/uiStore'
import useAuthStore from '../../store/authStore'
import { IS_MOCK } from '../../lib/supabase'

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/journal', icon: BookOpen, label: 'Journal' },
  { to: '/new', icon: Plus, label: 'New Entry', highlight: true },
  { to: '/insights', icon: Sparkles, label: 'AI Insights' },
  { to: '/recommendations', icon: Video, label: 'Videos' },
]

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    logout()
    navigate('/auth')
  }

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 64 : 224 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="relative flex flex-col h-full bg-surface-800 border-r border-surface-600 overflow-hidden flex-shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-surface-700">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-600/30">
          <span className="text-white font-bold text-xs">IQ</span>
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="font-semibold text-[var(--text-primary)] text-sm whitespace-nowrap"
            >
              RollIQ
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto scrollbar-hide">
        {NAV_ITEMS.map(({ to, icon: Icon, label, exact, highlight }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              `${isActive ? 'nav-item-active' : 'nav-item'} ${
                highlight ? 'bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 hover:text-blue-300' : ''
              }`
            }
            title={sidebarCollapsed ? label : undefined}
          >
            <Icon size={16} className="flex-shrink-0" />
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="whitespace-nowrap text-sm"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-2 py-3 border-t border-surface-700 space-y-0.5">
        {/* Mock mode indicator */}
        {IS_MOCK && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            title={sidebarCollapsed ? 'Demo mode' : undefined}
          >
            <WifiOff size={13} className="text-yellow-500 flex-shrink-0" />
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-yellow-500 whitespace-nowrap"
                >
                  Demo mode
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        )}

        <NavLink
          to="/settings"
          className={({ isActive }) => isActive ? 'nav-item-active' : 'nav-item'}
          title={sidebarCollapsed ? 'Settings' : undefined}
        >
          <Settings size={16} className="flex-shrink-0" />
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm">
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>

        {/* User */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-surface-600/60 transition-colors group"
          onClick={handleLogout}
          title={sidebarCollapsed ? `Logout (${user?.name || user?.email})` : undefined}
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-xs text-white font-semibold">
            {(user?.name || user?.email || 'D')[0].toUpperCase()}
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-xs font-medium text-[var(--text-primary)] truncate">
                  {user?.name || 'Demo User'}
                </p>
                <p className="text-xs text-[var(--text-muted)] truncate">
                  {user?.email || 'demo@rolliq.app'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          {!sidebarCollapsed && (
            <LogOut size={13} className="text-[var(--text-muted)] group-hover:text-red-400 transition-colors flex-shrink-0" />
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface-600 border border-surface-500 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-surface-500 transition-all z-10 shadow-lg"
      >
        {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  )
}
