import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export const BottomNav: React.FC = () => {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const navItem = (path: string, label: string, icon: string) => ({
    path,
    label,
    icon,
    active: isActive(path)
  })

  const items = [
    navItem('/', 'Início', '🏠'),
    navItem('/treinos', 'Treinos', '📋'),
    navItem('/exercicios', 'Exercícios', '💪')
  ]

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: '#1a1a1a',
        borderTop: '1px solid #2a2a2a',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 100
      }}
    >
      {items.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            flex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            color: item.active ? '#4CAF50' : '#666',
            transition: 'color 0.2s',
            fontSize: '12px',
            gap: '4px'
          }}
        >
          <span style={{ fontSize: '20px' }}>{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
