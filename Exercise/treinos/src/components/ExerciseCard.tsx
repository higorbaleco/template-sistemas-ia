import React from 'react'
import { Zap } from 'lucide-react'
import { Exercise } from '../data/types'
import { DifficultyBadge } from './Badges'

interface ExerciseCardProps {
  exercise: Exercise
  onClick?: () => void
  className?: string
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
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
      {/* Title */}
      <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-neutral-50">
        {exercise.nome}
      </h3>

      {/* Difficulty badge */}
      <div className="flex items-center gap-2">
        <DifficultyBadge difficulty={exercise.dificuldade} />
      </div>

      {/* Muscles */}
      {exercise.musculos.length > 0 && (
        <div className="text-sm">
          <p className="font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Músculos:
          </p>
          <p className="text-neutral-600 dark:text-neutral-400">
            {exercise.musculos.join(', ')}
          </p>
        </div>
      )}

      {/* Equipment */}
      {exercise.equipamentos.length > 0 && (
        <div className="text-sm">
          <p className="font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Equipamento:
          </p>
          <div className="flex flex-wrap gap-1">
            {exercise.equipamentos.map((eq) => (
              <span
                key={eq}
                className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100 px-2 py-1 rounded"
              >
                {eq}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="flex items-center gap-1 text-primary-600 dark:text-primary-400 font-semibold text-sm pt-2">
        <Zap size={14} />
        Ver detalhes
      </div>
    </div>
  )
}
