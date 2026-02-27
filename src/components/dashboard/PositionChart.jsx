import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import Card, { CardHeader, CardTitle } from '../ui/Card'
import { mockPositionStats } from '../../utils/mockData'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const { wins, losses } = payload[0]?.payload || {}
  const total = wins + losses
  const rate = total ? Math.round((wins / total) * 100) : 0

  return (
    <div className="bg-surface-600 border border-surface-500 rounded-lg px-3 py-2.5 shadow-xl">
      <p className="text-xs font-medium text-[var(--text-primary)] mb-1">{label}</p>
      <p className="text-xs text-green-400">{wins} wins</p>
      <p className="text-xs text-red-400">{losses} losses</p>
      <p className="text-xs text-[var(--text-muted)] mt-1">{rate}% win rate</p>
    </div>
  )
}

export default function PositionChart({ entries }) {
  // Build stats from entries if provided, otherwise use mock
  let data = mockPositionStats

  if (entries?.length > 0) {
    const posMap = {}
    for (const e of entries) {
      for (const pos of (e.positions || [])) {
        if (!posMap[pos]) posMap[pos] = { wins: 0, losses: 0 }
        posMap[pos].wins += e.wins || 0
        posMap[pos].losses += e.losses || 0
      }
    }

    const built = Object.entries(posMap)
      .map(([p, s]) => ({
        position: p.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '),
        ...s,
        total: s.wins + s.losses
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 6)

    if (built.length > 0) data = built
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Position Performance</CardTitle>
        <span className="text-xs text-[var(--text-muted)]">Wins vs losses</span>
      </CardHeader>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2c2c3a" vertical={false} />
            <XAxis
              dataKey="position"
              tick={{ fontSize: 10, fill: '#6b6b80' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#6b6b80' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="wins" fill="#16a34a" radius={[3, 3, 0, 0]} maxBarSize={20} />
            <Bar dataKey="losses" fill="#dc2626" radius={[3, 3, 0, 0]} maxBarSize={20} opacity={0.6} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 mt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-green-600" />
          <span className="text-xs text-[var(--text-muted)]">Wins</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-red-600 opacity-60" />
          <span className="text-xs text-[var(--text-muted)]">Losses</span>
        </div>
      </div>
    </Card>
  )
}
