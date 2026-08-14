import { useState } from 'react'
import { useCRM } from '../contexts/crm-context'

export function ProductsPage() {
  const { products, createProduct } = useCRM()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Produtos</h2>
      <form
        className="grid gap-2 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-4"
        onSubmit={(e) => {
          e.preventDefault()
          if (!name || !price) return
          createProduct({ name, sku: 'N/A', category: 'N/A', cost: 0, price: Number(price), revenueType: 'unica', status: 'ativo' })
          setName('')
          setPrice('')
        }}
      >
        <input className="rounded border p-2" placeholder="Produto" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="rounded border p-2" placeholder="Preço" value={price} onChange={(e) => setPrice(e.target.value)} />
        <button className="rounded bg-brand-500 px-3 py-2 text-white">Adicionar produto</button>
      </form>
      <div className="overflow-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm"><thead className="bg-slate-50"><tr><th className="p-3 text-left">Produto</th><th className="p-3 text-left">Tipo</th><th className="p-3 text-left">Preço</th><th className="p-3 text-left">Status</th></tr></thead>
          <tbody>{products.map((p) => <tr key={p.id} className="border-t"><td className="p-3">{p.name}</td><td className="p-3">{p.revenueType}</td><td className="p-3">R$ {p.price.toLocaleString('pt-BR')}</td><td className="p-3">{p.status}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  )
}
