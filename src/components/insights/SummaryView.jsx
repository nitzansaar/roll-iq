import { Clock, BarChart2, Smile, Zap } from 'lucide-react'
import Card from '../ui/Card'
import { formatDuration } from '../../utils/dateHelpers'

function StatBox({ label, value, icon: Icon, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-900/20 text-blue-400',
    green: 'bg-green-900/20 text-green-400',
    purple: 'bg-purple-900/20 text-purple-400',
    orange: 'bg-orange-900/20 text-orange-400',
  }

  return (
    <div className="bg-surface-600/40 rounded-xl p-4">
      <div className={`w-8 h-8 rounded-lg ${colors[color]} flex items-center justify-center mb-2`}>
        <Icon size={15} />
      </div>
      <p className="text-xl font-bold text-[var(--text-primary)]">{value}</p>
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
    </div>
  )
}

export default function SummaryView({ summary }) {
  if (!summary) return null

  const { stats, content } = summary

  return (
    <div className="space-y-5">
      {/* Stats grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatBox
            label="Sessions"
            value={stats.totalSessions}
            icon={BarChart2}
            color="blue"
          />
          <StatBox
            label="Mat time"
            value={formatDuration(stats.totalMinutes)}
            icon={Clock}
            color="purple"
          />
          <StatBox
            label="Avg mood"
            value={stats.avgMood?.toFixed(1) + '/5'}
            icon={Smile}
            color="green"
          />
          <StatBox
            label="Gi / No-Gi"
            value={`${stats.giSessions}/${stats.nogiSessions}`}
            icon={Zap}
            color="orange"
          />
        </div>
      )}

      {/* AI content */}
      {content && (
        <Card className="prose-custom">
          <MarkdownContent content={content} />
        </Card>
      )}
    </div>
  )
}

function MarkdownContent({ content }) {
  // Simple markdown renderer for headers and lists
  const lines = content.split('\n')

  return (
    <div className="space-y-2 text-sm text-[var(--text-secondary)] leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith('## ')) {
          return <h2 key={i} className="text-base font-semibold text-[var(--text-primary)] mt-4 first:mt-0">{line.slice(3)}</h2>
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={i} className="font-semibold text-[var(--text-primary)]">{line.slice(2, -2)}</p>
        }
        if (line.startsWith('- ')) {
          const text = line.slice(2)
          // Bold text within list item
          const parts = text.split(/\*\*(.*?)\*\*/)
          return (
            <div key={i} className="flex gap-2">
              <span className="text-blue-400 flex-shrink-0 mt-0.5">•</span>
              <p>
                {parts.map((part, j) =>
                  j % 2 === 1 ? <strong key={j} className="text-[var(--text-primary)] font-medium">{part}</strong> : part
                )}
              </p>
            </div>
          )
        }
        if (line.trim() === '') return null
        // Inline bold
        const parts = line.split(/\*\*(.*?)\*\*/)
        if (parts.length === 1) return <p key={i}>{line}</p>
        return (
          <p key={i}>
            {parts.map((part, j) =>
              j % 2 === 1 ? <strong key={j} className="text-[var(--text-primary)] font-medium">{part}</strong> : part
            )}
          </p>
        )
      })}
    </div>
  )
}
