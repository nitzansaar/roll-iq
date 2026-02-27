import { useState } from 'react'
import { format } from 'date-fns'
import { Zap, AlignLeft, ChevronDown, ChevronUp } from 'lucide-react'
import Input, { Textarea, Select } from '../ui/Input'
import Button from '../ui/Button'
import MoodPicker, { EnergyPicker } from './MoodPicker'
import TagPicker from './TagPicker'
import { SegmentedControl } from '../ui/Toggle'
import { useEntries } from '../../hooks/useEntries'
import { useNavigate } from 'react-router-dom'

const TYPE_OPTIONS = [
  { value: 'gi', label: 'Gi' },
  { value: 'nogi', label: 'No-Gi' },
  { value: 'both', label: 'Both' },
]

const DURATION_OPTIONS = [
  { value: '45', label: '45 min' },
  { value: '60', label: '1 hour' },
  { value: '75', label: '1h 15m' },
  { value: '90', label: '1h 30m' },
  { value: '105', label: '1h 45m' },
  { value: '120', label: '2 hours' },
]

const defaultForm = {
  date: format(new Date(), 'yyyy-MM-dd'),
  type: 'gi',
  duration: '90',
  mood: 4,
  energy: 3,
  title: '',
  notes: '',
  wins: 0,
  losses: 0,
  positions: [],
  techniques: [],
  highlights: '',
  improvements: '',
  instructorFeedback: '',
}

export default function EntryForm({ onSaved }) {
  const [mode, setMode] = useState('quick') // 'quick' | 'detailed'
  const [form, setForm] = useState(defaultForm)
  const [saving, setSaving] = useState(false)
  const { saveEntry } = useEntries()
  const navigate = useNavigate()

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        duration: parseInt(form.duration),
        wins: parseInt(form.wins) || 0,
        losses: parseInt(form.losses) || 0,
      }
      const saved = await saveEntry(payload)
      if (onSaved) onSaved(saved)
      else navigate('/journal')
    } catch {
      // error handled in hook
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mode toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[var(--text-primary)]">Log Session</h2>
        <SegmentedControl
          options={[
            { value: 'quick', label: '⚡ Quick' },
            { value: 'detailed', label: '📝 Detailed' },
          ]}
          value={mode}
          onChange={setMode}
        />
      </div>

      {/* Core fields — always shown */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Date"
          type="date"
          value={form.date}
          onChange={e => update('date', e.target.value)}
        />
        <Select
          label="Duration"
          options={DURATION_OPTIONS}
          value={form.duration}
          onChange={e => update('duration', e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-[var(--text-secondary)]">Type</label>
        <div className="flex gap-2">
          {TYPE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update('type', opt.value)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                form.type === opt.value
                  ? 'bg-blue-600/20 border-blue-500/60 text-blue-300'
                  : 'bg-surface-800 border-surface-600 text-[var(--text-muted)] hover:border-surface-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <MoodPicker value={form.mood} onChange={v => update('mood', v)} />
      <EnergyPicker value={form.energy} onChange={v => update('energy', v)} />

      <Textarea
        label="Session notes"
        placeholder="What did you work on? Any key details, drilling, sparring observations..."
        value={form.notes}
        onChange={e => update('notes', e.target.value)}
        rows={mode === 'quick' ? 3 : 5}
      />

      {/* Detailed mode fields */}
      {mode === 'detailed' && (
        <div className="space-y-5 pt-2 border-t border-surface-600">
          <Input
            label="Session title (optional)"
            placeholder="e.g. Evening open mat — working half-guard passes"
            value={form.title}
            onChange={e => update('title', e.target.value)}
          />

          {/* Win/Loss counter */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--text-secondary)]">Submissions won</label>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => update('wins', Math.max(0, form.wins - 1))}
                  className="w-8 h-8 rounded-lg bg-surface-600 text-[var(--text-primary)] hover:bg-surface-500 transition-colors font-medium">−</button>
                <span className="w-8 text-center font-semibold text-green-400">{form.wins}</span>
                <button type="button" onClick={() => update('wins', form.wins + 1)}
                  className="w-8 h-8 rounded-lg bg-surface-600 text-[var(--text-primary)] hover:bg-surface-500 transition-colors font-medium">+</button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--text-secondary)]">Times submitted</label>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => update('losses', Math.max(0, form.losses - 1))}
                  className="w-8 h-8 rounded-lg bg-surface-600 text-[var(--text-primary)] hover:bg-surface-500 transition-colors font-medium">−</button>
                <span className="w-8 text-center font-semibold text-red-400">{form.losses}</span>
                <button type="button" onClick={() => update('losses', form.losses + 1)}
                  className="w-8 h-8 rounded-lg bg-surface-600 text-[var(--text-primary)] hover:bg-surface-500 transition-colors font-medium">+</button>
              </div>
            </div>
          </div>

          <TagPicker
            selected={form.positions}
            onChange={v => update('positions', v)}
          />

          <Textarea
            label="Highlights"
            placeholder="What went well? Any breakthroughs?"
            value={form.highlights}
            onChange={e => update('highlights', e.target.value)}
            rows={2}
          />

          <Textarea
            label="Areas to improve"
            placeholder="What needs work? What got you in trouble?"
            value={form.improvements}
            onChange={e => update('improvements', e.target.value)}
            rows={2}
          />

          <Textarea
            label="Instructor feedback (optional)"
            placeholder="What did your coach say?"
            value={form.instructorFeedback}
            onChange={e => update('instructorFeedback', e.target.value)}
            rows={2}
          />
        </div>
      )}

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={saving} fullWidth>
          {saving ? 'Saving...' : 'Save Entry'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
