import React from 'react'

interface GradientCardProps {
  title: string
  subtitle?: string
  value?: string | number
  unit?: string
  icon?: React.ReactNode
  gradient?: 'primary' | 'secondary' | 'custom'
  className?: string
  onClick?: () => void
}

export const GradientCard: React.FC<GradientCardProps> = ({
  title,
  subtitle,
  value,
  unit,
  icon,
  gradient = 'primary',
  className = '',
  onClick,
}) => {
  const gradientClass = {
    primary: 'bg-gradient-primary',
    secondary: 'bg-gradient-card',
    custom: '',
  }[gradient]

  return (
    <div
      onClick={onClick}
      className={`
        card-gradient
        min-h-32 flex flex-col justify-between
        ${gradient === 'custom' ? '' : gradientClass}
        ${onClick ? 'cursor-pointer hover:scale-105' : ''}
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold opacity-90">{title}</p>
          {subtitle && <p className="text-xs opacity-75 mt-1">{subtitle}</p>}
        </div>
        {icon && <div className="text-2xl">{icon}</div>}
      </div>
      {value !== undefined && (
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{value}</span>
          {unit && <span className="text-sm opacity-90">{unit}</span>}
        </div>
      )}
    </div>
  )
}
