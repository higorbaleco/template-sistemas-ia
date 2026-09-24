import React from 'react'

interface BadgeProps {
  label: string
  className?: string
  icon?: React.ReactNode
}

export const DifficultyBadge: React.FC<{ difficulty: string; className?: string }> = ({
  difficulty,
  className = '',
}) => {
  const difficultyMap = {
    iniciante: { label: 'Iniciante', class: 'badge-iniciante' },
    intermediário: { label: 'Intermediário', class: 'badge-intermediario' },
    avançado: { label: 'Avançado', class: 'badge-avancado' },
  }

  const config = difficultyMap[difficulty as keyof typeof difficultyMap] || {
    label: difficulty,
    class: 'bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100',
  }

  return (
    <span className={`${config.class} ${className}`}>
      {config.label}
    </span>
  )
}

export const LevelBadge: React.FC<{ level: string; className?: string }> = ({
  level,
  className = '',
}) => {
  const levelMap = {
    iniciante: { label: '★ Iniciante', class: 'bg-success/20 text-success dark:bg-success/30' },
    intermediário: { label: '★★ Intermediário', class: 'bg-warning/20 text-warning dark:bg-warning/30' },
    avançado: { label: '★★★ Avançado', class: 'bg-danger/20 text-danger dark:bg-danger/30' },
  }

  const config = levelMap[level as keyof typeof levelMap] || {
    label: level,
    class: 'bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100',
  }

  return (
    <span className={`badge-difficulty ${config.class} ${className}`}>
      {config.label}
    </span>
  )
}

export const EquipmentBadge: React.FC<BadgeProps> = ({
  label,
  icon,
  className = '',
}) => {
  return (
    <span className={`badge-difficulty bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100 ${className}`}>
      {icon && <span className="mr-1">{icon}</span>}
      {label}
    </span>
  )
}

const BADGE_VARIANTS: Record<string, string> = {
  default: 'bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100',
  primary: 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100',
  secondary: 'bg-secondary-100 text-secondary-900 dark:bg-secondary-900 dark:text-secondary-100',
}

export const Badge: React.FC<{ label: string; variant?: string; className?: string }> = ({
  label,
  variant = 'default',
  className = '',
}) => {
  const variantClass = BADGE_VARIANTS[variant] || BADGE_VARIANTS.default

  return (
    <span className={`badge-difficulty ${variantClass} ${className}`}>
      {label}
    </span>
  )
}
