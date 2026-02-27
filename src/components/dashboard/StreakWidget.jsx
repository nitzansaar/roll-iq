import { Flame, Trophy, Calendar } from 'lucide-react'
import Card from '../ui/Card'
import { calcStreak } from '../../utils/dateHelpers'

export default function StreakWidget({ entries }) {
  const { current, longest } = calcStreak(entries)

  return (
    <div className="grid grid-cols-3 gap-3">
      <Card className="text-center">
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center mb-1">
            <Flame size={20} className="text-orange-400" />
          </div>
          <span className="text-2xl font-bold text-[var(--text-primary)]">{current}</span>
          <span className="text-xs text-[var(--text-muted)]">Day streak</span>
        </div>
      </Card>

      <Card className="text-center">
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-1">
            <Trophy size={20} className="text-purple-400" />
          </div>
          <span className="text-2xl font-bold text-[var(--text-primary)]">{longest}</span>
          <span className="text-xs text-[var(--text-muted)]">Best streak</span>
        </div>
      </Card>

      <Card className="text-center">
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-1">
            <Calendar size={20} className="text-blue-400" />
          </div>
          <span className="text-2xl font-bold text-[var(--text-primary)]">
            {entries.filter(e => {
              const d = new Date(e.date)
              const now = new Date()
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
            }).length}
          </span>
          <span className="text-xs text-[var(--text-muted)]">This month</span>
        </div>
      </Card>
    </div>
  )
}
