import { buildHeatmapData } from '../../utils/dateHelpers'
import Card, { CardHeader, CardTitle } from '../ui/Card'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getIntensityClass(count) {
  if (count < 0) return 'bg-transparent'
  if (count === 0) return 'bg-surface-600/60'
  if (count === 1) return 'bg-blue-800/70'
  if (count === 2) return 'bg-blue-600/80'
  return 'bg-blue-500'
}

export default function HeatmapCalendar({ entries }) {
  const cells = buildHeatmapData(entries)

  // Build 12 columns (weeks)
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }

  // Get month labels for columns
  const monthLabels = []
  let lastMonth = -1
  weeks.forEach((week, wi) => {
    const firstValidDay = week.find(d => d.date)
    if (firstValidDay) {
      const month = new Date(firstValidDay.date).getMonth()
      if (month !== lastMonth) {
        monthLabels.push({ week: wi, label: MONTHS[month] })
        lastMonth = month
      }
    }
  })

  const totalSessions = cells.filter(c => c.count > 0).length
  const activeDays = cells.filter(c => c.count > 0 && c.date)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Training Activity</CardTitle>
        <span className="text-xs text-[var(--text-muted)]">
          {totalSessions} sessions in last 12 weeks
        </span>
      </CardHeader>

      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {/* Day labels */}
          <div className="flex flex-col gap-1 pt-5">
            {DAYS.map((day, i) => (
              <div key={day} className="h-3 flex items-center">
                <span className="text-[9px] text-[var(--text-muted)] w-6">
                  {i % 2 === 0 ? day : ''}
                </span>
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex flex-col">
            {/* Month labels */}
            <div className="flex gap-1 mb-1 h-4">
              {weeks.map((_, wi) => {
                const ml = monthLabels.find(m => m.week === wi)
                return (
                  <div key={wi} className="w-3 text-[9px] text-[var(--text-muted)]">
                    {ml?.label || ''}
                  </div>
                )
              })}
            </div>

            {/* Cells — render by week columns */}
            <div className="flex gap-1">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((cell, di) => (
                    <div
                      key={di}
                      title={cell.date ? `${cell.label}: ${cell.count} session${cell.count !== 1 ? 's' : ''}` : ''}
                      className={`
                        heatmap-cell w-3 h-3 rounded-sm
                        ${getIntensityClass(cell.count)}
                        ${cell.isToday ? 'ring-1 ring-blue-400 ring-offset-1 ring-offset-[#1a1a24]' : ''}
                      `}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 mt-3">
        <span className="text-[10px] text-[var(--text-muted)]">Less</span>
        {[0, 1, 2, 3].map(level => (
          <div
            key={level}
            className={`w-3 h-3 rounded-sm ${getIntensityClass(level)}`}
          />
        ))}
        <span className="text-[10px] text-[var(--text-muted)]">More</span>
      </div>
    </Card>
  )
}
