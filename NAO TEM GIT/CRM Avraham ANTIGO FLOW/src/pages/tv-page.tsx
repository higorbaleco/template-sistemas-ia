import { useEffect, useState } from 'react'
import { useMetrics } from '../hooks/use-metrics'

export function TvPage() {
  const { snapshot, target } = useMetrics()
  const [seconds, setSeconds] = useState(15)

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s <= 1 ? 15 : s - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-[80vh] rounded-2xl bg-slate-950 p-8 text-white">
      <h2 className="text-4xl font-bold">FlowConnect TV</h2>
      <p className="mt-2 text-slate-300">Atualiza em 15s · próximo refresh: {seconds}s</p>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <TvCard label="Receita" value={`R$ ${snapshot.revenue.toLocaleString('pt-BR')}`} />
        <TvCard label="Vendas" value={String(snapshot.wonCount)} />
        <TvCard label="Conversão" value={`${(snapshot.conversionClosed * 100).toFixed(1)}%`} />
        <TvCard label="Meta diária" value={String(target.approachesPerBusinessDay)} />
      </div>
    </div>
  )
}

function TvCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-900 p-4">
      <p className="text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-emerald-400">{value}</p>
    </div>
  )
}
