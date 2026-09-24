import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Clipboard, Dumbbell } from 'lucide-react'

interface NavItem {
  path: string
  label: string
  icon: React.ReactNode
  active: boolean
}

export const BottomNav: React.FC = () => {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const items: NavItem[] = [
    {
      path: '/',
      label: 'Início',
      icon: <Home size={24} />,
      active: isActive('/')
    },
    {
      path: '/treinos',
      label: 'Treinos',
      icon: <Clipboard size={24} />,
      active: isActive('/treinos')
    },
    {
      path: '/exercicios',
      label: 'Exercícios',
      icon: <Dumbbell size={24} />,
      active: isActive('/exercicios')
    }
  ]

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 h-16
        bg-white dark:bg-neutral-900
        border-t border-neutral-200 dark:border-neutral-800
        flex justify-around items-center
        z-50 gap-2
      "
    >
      {items.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`
            flex-1 h-full
            flex flex-col items-center justify-center gap-1
            text-xs font-semibold
            transition-all duration-200
            no-underline cursor-pointer
            ${item.active
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }
          `}
        >
          <div className={`${item.active ? 'text-primary-600 dark:text-primary-400' : ''}`}>
            {item.icon}
          </div>
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
