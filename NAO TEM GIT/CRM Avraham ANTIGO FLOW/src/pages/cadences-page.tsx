import { useCRM } from '../contexts/crm-context'

export function CadencesPage() {
  const { cadences } = useCRM()
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Cadências</h2>
      {cadences.map((c) => (
        <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between"><h3 className="text-xl font-semibold">{c.name}</h3><span className="rounded-full bg-brand-50 px-2 py-1 text-xs text-brand-600">{c.active ? 'Ativo' : 'Inativo'}</span></div>
          <p className="text-sm text-slate-600">Etapas: {c.steps.map((s) => `D${s.day}:${s.type}`).join(' · ')}</p>
        </div>
      ))}
    </div>
  )
}
