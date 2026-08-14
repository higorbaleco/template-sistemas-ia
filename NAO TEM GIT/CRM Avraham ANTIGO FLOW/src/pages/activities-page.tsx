import { useState } from 'react'
import { useCRM } from '../contexts/crm-context'

export function ActivitiesPage() {
  const { activities, deals, createActivity } = useCRM()
  const [title, setTitle] = useState('')
  const [dealId, setDealId] = useState('')

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Atividades</h2>
      <form
        className="grid gap-2 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-4"
        onSubmit={(e) => {
          e.preventDefault()
          if (!title) return
          createActivity({ title, dealId: dealId || undefined, dueAt: new Date().toISOString(), status: 'open', priority: 'media', type: 'task' })
          setTitle('')
          setDealId('')
        }}
      >
        <input className="rounded border p-2" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
        <select className="rounded border p-2" value={dealId} onChange={(e) => setDealId(e.target.value)}>
          <option value="">Sem negócio</option>
          {deals.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}
        </select>
        <button className="rounded bg-brand-500 px-3 py-2 text-white">Adicionar atividade</button>
      </form>
      <div className="space-y-2">
        {activities.map((a) => (
          <article key={a.id} className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="font-semibold">{a.title}</p>
            <p className="text-sm text-slate-600">{a.type} · {a.priority} · {a.status} · {a.dealId || 'Sem deal'}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
