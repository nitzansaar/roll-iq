/**
 * YouTube Data API wrapper for BJJ video recommendations.
 * Falls back to mock videos when VITE_YOUTUBE_API_KEY is not set.
 */

import { mockVideos } from '../utils/mockData'

const YT_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
export const IS_MOCK = !YT_API_KEY || YT_API_KEY.includes('your_')

const POSITION_QUERY_MAP = {
  'de-la-riva': 'de la riva guard BJJ tutorial',
  'half-guard': 'half guard BJJ technique',
  'back-control': 'back mount BJJ finishing submission',
  'guard': 'closed guard BJJ attacks sweeps',
  'open-guard': 'open guard BJJ retention passing',
  'butterfly-guard': 'butterfly guard BJJ sweeps',
  'single-leg-x': 'single leg x guard heel hook',
  'heel-hooks': 'heel hook BJJ leg lock tutorial',
  'leg-locks': 'leg lock BJJ no gi',
  'side-control': 'side control BJJ escapes attacks',
  'mount': 'mount BJJ attacks escapes',
  'turtle': 'turtle position BJJ back take',
  'takedowns': 'BJJ wrestling takedown technique',
  'triangles': 'triangle choke BJJ setup',
  'armbars': 'armbar BJJ technique',
  'guillotine': 'guillotine choke BJJ no gi',
  'rear-naked-choke': 'rear naked choke BJJ back mount',
  'x-guard': 'x guard BJJ sweeps',
  'knee-on-belly': 'knee on belly BJJ transitions',
  'north-south': 'north south position BJJ chokes',
}

async function searchYouTube(query, maxResults = 5) {
  const params = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video',
    videoDuration: 'medium',
    maxResults,
    key: YT_API_KEY,
    relevanceLanguage: 'en',
  })

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?${params}`
  )

  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.status}`)
  }

  const data = await response.json()
  return data.items.map(item => ({
    id: `yt-${item.id.videoId}`,
    youtubeId: item.id.videoId,
    title: item.snippet.title,
    channel: item.snippet.channelTitle,
    thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
    description: item.snippet.description?.slice(0, 200),
    duration: '—',
    views: '—',
    saved: false,
    feedback: null,
  }))
}

/**
 * Fetch video recommendations for a list of weakness positions
 */
export async function getRecommendations(weaknesses = []) {
  if (IS_MOCK) {
    await new Promise(r => setTimeout(r, 600))

    if (!weaknesses.length) return mockVideos

    // Filter mock videos to match requested positions or return all
    const positionSet = new Set(weaknesses.map(w => w.position || w))
    const filtered = mockVideos.filter(v => positionSet.has(v.position))
    return filtered.length > 0 ? filtered : mockVideos
  }

  const videos = []

  for (const weakness of weaknesses.slice(0, 3)) {
    const position = weakness.position || weakness
    const query = POSITION_QUERY_MAP[position] || `${position.replace(/-/g, ' ')} BJJ`

    try {
      const results = await searchYouTube(query, 2)
      videos.push(...results.map(v => ({ ...v, position })))
    } catch (err) {
      console.warn(`YouTube search failed for ${position}:`, err)
    }
  }

  return videos
}

/**
 * Get a single targeted video for a specific position
 */
export async function getPositionVideo(position) {
  if (IS_MOCK) {
    return mockVideos.find(v => v.position === position) || mockVideos[0]
  }

  const query = POSITION_QUERY_MAP[position] || `${position.replace(/-/g, ' ')} BJJ tutorial`
  const results = await searchYouTube(query, 1)
  return results[0] ? { ...results[0], position } : null
}
