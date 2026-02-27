import { Sparkles, TrendingUp, AlertTriangle, Clock, Target, Zap } from 'lucide-react'
import Card, { CardHeader, CardTitle } from '../ui/Card'
import Button from '../ui/Button'
import { formatTag } from '../../utils/tagParser'
import { useSummary } from '../../hooks/useSummary'
import { useNavigate } from 'react-router-dom'

const severityColor = {
  high: 'text-red-400 bg-red-900/20',
  medium: 'text-orange-400 bg-orange-900/20',
  low: 'text-yellow-400 bg-yellow-900/20',
}

export default function SummaryCard() {
  const { summary, summaryLoading, generateSummary } = useSummary()
  const navigate = useNavigate()

  if (summaryLoading) {
    return (
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Sparkles size={16} className="text-purple-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Generating AI insights...</h3>
            <p className="text-xs text-[var(--text-muted)]">Analyzing your recent training</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-4/5 rounded" />
          <div className="skeleton h-3 w-3/5 rounded" />
        </div>
      </Card>
    )
  }

  if (!summary) {
    return (
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Sparkles size={16} className="text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">AI Training Insights</h3>
            <p className="text-xs text-[var(--text-muted)]">Get personalized coaching analysis</p>
          </div>
        </div>
        <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed">
          Generate an AI-powered analysis of your recent training sessions to identify patterns, weaknesses, and opportunities for improvement.
        </p>
        <Button
          onClick={() => generateSummary('last-30-days')}
          icon={Sparkles}
          size="sm"
          fullWidth
        >
          Generate Summary
        </Button>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Sparkles size={14} className="text-purple-400" />
          </div>
          <CardTitle>AI Insights</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => navigate('/insights')}
        >
          Full report →
        </Button>
      </CardHeader>

      {/* Stats row */}
      {summary.stats && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-surface-600/50 rounded-lg p-2.5 text-center">
            <p className="text-lg font-bold text-[var(--text-primary)]">{summary.stats.totalSessions}</p>
            <p className="text-[10px] text-[var(--text-muted)]">Sessions</p>
          </div>
          <div className="bg-surface-600/50 rounded-lg p-2.5 text-center">
            <p className="text-lg font-bold text-[var(--text-primary)]">
              {Math.round(summary.stats.totalMinutes / 60)}h
            </p>
            <p className="text-[10px] text-[var(--text-muted)]">Mat time</p>
          </div>
          <div className="bg-surface-600/50 rounded-lg p-2.5 text-center">
            <p className="text-lg font-bold text-[var(--text-primary)]">
              {summary.stats.avgMood?.toFixed(1)}
            </p>
            <p className="text-[10px] text-[var(--text-muted)]">Avg mood</p>
          </div>
        </div>
      )}

      {/* Weaknesses */}
      {summary.weaknesses?.length > 0 && (
        <div className="space-y-2 mb-4">
          <p className="section-label flex items-center gap-1.5">
            <AlertTriangle size={10} /> Focus areas
          </p>
          {summary.weaknesses.slice(0, 3).map(w => (
            <div key={w.position} className="flex items-center justify-between gap-2">
              <span className="text-xs text-[var(--text-secondary)]">{w.label}</span>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${severityColor[w.severity]}`}>
                {w.severity}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Strengths */}
      {summary.strengths?.length > 0 && (
        <div className="space-y-2">
          <p className="section-label flex items-center gap-1.5">
            <TrendingUp size={10} /> Improving
          </p>
          {summary.strengths.slice(0, 2).map(s => (
            <div key={s.position} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
              <span className="text-xs text-[var(--text-secondary)]">{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
