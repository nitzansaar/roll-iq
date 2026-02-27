import { AlertTriangle, TrendingUp, TrendingDown, Info } from 'lucide-react'
import Card from '../ui/Card'
import { formatTag, getTagColor } from '../../utils/tagParser'

const severityIcon = {
  high: <AlertTriangle size={14} className="text-red-400" />,
  medium: <TrendingDown size={14} className="text-orange-400" />,
  low: <Info size={14} className="text-yellow-400" />,
}

const severityBar = {
  high: 'bg-red-500',
  medium: 'bg-orange-500',
  low: 'bg-yellow-500',
}

const severityWidth = {
  high: 'w-full',
  medium: 'w-2/3',
  low: 'w-1/3',
}

export function WeaknessCard({ weakness }) {
  return (
    <Card className="border-surface-500/30">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-surface-600 flex items-center justify-center flex-shrink-0">
          {severityIcon[weakness.severity]}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-[var(--text-primary)]">{weakness.label}</h4>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Noted in {weakness.count} session{weakness.count !== 1 ? 's' : ''}
          </p>
        </div>
        <span className={`text-[10px] font-medium px-2 py-1 rounded-md ${
          weakness.severity === 'high' ? 'bg-red-900/30 text-red-400' :
          weakness.severity === 'medium' ? 'bg-orange-900/30 text-orange-400' :
          'bg-yellow-900/30 text-yellow-400'
        }`}>
          {weakness.severity}
        </span>
      </div>

      {/* Severity bar */}
      <div className="h-1 bg-surface-600 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${severityBar[weakness.severity]} ${severityWidth[weakness.severity]}`} />
      </div>

      <div className="mt-2">
        <span className={`badge border text-xs ${getTagColor(weakness.position)}`}>
          {formatTag(weakness.position)}
        </span>
      </div>
    </Card>
  )
}

export function StrengthCard({ strength }) {
  return (
    <Card className="border-green-900/30 bg-green-900/5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-green-900/30 flex items-center justify-center flex-shrink-0">
          <TrendingUp size={14} className="text-green-400" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[var(--text-primary)]">{strength.label}</h4>
          <p className="text-xs text-green-400/80">{strength.count} positive mentions</p>
        </div>
      </div>
    </Card>
  )
}
