import { NavLink } from 'react-router-dom'
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
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface-800 border-t border-surface-600 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map(({ to, icon: Icon, label, exact, highlight }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) => `
              flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all duration-150
              ${isActive
                ? 'text-blue-400'
                : highlight
                ? 'text-blue-400 bg-blue-600/10'
                : 'text-[var(--text-muted)]'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <div className={`
                  p-1.5 rounded-lg transition-all
                  ${isActive ? 'bg-blue-600/20' : highlight ? 'bg-blue-600/10' : ''}
                `}>
                  <Icon size={18} />
                </div>
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
