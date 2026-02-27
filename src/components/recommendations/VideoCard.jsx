import { useState } from 'react'
import { Play, ThumbsUp, ThumbsDown, Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react'
import { formatTag, getTagColor } from '../../utils/tagParser'

export default function VideoCard({ video, onSave, onFeedback }) {
  const [imgError, setImgError] = useState(false)

  const ytUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`

  const thumbnailUrl = !imgError
    ? (video.thumbnail || `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`)
    : null

  return (
    <div className="bg-surface-700 border border-surface-500/40 rounded-xl overflow-hidden hover:border-surface-400/60 transition-all duration-200 group">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-surface-800 overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play size={32} className="text-[var(--text-muted)]" />
          </div>
        )}

        {/* Play overlay */}
        <a
          href={ytUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
            <Play size={18} className="text-white ml-0.5" fill="white" />
          </div>
        </a>

        {/* Duration badge */}
        {video.duration && video.duration !== '—' && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
            {video.duration}
          </span>
        )}

        {/* Position tag */}
        {video.position && (
          <span className={`absolute top-2 left-2 badge border text-[10px] ${getTagColor(video.position)} backdrop-blur-sm`}>
            {formatTag(video.position)}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <a
          href={ytUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-1 group/title"
        >
          <h3 className="text-sm font-semibold text-[var(--text-primary)] line-clamp-2 leading-snug group-hover/title:text-blue-400 transition-colors">
            {video.title}
          </h3>
        </a>

        <p className="text-xs text-[var(--text-muted)] mb-3">
          {video.channel}
          {video.views && video.views !== '—' && ` • ${video.views} views`}
        </p>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onFeedback?.(video.id, 'like')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              video.feedback === 'like'
                ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                : 'bg-surface-600/50 text-[var(--text-muted)] hover:text-green-400 hover:bg-green-900/20'
            }`}
          >
            <ThumbsUp size={12} /> Helpful
          </button>

          <button
            onClick={() => onFeedback?.(video.id, 'dislike')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              video.feedback === 'dislike'
                ? 'bg-red-600/20 text-red-400 border border-red-600/30'
                : 'bg-surface-600/50 text-[var(--text-muted)] hover:text-red-400 hover:bg-red-900/20'
            }`}
          >
            <ThumbsDown size={12} />
          </button>

          <button
            onClick={() => onSave?.(video.id)}
            className={`ml-auto flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              video.saved
                ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                : 'bg-surface-600/50 text-[var(--text-muted)] hover:text-blue-400 hover:bg-blue-900/20'
            }`}
          >
            {video.saved ? <BookmarkCheck size={12} /> : <Bookmark size={12} />}
            {video.saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
