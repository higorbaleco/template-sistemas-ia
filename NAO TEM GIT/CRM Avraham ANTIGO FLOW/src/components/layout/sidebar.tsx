import { Activity, BarChart3, Goal, LayoutDashboard, Monitor, Package, Users, Zap } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useI18n } from '../../contexts/i18n-context'

export function Sidebar() {
  const { t } = useI18n()
  const links = [
    { to: '/', label: t.dashboard, icon: LayoutDashboard },
    { to: '/pipeline', label: t.pipeline, icon: BarChart3 },
    { to: '/contatos', label: t.contacts, icon: Users },
    { to: '/produtos', label: t.products, icon: Package },
    { to: '/atividades', label: t.activities, icon: Activity },
    { to: '/cadencias', label: 'Cadências', icon: Zap },
    { to: '/metas', label: t.goals, icon: Goal },
    { to: '/tv', label: t.tv, icon: Monitor },
  ]

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-4 md:block">
      <h1 className="mb-6 text-2xl font-bold">FlowConnect</h1>
      <nav className="space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-100'}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
