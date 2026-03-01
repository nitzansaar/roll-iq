import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, BookOpen, Plus, Sparkles, Video } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Home', exact: true },
  { to: '/journal', icon: BookOpen, label: 'Journal' },
  { to: '/new', icon: Plus, label: 'Log', highlight: true },
  { to: '/insights', icon: Sparkles, label: 'Insights' },
  { to: '/recommendations', icon: Video, label: 'Videos' },
]

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 glass-panel border-t-white/10 border-x-0 border-b-0 rounded-t-2xl pb-safe">
      <div className="flex items-center justify-around px-2 py-3">
        {NAV_ITEMS.map(({ to, icon: Icon, label, exact, highlight }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) => `
              relative flex flex-col items-center gap-1.5 w-16 transition-all duration-200
              ${isActive ? 'text-white' : highlight ? 'text-brand-400' : 'text-surface-400'}
            `}
          >
            {({ isActive }) => (
              <>
                <div className="relative p-2 z-10">
                  {isActive && (
                    <motion.div
                      layoutId="mobile-nav-active"
                      className="absolute inset-0 bg-white/10 rounded-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                  {highlight && !isActive && (
                    <div className="absolute inset-0 bg-brand-500/10 rounded-xl" />
                  )}
                  <Icon size={22} strokeWidth={isActive || highlight ? 2.5 : 2} className="relative z-10" />
                </div>
                <span className={`text-[10px] tracking-wide transition-all ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
