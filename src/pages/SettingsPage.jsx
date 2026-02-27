import { useState } from 'react'
import { User, Download, Key, Trash2, ChevronRight } from 'lucide-react'
import Card, { CardHeader, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Toggle from '../components/ui/Toggle'
import useAuthStore from '../store/authStore'
import useEntriesStore from '../store/entriesStore'
import useUIStore from '../store/uiStore'
import { IS_MOCK } from '../lib/supabase'

export default function SettingsPage() {
  const { user } = useAuthStore()
  const { entries } = useEntriesStore()
  const { toast } = useUIStore()
  const [giDefault, setGiDefault] = useState(true)
  const [instructor, setInstructor] = useState(user?.instructor || '')

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rolliq-journal-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Journal exported as JSON')
  }

  const exportCSV = () => {
    const headers = ['date', 'type', 'duration', 'mood', 'energy', 'title', 'notes', 'wins', 'losses', 'positions']
    const rows = entries.map(e => [
      e.date, e.type, e.duration, e.mood, e.energy,
      `"${(e.title || '').replace(/"/g, '""')}"`,
      `"${(e.notes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      e.wins, e.losses,
      `"${(e.positions || []).join(', ')}"`
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rolliq-journal-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Journal exported as CSV')
  }

  return (
    <div className="p-5 md:p-6 max-w-2xl mx-auto space-y-5">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">Preferences and account</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl text-white font-bold shadow-lg">
            {(user?.name || user?.email || 'D')[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-[var(--text-primary)]">{user?.name || 'Demo User'}</p>
            <p className="text-xs text-[var(--text-muted)]">{user?.email || 'demo@rolliq.app'}</p>
            {user?.belt && (
              <p className="text-xs text-[var(--text-muted)] capitalize mt-0.5">
                {user.belt} belt · {user.stripes} stripe{user.stripes !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        <Input
          label="Instructor / Coach"
          placeholder="Coach name"
          value={instructor}
          onChange={e => setInstructor(e.target.value)}
        />
      </Card>

      {/* Training preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Training Preferences</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm text-[var(--text-primary)]">Default to Gi</p>
              <p className="text-xs text-[var(--text-muted)]">When logging new entries</p>
            </div>
            <Toggle checked={giDefault} onChange={setGiDefault} />
          </div>
        </div>
      </Card>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <span className="text-xs text-[var(--text-muted)]">Configure in .env.local</span>
        </CardHeader>
        <div className="space-y-3">
          {[
            { name: 'Supabase', key: 'VITE_SUPABASE_URL', connected: !IS_MOCK },
            { name: 'Groq AI', key: 'VITE_GROQ_API_KEY', connected: !!import.meta.env.VITE_GROQ_API_KEY },
            { name: 'YouTube', key: 'VITE_YOUTUBE_API_KEY', connected: !!import.meta.env.VITE_YOUTUBE_API_KEY },
            { name: 'Gemini AI', key: 'VITE_GEMINI_API_KEY', connected: !!import.meta.env.VITE_GEMINI_API_KEY },
          ].map(({ name, key, connected }) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-surface-600 last:border-0">
              <div className="flex items-center gap-2">
                <Key size={13} className="text-[var(--text-muted)]" />
                <div>
                  <p className="text-sm text-[var(--text-primary)]">{name}</p>
                  <p className="text-[10px] text-[var(--text-muted)] font-mono">{key}</p>
                </div>
              </div>
              <span className={`text-[10px] font-medium px-2 py-1 rounded-md ${
                connected
                  ? 'bg-green-900/30 text-green-400'
                  : 'bg-surface-600 text-[var(--text-muted)]'
              }`}>
                {connected ? 'Connected' : 'Not set'}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-3">
          Add keys to <code className="bg-surface-600 px-1 py-0.5 rounded text-[10px]">.env.local</code> and restart the dev server.
        </p>
      </Card>

      {/* Export */}
      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
        </CardHeader>
        <p className="text-xs text-[var(--text-secondary)] mb-4">
          Download your complete training journal. {entries.length} session{entries.length !== 1 ? 's' : ''} logged.
        </p>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={exportJSON}
          >
            Export JSON
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={exportCSV}
          >
            Export CSV
          </Button>
        </div>
      </Card>

      {/* App info */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">RollIQ</p>
            <p className="text-xs text-[var(--text-muted)]">v0.1.0 · {IS_MOCK ? 'Demo mode' : 'Connected'}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${IS_MOCK ? 'bg-yellow-400' : 'bg-green-400'}`} />
            <span className="text-xs text-[var(--text-muted)]">{IS_MOCK ? 'Demo' : 'Live'}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
