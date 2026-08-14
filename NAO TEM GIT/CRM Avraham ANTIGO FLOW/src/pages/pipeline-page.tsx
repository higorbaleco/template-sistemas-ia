import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { useCRM } from '../contexts/crm-context'
import type { DealStage } from '../domain/types'
import { useMetrics } from '../hooks/use-metrics'

const stageOrder: DealStage[] = ['prospeccao', 'qualificacao', 'proposta', 'negociacao', 'ganho', 'perdido']

export function PipelinePage() {
  const { deals, moveDeal } = useCRM()
  const { snapshot } = useMetrics()
  const [view, setView] = useState<'kanban' | 'list' | 'table' | 'calendar'>('kanban')
  const [showArchived, setShowArchived] = useState(false)
  const [error, setError] = useState('')

  const visibleDeals = useMemo(() => {
    if (showArchived) return deals
    return deals.filter((d) => !(d.stage === 'perdido' && d.lostAt && (new Date().getTime() - new Date(d.lostAt).getTime()) / (1000 * 60 * 60 * 24) > 60))
  }, [deals, showArchived])

  const onDropDeal = (dealId: string, stage: DealStage) => {
    const result = moveDeal(dealId, stage)
    if (!result.ok) setError(result.reason || 'Movimento inválido')
    else setError('')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-3xl font-bold">Pipeline</h2>
        <div className="flex items-center gap-2">
          {(['kanban', 'list', 'table', 'calendar'] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className={`rounded-lg px-3 py-2 text-sm ${view === v ? 'bg-brand-500 text-white' : 'bg-white border border-slate-200'}`}>{v}</button>
          ))}
          <button onClick={() => setShowArchived((v) => !v)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            {showArchived ? 'Ocultar Arquivados' : 'Arquivados'}
          </button>
        </div>
      </div>
      {error && <p className="rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-600">{error}</p>}

      {view === 'kanban' && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {stageOrder.map((stage) => (
            <section
              key={stage}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDropDeal(e.dataTransfer.getData('deal-id'), stage)}
              className="rounded-xl border border-slate-200 bg-white p-3"
            >
              <header className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold capitalize">{stage}</h3>
                <span className="text-xs text-slate-500">{snapshot.stageTotals[stage].count}</span>
              </header>
              <p className="mb-3 text-xs text-slate-500">R$ {snapshot.stageTotals[stage].amount.toLocaleString('pt-BR')}</p>
              <div className="space-y-2">
                {visibleDeals.filter((d) => d.stage === stage).map((deal) => (
                  <article
                    key={deal.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('deal-id', deal.id)}
                    className="rounded-lg border border-slate-200 p-2 text-sm"
                  >
                    <p className="font-medium">{deal.title}</p>
                    <p className="text-slate-500">R$ {deal.amount.toLocaleString('pt-BR')}</p>
                    <p className="text-xs text-slate-500">{deal.contactName || 'Sem contato'}</p>
                    {!deal.contactId && <p className="text-xs text-red-500">Sem contato (fora KPI)</p>}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {view === 'list' && (
        <div className="space-y-2">
          {visibleDeals.map((d) => (
            <div key={d.id} className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="font-semibold">{d.title}</p>
              <p className="text-sm text-slate-600">{d.companyName} · {d.stage} · R$ {d.amount.toLocaleString('pt-BR')}</p>
            </div>
          ))}
        </div>
      )}

      {view === 'table' && (
        <div className="overflow-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="p-3">Negócio</th><th className="p-3">Etapa</th><th className="p-3">Valor</th><th className="p-3">Contato</th><th className="p-3">Prazo</th>
              </tr>
            </thead>
            <tbody>
              {visibleDeals.map((d) => (
                <tr key={d.id} className="border-t border-slate-100">
                  <td className="p-3">{d.title}</td><td className="p-3 capitalize">{d.stage}</td><td className="p-3">R$ {d.amount.toLocaleString('pt-BR')}</td><td className="p-3">{d.contactName || '-'}</td><td className="p-3">{format(new Date(d.expectedCloseDate), 'dd/MM/yyyy')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'calendar' && (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {visibleDeals
            .slice()
            .sort((a, b) => new Date(a.expectedCloseDate).getTime() - new Date(b.expectedCloseDate).getTime())
            .map((d) => (
              <div key={d.id} className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-xs text-slate-500">{format(new Date(d.expectedCloseDate), 'dd/MM/yyyy')}</p>
                <p className="font-semibold">{d.title}</p>
                <p className="text-sm text-slate-600">{d.stage}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
