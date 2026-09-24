import React from 'react'

interface StatPillProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger'
  className?: string
}

export const StatPill: React.FC<StatPillProps> = ({
  label,
  value,
  icon,
  variant = 'default',
  className = '',
}) => {
  const variantClass = {
    default: 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100',
    success: 'bg-success/20 text-success dark:bg-success/30',
    warning: 'bg-warning/20 text-warning dark:bg-warning/30',
    danger: 'bg-danger/20 text-danger dark:bg-danger/30',
  }[variant]

  return (
    <div className={`stat-pill ${variantClass} ${className}`}>
      {icon && <span className="text-base">{icon}</span>}
      <div className="flex items-center gap-1">
        <span className="text-xs opacity-80">{label}:</span>
        <span className="font-bold">{value}</span>
      </div>
    </div>
  )
}
