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
      className="relative flex flex-col h-full bg-surface-900/40 backdrop-blur-2xl border-r border-white/5 overflow-hidden flex-shrink-0 z-20"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-500/30 border border-white/10 ring-1 ring-white/5">
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
              `${isActive ? 'nav-item-active' : 'nav-item'} ${highlight ? 'text-brand-400' : ''
              }`
            }
            title={sidebarCollapsed ? label : undefined}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-white/10 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
                <div className="relative z-10 flex items-center gap-3 w-full">
                  <Icon size={18} className={`flex-shrink-0 ${isActive && highlight ? 'text-brand-400' : ''}`} />
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -4 }}
                        transition={{ duration: 0.15 }}
                        className="whitespace-nowrap text-sm font-medium"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-white/5 space-y-1">
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
          className={({ isActive }) => `${isActive ? 'nav-item-active' : 'nav-item'}`}
          title={sidebarCollapsed ? 'Settings' : undefined}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-white/10 rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-3 w-full">
                <Settings size={18} className="flex-shrink-0" />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-medium">
                      Settings
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </NavLink>

        {/* User */}
        <div
          className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-white/5 transition-colors group relative"
          onClick={handleLogout}
          title={sidebarCollapsed ? `Logout (${user?.name || user?.email})` : undefined}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-xs text-white font-semibold ring-2 ring-white/10 group-hover:scale-105 transition-transform">
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
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface-800 border-2 border-surface-600 flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:border-brand-500 hover:shadow-lg hover:shadow-brand-500/20 transition-all z-30 shadow-md"
      >
        {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  )
}
