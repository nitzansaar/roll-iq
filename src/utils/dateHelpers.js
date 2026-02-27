import {
  format,
  parseISO,
  differenceInCalendarDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  subDays,
  isSameDay,
  isToday,
  isYesterday,
  startOfMonth,
  endOfMonth,
  eachWeekOfInterval,
} from 'date-fns'

export function formatDate(dateStr) {
  const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr
  if (isToday(d)) return 'Today'
  if (isYesterday(d)) return 'Yesterday'
  return format(d, 'MMM d, yyyy')
}

export function formatDateShort(dateStr) {
  const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr
  return format(d, 'MMM d')
}

export function formatRelative(dateStr) {
  const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr
  const days = differenceInCalendarDays(new Date(), d)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

/**
 * Calculate current streak from an array of entries
 * @param {Array} entries - array with { date: 'yyyy-MM-dd' }
 * @returns {{ current: number, longest: number }}
 */
export function calcStreak(entries) {
  if (!entries.length) return { current: 0, longest: 0 }

  // Get unique dates sorted descending
  const dates = [...new Set(entries.map(e => e.date))].sort((a, b) => b.localeCompare(a))
  if (!dates.length) return { current: 0, longest: 0 }

  const today = format(new Date(), 'yyyy-MM-dd')
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')

  // Current streak
  let currentStreak = 0
  let prev = null

  // Start from today or yesterday
  const startDate = dates[0] === today || dates[0] === yesterday ? dates[0] : null

  if (startDate) {
    for (const d of dates) {
      if (prev === null) {
        currentStreak = 1
        prev = d
      } else {
        const diff = differenceInCalendarDays(parseISO(prev), parseISO(d))
        if (diff === 1) {
          currentStreak++
          prev = d
        } else {
          break
        }
      }
    }
  }

  // Longest streak
  let longest = 0
  let run = 0
  let runPrev = null

  for (const d of dates) {
    if (runPrev === null) {
      run = 1
      runPrev = d
    } else {
      const diff = differenceInCalendarDays(parseISO(runPrev), parseISO(d))
      if (diff === 1) {
        run++
        runPrev = d
      } else {
        longest = Math.max(longest, run)
        run = 1
        runPrev = d
      }
    }
  }
  longest = Math.max(longest, run)

  return { current: currentStreak, longest }
}

/**
 * Group entries by week for the weekly view
 */
export function groupByWeek(entries) {
  const groups = {}

  for (const entry of entries) {
    const date = typeof entry.date === 'string' ? parseISO(entry.date) : entry.date
    const weekStart = format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd')
    if (!groups[weekStart]) groups[weekStart] = []
    groups[weekStart].push(entry)
  }

  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([weekStart, entries]) => ({
      weekStart,
      label: `Week of ${format(parseISO(weekStart), 'MMM d')}`,
      entries: entries.sort((a, b) => b.date.localeCompare(a.date)),
    }))
}

/**
 * Build a heatmap-ready array of 84 days (12 weeks × 7 days)
 */
export function buildHeatmapData(entries) {
  const today = new Date()
  const days = []
  const entriesByDate = {}

  for (const e of entries) {
    if (!entriesByDate[e.date]) entriesByDate[e.date] = 0
    entriesByDate[e.date]++
  }

  for (let i = 83; i >= 0; i--) {
    const d = subDays(today, i)
    const key = format(d, 'yyyy-MM-dd')
    days.push({
      date: key,
      label: format(d, 'MMM d'),
      count: entriesByDate[key] || 0,
      isToday: i === 0,
    })
  }

  // Pad the front so week rows start on Monday
  const firstDay = parseISO(days[0].date)
  const dayOfWeek = firstDay.getDay() // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1

  const padded = []
  for (let i = 0; i < mondayOffset; i++) {
    padded.push({ date: null, label: '', count: -1, isToday: false })
  }

  return [...padded, ...days]
}

/**
 * Get stats for a given period
 */
export function getPeriodStats(entries, days = 30) {
  const cutoff = subDays(new Date(), days)
  const filtered = entries.filter(e => parseISO(e.date) >= cutoff)

  const totalMinutes = filtered.reduce((s, e) => s + (e.duration || 0), 0)
  const avgMood = filtered.length
    ? filtered.reduce((s, e) => s + (e.mood || 0), 0) / filtered.length
    : 0
  const avgEnergy = filtered.length
    ? filtered.reduce((s, e) => s + (e.energy || 0), 0) / filtered.length
    : 0
  const totalWins = filtered.reduce((s, e) => s + (e.wins || 0), 0)
  const totalLosses = filtered.reduce((s, e) => s + (e.losses || 0), 0)

  return {
    sessions: filtered.length,
    totalMinutes,
    avgMood: Math.round(avgMood * 10) / 10,
    avgEnergy: Math.round(avgEnergy * 10) / 10,
    winRate: totalWins + totalLosses > 0
      ? Math.round((totalWins / (totalWins + totalLosses)) * 100)
      : 0,
    giSessions: filtered.filter(e => e.type === 'gi').length,
    nogiSessions: filtered.filter(e => e.type === 'nogi').length,
  }
}

export { format, parseISO, subDays, isSameDay, isToday }
