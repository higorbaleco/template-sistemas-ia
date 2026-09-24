import React from 'react'
import { Clock, Zap, Package } from 'lucide-react'
import { Workout } from '../data/types'
import { LevelBadge } from './Badges'

interface WorkoutCardProps {
  workout: Workout
  onClick?: () => void
  className?: string
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        card-elevated
        cursor-pointer hover:shadow-elevated transform hover:scale-105
        space-y-3
        ${className}
      `}
    >
      {/* Title and description */}
      <div>
        <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-neutral-50">
          {workout.nome}
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          {workout.descricao}
        </p>
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap gap-2">
        {/* Duration */}
        <div className="flex items-center gap-1 stat-pill">
          <Clock size={16} />
          <span>{workout.duracao_min}-{workout.duracao_max} min</span>
        </div>

        {/* Level */}
        <LevelBadge level={workout.nivel} />

        {/* Equipment count */}
        {workout.equipamentos.length > 0 && (
          <div className="flex items-center gap-1 stat-pill">
            <Package size={16} />
            <span>{workout.equipamentos.length}</span>
          </div>
        )}
      </div>

      {/* Exercise count */}
      <div className="text-xs font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1">
        <Zap size={14} />
        {workout.exercicios.length} exercício{workout.exercicios.length !== 1 ? 's' : ''}
      </div>
    </div>
  )
}
