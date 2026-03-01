import { useCallback } from 'react'
import useEntriesStore from '../store/entriesStore'
import useUIStore from '../store/uiStore'
import { generateTrainingSummary } from '../lib/groq'
import { generateWithGemini } from '../lib/gemini'
import { IS_MOCK as GROQ_MOCK } from '../lib/groq'
import { subDays, parseISO } from 'date-fns'

export function useSummary() {
  const { summary, summaryLoading, setSummary, setSummaryLoading } = useEntriesStore()
  const { toast } = useUIStore()

  const generateSummary = useCallback(async (period = 'last-30-days') => {
    // Guard against concurrent calls and read fresh entries at call time
    const { summaryLoading: isLoading, entries } = useEntriesStore.getState()
    if (isLoading) return

    setSummaryLoading(true)
    try {
      const days = period === 'last-7-days' ? 7 : 30
      const cutoff = subDays(new Date(), days)
      const periodEntries = entries.filter(e => e.date && parseISO(e.date) >= cutoff)

      if (periodEntries.length === 0) {
        toast.info('No entries found for this period. Log some sessions first!')
        setSummaryLoading(false)
        return
      }

      let result
      try {
        result = await generateTrainingSummary(periodEntries, period)
      } catch (groqErr) {
        console.warn('Groq failed, trying Gemini:', groqErr)
        try {
          const content = await generateWithGemini(
            `Analyze these ${periodEntries.length} BJJ training sessions and provide insights:\n${JSON.stringify(periodEntries.slice(0, 10))}`
          )
          result = { content, weaknesses: [], strengths: [] }
        } catch {
          throw groqErr
        }
      }

      const summaryObj = {
        id: `summary-${Date.now()}`,
        generatedAt: new Date().toISOString(),
        period,
        content: result.content,
        weaknesses: result.weaknesses || [],
        strengths: result.strengths || [],
        stats: {
          totalSessions: periodEntries.length,
          totalMinutes: periodEntries.reduce((s, e) => s + (e.duration || 0), 0),
          avgMood: periodEntries.reduce((s, e) => s + (e.mood || 0), 0) / periodEntries.length,
        }
      }

      setSummary(summaryObj)
      toast.success('AI summary generated!')
      return summaryObj
    } catch (err) {
      toast.error(err.message, 'Failed to generate summary')
    } finally {
      setSummaryLoading(false)
    }
  }, [])

  return {
    summary,
    summaryLoading,
    generateSummary,
  }
}
