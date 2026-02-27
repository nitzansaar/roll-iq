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
    <header className="hidden md:flex items-center justify-between px-6 py-3 border-b border-surface-700 bg-surface-800/50 backdrop-blur-sm flex-shrink-0">
      <div>
        <h1 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs text-white font-semibold">
          {(user?.name || user?.email || 'D')[0].toUpperCase()}
        </div>
      </div>
    </header>
  )
}
