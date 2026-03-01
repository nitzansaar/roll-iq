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
    <div className="glass-panel p-4 rounded-xl relative overflow-hidden group hover:border-red-500/30 transition-colors">
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10 flex items-start gap-4 mb-4">
        <div className="w-10 h-10 rounded-xl bg-surface-800/80 shadow-inner ring-1 ring-white/5 flex items-center justify-center flex-shrink-0">
          {severityIcon[weakness.severity]}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-[var(--text-primary)]">{weakness.label}</h4>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Noted in {weakness.count} session{weakness.count !== 1 ? 's' : ''}
          </p>
        </div>
        <span className={`text-[10px] font-medium px-2 py-1 rounded-md ${weakness.severity === 'high' ? 'bg-red-900/30 text-red-400' :
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

      <div className="relative z-10 mt-3 pt-3 border-t border-white/5">
        <span className={`badge bg-surface-900 border text-xs shadow-inner ${getTagColor(weakness.position)}`}>
          {formatTag(weakness.position)}
        </span>
      </div>
    </div>
  )
}

export function StrengthCard({ strength }) {
  return (
    <div className="glass-panel p-4 rounded-xl border-green-500/20 relative overflow-hidden group hover:border-green-500/40 transition-colors">
      <div className="absolute top-0 left-0 w-32 h-32 bg-green-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-green-500/10 ring-1 ring-green-500/20 shadow-inner flex items-center justify-center flex-shrink-0">
          <TrendingUp size={14} className="text-green-400" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">{strength.label}</h4>
          <p className="text-xs text-green-400 mt-0.5">{strength.count} positive mentions</p>
        </div>
      </div>
    </div>
  )
}
