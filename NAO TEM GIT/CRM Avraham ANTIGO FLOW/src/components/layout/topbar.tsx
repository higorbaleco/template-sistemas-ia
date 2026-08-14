import { Moon, Search, Sun } from 'lucide-react'
import { useI18n } from '../../contexts/i18n-context'
import type { Locale } from '../../domain/types'

export function Topbar() {
  const { locale, setLocale } = useI18n()

  return (
    <header className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
        <Search size={16} className="text-slate-400" />
        <input className="w-full border-none bg-transparent text-sm outline-none" placeholder="Buscar..." />
      </div>
      <select
        className="rounded-lg border border-slate-200 px-2 py-2 text-sm"
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
      >
        <option value="pt-BR">PT</option>
        <option value="en">EN</option>
        <option value="es">ES</option>
      </select>
      <button className="rounded-lg border border-slate-200 p-2"><Sun size={16} /></button>
      <button className="rounded-lg border border-slate-200 p-2"><Moon size={16} /></button>
    </header>
  )
}
