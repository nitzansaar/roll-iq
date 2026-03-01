import { useEffect } from 'react'
import { Video, RefreshCw, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRecommendations } from '../hooks/useRecommendations'
import useEntriesStore from '../store/entriesStore'
import VideoCard from '../components/recommendations/VideoCard'
import Button from '../components/ui/Button'
import { formatTag, getTagColor } from '../utils/tagParser'
import { PageSpinner } from '../components/ui/Spinner'
import { IS_MOCK } from '../lib/youtube'

export default function RecommendationsPage() {
  const { videos, loading, fetchRecommendations, toggleSave, submitFeedback } = useRecommendations()
  const { summary } = useEntriesStore()

  useEffect(() => {
    fetchRecommendations(summary?.weaknesses)
  }, [summary?.weaknesses])

  const weaknesses = summary?.weaknesses || []

  // Group videos by position
  const grouped = {}
  for (const v of videos) {
    const key = v.position || 'general'
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(v)
  }

  if (loading && videos.length === 0) return <PageSpinner />

  return (
    <div className="p-5 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-[var(--text-primary)]">Video Recommendations</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {IS_MOCK ? 'Demo videos — add YouTube API key for real recommendations' : 'Curated for your weak areas'}
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={RefreshCw}
          loading={loading}
          onClick={() => fetchRecommendations(weaknesses)}
        >
          Refresh
        </Button>
      </div>

      {/* Weakness targets */}
      {weaknesses.length > 0 && (
        <div className="mb-6">
          <p className="text-xs text-[var(--text-muted)] mb-2">Targeting your focus areas:</p>
          <div className="flex flex-wrap gap-2">
            {weaknesses.map(w => (
              <span key={w.position} className={`badge border text-xs ${getTagColor(w.position)}`}>
                {w.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* No videos */}
      {videos.length === 0 && !loading && (
        <div className="text-center py-16 bg-surface-700 border border-surface-500/40 rounded-xl">
          <div className="w-14 h-14 rounded-2xl bg-surface-600 flex items-center justify-center mx-auto mb-4">
            <Video size={24} className="text-[var(--text-muted)]" />
          </div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">No recommendations yet</p>
          <p className="text-xs text-[var(--text-muted)] mt-1 mb-4">
            Generate an AI summary first to get targeted video recs
          </p>
        </div>
      )}

      {/* Video grid by position */}
      {Object.entries(grouped).map(([position, posVideos]) => (
        <motion.div
          key={position}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              {formatTag(position)}
            </h2>
            <span className="text-xs text-[var(--text-muted)]">
              {posVideos.length} video{posVideos.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posVideos.map(video => (
              <VideoCard
                key={video.id}
                video={video}
                onSave={toggleSave}
                onFeedback={submitFeedback}
              />
            ))}
          </div>
        </motion.div>
      ))}

      {/* CTA to generate insights first */}
      {videos.length === 0 && !loading && (
        <div className="text-center py-4">
          <Button icon={Sparkles} onClick={() => fetchRecommendations([])}>
            Load Sample Videos
          </Button>
        </div>
      )}
    </div>
  )
}
