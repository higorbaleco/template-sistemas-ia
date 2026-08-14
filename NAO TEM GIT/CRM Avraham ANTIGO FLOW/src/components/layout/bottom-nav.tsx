import { Activity, BarChart3, LayoutDashboard, Monitor, Settings, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/pipeline', label: 'Pipeline', icon: BarChart3 },
  { to: '/contatos', label: 'Contatos', icon: Users },
  { to: '/atividades', label: 'Atividades', icon: Activity },
  { to: '/', label: 'Dash', icon: LayoutDashboard },
  { to: '/tv', label: 'TV', icon: Monitor },
  { to: '/metas', label: 'Config', icon: Settings },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white md:hidden">
      <ul className="grid grid-cols-6">
        {links.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink to={to} className={({ isActive }) => `flex flex-col items-center gap-1 py-2 text-[11px] ${isActive ? 'text-brand-600' : 'text-slate-500'}`}>
              <Icon size={16} />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
