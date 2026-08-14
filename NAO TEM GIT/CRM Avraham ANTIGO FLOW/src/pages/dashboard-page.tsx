import { useCRM } from '../contexts/crm-context'
import { useMetrics } from '../hooks/use-metrics'

export function DashboardPage() {
  const { snapshot, target } = useMetrics()
  const { activities } = useCRM()

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-4">
        <Card title="Receita" value={`R$ ${snapshot.revenue.toLocaleString('pt-BR')}`} />
        <Card title="Ticket Médio" value={`R$ ${snapshot.averageTicket.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`} />
        <Card title="Conversão Fechada" value={`${(snapshot.conversionClosed * 100).toFixed(1)}%`} />
        <Card title="Conversão Global" value={`${(snapshot.conversionGlobal * 100).toFixed(1)}%`} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-xl font-semibold">Batedor de Metas</h3>
          <p>Vendas necessárias: <strong>{target.requiredWonDeals}</strong></p>
          <p>Propostas necessárias: <strong>{target.requiredProposals}</strong></p>
          <p>Abordagens por dia útil: <strong>{target.approachesPerBusinessDay}</strong></p>
          <p className="mt-2">Saúde: <strong className={target.health === 'green' ? 'text-emerald-600' : target.health === 'yellow' ? 'text-amber-600' : 'text-red-600'}>{target.health.toUpperCase()}</strong></p>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-xl font-semibold">Próximas Atividades</h3>
          <ul className="space-y-2">
            {activities.slice(0, 5).map((a) => (
              <li key={a.id} className="rounded-lg border border-slate-100 p-2 text-sm">
                <strong>{a.title}</strong>
                <p className="text-slate-500">{a.type} · {a.priority} · {a.status}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  )
}
