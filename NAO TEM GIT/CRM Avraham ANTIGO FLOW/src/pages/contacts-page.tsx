import { useState } from 'react'
import { useCRM } from '../contexts/crm-context'

export function ContactsPage() {
  const { contacts, createContact } = useCRM()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Contatos</h2>
      <form
        className="grid gap-2 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-4"
        onSubmit={(e) => {
          e.preventDefault()
          if (!name || !email) return
          createContact({ name, email, phone: 'N/A', companyName: 'N/A', status: 'prospect' })
          setName('')
          setEmail('')
        }}
      >
        <input className="rounded border p-2" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="rounded border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="rounded bg-brand-500 px-3 py-2 text-white">Adicionar contato</button>
      </form>
      <div className="overflow-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm"><thead className="bg-slate-50"><tr><th className="p-3 text-left">Nome</th><th className="p-3 text-left">Email</th><th className="p-3 text-left">Empresa</th></tr></thead>
          <tbody>{contacts.map((c) => <tr key={c.id} className="border-t"><td className="p-3">{c.name}</td><td className="p-3">{c.email}</td><td className="p-3">{c.companyName}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  )
}
