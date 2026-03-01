import { Bell, Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/journal': 'Training Journal',
  '/new': 'New Entry',
  '/insights': 'AI Insights',
  '/recommendations': 'Video Recs',
  '/settings': 'Settings',
}

export default function TopBar() {
  const { pathname } = useLocation()
  const { user } = useAuthStore()
  const title = PAGE_TITLES[pathname] || 'RollIQ'

  return (
    <header className="hidden md:flex items-center justify-between px-6 py-3 glass-panel flex-shrink-0 z-10 relative">
      <div>
        <h1 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-xs text-white font-semibold shadow-lg shadow-brand-500/20 ring-2 ring-white/10 cursor-pointer hover:scale-105 transition-transform">
          {(user?.name || user?.email || 'D')[0].toUpperCase()}
        </div>
      </div>
    </header>
  )
}
