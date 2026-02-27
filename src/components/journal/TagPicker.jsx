import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { POSITIONS } from '../../utils/mockData'
import { formatTag, getTagColor } from '../../utils/tagParser'

const COMMON_POSITIONS = [
  'guard', 'half-guard', 'side-control', 'mount', 'back-control',
  'open-guard', 'butterfly-guard', 'takedowns', 'leg-locks', 'heel-hooks',
  'armbars', 'triangles', 'guillotine', 'rear-naked-choke',
]

export default function TagPicker({ selected = [], onChange, label = 'Positions & Techniques' }) {
  const [search, setSearch] = useState('')
  const [showAll, setShowAll] = useState(false)

  const filtered = POSITIONS.filter(p =>
    (search ? p.includes(search.toLowerCase()) : true) &&
    !selected.includes(p)
  )

  const displayed = showAll ? filtered : filtered.slice(0, 12)

  const toggle = (pos) => {
    if (selected.includes(pos)) {
      onChange(selected.filter(p => p !== pos))
    } else {
      onChange([...selected, pos])
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-[var(--text-secondary)]">{label}</label>

      {/* Selected tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map(pos => (
            <button
              key={pos}
              type="button"
              onClick={() => toggle(pos)}
              className={`badge border text-xs ${getTagColor(pos)} flex items-center gap-1`}
            >
              {formatTag(pos)}
              <X size={10} />
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <input
        type="text"
        placeholder="Search positions..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="input-base text-xs py-1.5"
      />

      {/* Suggestions */}
      <div className="flex flex-wrap gap-1.5">
        {(search ? displayed : COMMON_POSITIONS.filter(p => !selected.includes(p))).map(pos => (
          <button
            key={pos}
            type="button"
            onClick={() => toggle(pos)}
            className="badge border bg-surface-600/40 text-[var(--text-muted)] border-surface-500 hover:bg-surface-500/60 hover:text-[var(--text-secondary)] transition-all text-xs"
          >
            <Plus size={9} className="mr-0.5" />
            {formatTag(pos)}
          </button>
        ))}
      </div>
    </div>
  )
}
