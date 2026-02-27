import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ArrowRight, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEntries } from '../hooks/useEntries'
import { useSummary } from '../hooks/useSummary'
import useAuthStore from '../store/authStore'
import HeatmapCalendar from '../components/dashboard/HeatmapCalendar'
import StreakWidget from '../components/dashboard/StreakWidget'
import PositionChart from '../components/dashboard/PositionChart'
import SummaryCard from '../components/dashboard/SummaryCard'
import EntryCard from '../components/journal/EntryCard'
import Button from '../components/ui/Button'
import { getPeriodStats } from '../utils/dateHelpers'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } }
}

export default function HomePage() {
  const { user } = useAuthStore()
  const { entries, loading } = useEntries()
  const { summary } = useSummary()

  const recentEntries = entries.slice(0, 3)
  const stats = getPeriodStats(entries, 30)

  const firstName = user?.name?.split(' ')[0] || 'Practitioner'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="p-5 md:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-xl font-bold text-[var(--text-primary)]">
          {greeting}, {firstName} 👋
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-0.5">
          {entries.length === 0
            ? 'Start logging your training sessions'
            : `${stats.sessions} sessions this month · ${Math.round(stats.totalMinutes / 60)}h mat time`
          }
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-5"
      >
        {/* Left column — main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Streak widgets */}
          <motion.div variants={itemVariants}>
            <StreakWidget entries={entries} />
          </motion.div>

          {/* Heatmap */}
          <motion.div variants={itemVariants}>
            <HeatmapCalendar entries={entries} />
          </motion.div>

          {/* Position chart */}
          <motion.div variants={itemVariants}>
            <PositionChart entries={entries} />
          </motion.div>
        </div>

        {/* Right column — sidebar content */}
        <div className="space-y-5">
          {/* Quick log CTA */}
          <motion.div variants={itemVariants}>
            <Link
              to="/new"
              className="block bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-5 hover:from-blue-600/30 hover:to-purple-600/30 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-blue-600/30 flex items-center justify-center group-hover:bg-blue-600/40 transition-colors">
                  <Plus size={18} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">Log Today's Session</h3>
                  <p className="text-xs text-[var(--text-muted)]">Quick or detailed mode</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-blue-400 font-medium">Start logging →</span>
              </div>
            </Link>
          </motion.div>

          {/* AI Summary card */}
          <motion.div variants={itemVariants}>
            <SummaryCard />
          </motion.div>

          {/* Recent entries */}
          {recentEntries.length > 0 && (
            <motion.div variants={itemVariants} className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">Recent Sessions</h2>
                <Link
                  to="/journal"
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                >
                  View all <ArrowRight size={11} />
                </Link>
              </div>
              {recentEntries.map(entry => (
                <EntryCard key={entry.id} entry={entry} compact />
              ))}
            </motion.div>
          )}

          {/* Empty state */}
          {entries.length === 0 && !loading && (
            <motion.div variants={itemVariants}>
              <div className="text-center py-8 bg-surface-700 border border-surface-500/40 rounded-xl">
                <BookOpen size={28} className="text-[var(--text-muted)] mx-auto mb-3" />
                <p className="text-sm font-medium text-[var(--text-secondary)]">No sessions yet</p>
                <p className="text-xs text-[var(--text-muted)] mt-1 mb-4">Log your first training session</p>
                <Button size="sm" icon={Plus} onClick={() => {}}>
                  <Link to="/new">Log Session</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
