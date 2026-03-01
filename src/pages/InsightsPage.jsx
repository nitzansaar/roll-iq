import { Sparkles, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSummary } from '../hooks/useSummary'
import { useEntries } from '../hooks/useEntries'
import Button from '../components/ui/Button'
import { SegmentedControl } from '../components/ui/Toggle'
import SummaryView from '../components/insights/SummaryView'
import { WeaknessCard, StrengthCard } from '../components/insights/InsightCard'
import { useState } from 'react'
import { PageSpinner } from '../components/ui/Spinner'
import { IS_MOCK as GROQ_MOCK } from '../lib/groq'

export default function InsightsPage() {
  const [period, setPeriod] = useState('last-30-days')
  const { summary, summaryLoading, generateSummary } = useSummary()
  const { entries, loading } = useEntries()

  if (loading) return <PageSpinner />

  return (
    <div className="p-5 md:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-[var(--text-primary)]">AI Insights</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {GROQ_MOCK ? 'Running with demo AI — add Groq API key for real analysis' : 'Powered by Groq LLaMA 3'}
          </p>
        </div>

        <Button
          onClick={() => generateSummary(period)}
          loading={summaryLoading}
          icon={summary ? RefreshCw : Sparkles}
          size="sm"
        >
          {summary ? 'Regenerate' : 'Generate'}
        </Button>
      </div>

      {/* Period selector */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs text-[var(--text-muted)]">Period:</span>
        <SegmentedControl
          options={[
            { value: 'last-7-days', label: '7 days' },
            { value: 'last-30-days', label: '30 days' },
          ]}
          value={period}
          onChange={setPeriod}
        />
      </div>

      {/* Loading state */}
      {summaryLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel rounded-2xl p-10 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-full border-2 border-surface-500/30 border-t-brand-500 animate-[spin_1s_ease-in-out_infinite] mx-auto mb-5 shadow-[0_0_15px_rgba(99,102,241,0.3)]" />
            <p className="text-sm font-semibold text-white tracking-wide">Analyzing your training...</p>
            <p className="text-xs text-[var(--text-muted)] mt-1.5">
              {GROQ_MOCK ? 'Loading mock insights' : 'AI processing your sessions'}
            </p>
          </div>
        </motion.div>
      )}

      {/* No summary yet */}
      {!summaryLoading && !summary && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-10 rounded-2xl text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-purple-500/5 pointer-events-none" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-5 ring-1 ring-brand-500/20 shadow-inner">
              <Sparkles size={28} className="text-brand-400" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight mb-2">
              Ready to analyze your training
            </h2>
            <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto mb-6 leading-relaxed">
              Generate an AI-powered breakdown of your patterns, weaknesses, and strengths based on your logged sessions.
            </p>
            <Button
              onClick={() => generateSummary(period)}
              icon={Sparkles}
            >
              Generate {period === 'last-7-days' ? '7-Day' : '30-Day'} Summary
            </Button>
            {entries.length === 0 && (
              <p className="text-xs text-[var(--text-muted)] mt-4">
                Tip: Log some sessions first for better insights
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Summary content */}
      {!summaryLoading && summary && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Overview stats */}
          <SummaryView summary={summary} />

          {/* Weaknesses */}
          {summary.weaknesses?.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Areas to Focus On
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {summary.weaknesses.map(w => (
                  <WeaknessCard key={w.position} weakness={w} />
                ))}
              </div>
            </div>
          )}

          {/* Strengths */}
          {summary.strengths?.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Growing Strengths
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {summary.strengths.map(s => (
                  <StrengthCard key={s.position} strength={s} />
                ))}
              </div>
            </div>
          )}

          {/* Regenerate footer */}
          <div className="flex items-center justify-between pt-2 border-t border-surface-600">
            <p className="text-xs text-[var(--text-muted)]">
              Generated {new Date(summary.generatedAt).toLocaleDateString()}
            </p>
            <Button
              variant="ghost"
              size="sm"
              icon={RefreshCw}
              onClick={() => generateSummary(period)}
            >
              Regenerate
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
