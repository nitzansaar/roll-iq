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
    <div className="glass-panel rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 group">
      <div className={`w-8 h-8 rounded-lg ${colors[color]} flex items-center justify-center mb-2`}>
        <Icon size={15} />
      </div>
      <p className="text-xl font-bold text-white tracking-tight">{value}</p>
      <p className="text-[10px] uppercase font-medium tracking-wider text-[var(--text-muted)] mt-0.5">{label}</p>
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
        </div>
      )}

      {/* AI content */}
      {content && (
        <Card className="prose-custom shadow-xl border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 blur-[80px] rounded-full pointer-events-none" />
          <MarkdownContent content={content} />
        </Card>
      )}
    </div>
  )
}

function MarkdownContent({ content }) {
  // Simple markdown renderer for headers and lists
  // Clean up any stray markdown characters
  const cleanLine = (line) => line.replace(/^#+\s*/, '')

  const lines = content.split('\n')

  return (
    <div className="space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
      {lines.map((line, i) => {
        const trimmed = line.trim()
        if (!trimmed) return null

        // Header detection (either literal markdown ## or just bold text that acts as a header)
        if (trimmed.startsWith('#') || (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.includes('-'))) {
          const text = trimmed.replace(/^#+\s*/, '').replace(/\*\*/g, '')
          return (
            <h3 key={i} className="text-base font-bold text-white tracking-tight mt-6 first:mt-0 flex items-center gap-2">
              <div className="w-1.5 h-4 bg-brand-500 rounded-full" />
              {text}
            </h3>
          )
        }

        // List item detection
        if (trimmed.startsWith('-') || trimmed.startsWith('* ')) {
          const text = trimmed.replace(/^[-*]\s*/, '')
          // Bold text within list item
          const parts = text.split(/\*\*(.*?)\*\*/)
          return (
            <div key={i} className="flex gap-3 items-start glass-panel bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0 mt-2 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
              <p className="flex-1 text-white/80">
                {parts.map((part, j) =>
                  j % 2 === 1 ? <strong key={j} className="text-white font-semibold">{part}</strong> : part
                )}
              </p>
            </div>
          )
        }

        // Inline bold paragraph
        const parts = trimmed.split(/\*\*(.*?)\*\*/)
        if (parts.length === 1) return <p key={i} className="text-white/70">{trimmed}</p>
        return (
          <p key={i} className="text-white/70">
            {parts.map((part, j) =>
              j % 2 === 1 ? <strong key={j} className="text-white font-semibold">{part}</strong> : part
            )}
          </p>
        )
      })}
    </div>
  )
}
