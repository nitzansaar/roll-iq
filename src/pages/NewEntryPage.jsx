import Card from '../components/ui/Card'
import EntryForm from '../components/journal/EntryForm'

export default function NewEntryPage() {
  return (
    <div className="p-5 md:p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-[var(--text-primary)]">New Session</h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">Log today's training</p>
      </div>
      <Card>
        <EntryForm />
      </Card>
    </div>
  )
}
