import { useState, useCallback } from 'react'
import useEntriesStore from '../store/entriesStore'
import useUIStore from '../store/uiStore'
import { getRecommendations } from '../lib/youtube'
import { saveVideoInteraction } from '../lib/supabase'
import useAuthStore from '../store/authStore'

export function useRecommendations() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)

  const { summary } = useEntriesStore()
  const { user } = useAuthStore()
  const { toast } = useUIStore()

  const fetchRecommendations = useCallback(async (weaknesses) => {
    setLoading(true)
    try {
      const targets = weaknesses || summary?.weaknesses || []
      const results = await getRecommendations(targets)
      setVideos(results)
    } catch (err) {
      toast.error(err.message, 'Failed to load recommendations')
    } finally {
      setLoading(false)
    }
  }, [summary?.weaknesses])

  const toggleSave = async (videoId) => {
    setVideos(prev =>
      prev.map(v => v.id === videoId ? { ...v, saved: !v.saved } : v)
    )
    const video = videos.find(v => v.id === videoId)
    const action = video?.saved ? 'unsave' : 'save'
    await saveVideoInteraction(user?.id, videoId, action)
    toast.success(action === 'save' ? 'Video saved to watchlist!' : 'Removed from watchlist')
  }

  const submitFeedback = async (videoId, feedback) => {
    setVideos(prev =>
      prev.map(v => v.id === videoId
        ? { ...v, feedback: v.feedback === feedback ? null : feedback }
        : v
      )
    )
    await saveVideoInteraction(user?.id, videoId, feedback)
  }

  return {
    videos,
    loading,
    fetchRecommendations,
    toggleSave,
    submitFeedback,
  }
}
