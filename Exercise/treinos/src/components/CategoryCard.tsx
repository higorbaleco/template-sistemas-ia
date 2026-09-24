import React from 'react'
import * as LucideIcons from 'lucide-react'
import { Category } from '../data/types'

interface CategoryCardProps {
  category: Category
  workoutCount?: number
  onClick?: () => void
  className?: string
}

// Map icon names to Lucide components
const iconMap: Record<string, React.ComponentType<any>> = {
  'Dumbbell': LucideIcons.Dumbbell,
  'Zap': LucideIcons.Zap,
  'Package': LucideIcons.Package,
  'Shield': LucideIcons.Shield,
  'Users': LucideIcons.Users,
  'Wind': LucideIcons.Wind,
  'Activity': LucideIcons.Activity,
  'Waves': LucideIcons.Waves,
  'Clock': LucideIcons.Clock,
  'Flame': LucideIcons.Flame,
  'Heart': LucideIcons.Heart,
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  workoutCount = 0,
  onClick,
  className = '',
}) => {
  const IconComponent = category.icon ? iconMap[category.icon] : LucideIcons.Dumbbell

  return (
    <button
      onClick={onClick}
      className={`
        card-elevated
        flex items-start gap-4
        cursor-pointer hover:shadow-elevated
        transform hover:scale-105
        bg-white dark:bg-neutral-900 text-left
        border-none p-4
        transition-all duration-200
        ${className}
      `}
    >
      {/* Icon */}
      <div className="flex-shrink-0 p-3 rounded-lg bg-gradient-primary text-white">
        {IconComponent && <IconComponent size={28} strokeWidth={1.5} />}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-neutral-50">
          {category.nome}
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          {category.descricao}
        </p>
        {workoutCount > 0 && (
          <div className="text-xs font-semibold text-primary-600 dark:text-primary-400 mt-2">
            {workoutCount} treino{workoutCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </button>
  )
}
