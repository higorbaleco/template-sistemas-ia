import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Exercise } from '../data/types'

interface ExerciseAccordionProps {
  exercise: Exercise
  label: string
  description?: string
  onExpand?: () => void
}

export const ExerciseAccordion: React.FC<ExerciseAccordionProps> = ({
  exercise,
  label,
  description,
  onExpand
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen && onExpand) {
      onExpand()
    }
  }

  return (
    <div className="mb-3">
      {/* Accordion header */}
      <div
        onClick={handleToggle}
        className="
          p-3 rounded-lg
          bg-neutral-100 dark:bg-neutral-800
          border border-neutral-300 dark:border-neutral-700
          cursor-pointer flex justify-between items-center
          transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700
        "
      >
        <div>
          <div className="font-semibold text-neutral-900 dark:text-neutral-50">
            {label}
          </div>
          {description && (
            <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
              {description}
            </div>
          )}
        </div>
        <ChevronDown
          size={20}
          className={`
            flex-shrink-0 text-neutral-600 dark:text-neutral-400
            transition-transform duration-200
            ${isOpen ? 'rotate-180' : 'rotate-0'}
          `}
        />
      </div>

      {/* Accordion content */}
      {isOpen && (
        <div
          className="
            p-4 rounded-b-lg
            bg-neutral-50 dark:bg-neutral-900
            border-l border-r border-b
            border-neutral-300 dark:border-neutral-700
            -mt-1 space-y-4
          "
        >
          {/* How to do it */}
          {exercise.como_fazer && exercise.como_fazer.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-success dark:text-success mb-2">
                Como fazer
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
                {exercise.como_fazer.map((step, i) => (
                  <li key={i} className="text-sm">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Common mistakes */}
          {exercise.erros_comuns && exercise.erros_comuns.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-warning dark:text-warning mb-2">
                Erros comuns
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
                {exercise.erros_comuns.map((error, i) => (
                  <li key={i} className="text-sm">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Easier version */}
          {exercise.versao_facil && (
            <div className="p-3 rounded-lg bg-success/10 border-l-4 border-success">
              <p className="text-sm text-success font-semibold">
                <strong>Mais fácil:</strong> {exercise.versao_facil}
              </p>
            </div>
          )}

          {/* Harder version */}
          {exercise.versao_dificil && (
            <div className="p-3 rounded-lg bg-danger/10 border-l-4 border-danger">
              <p className="text-sm text-danger font-semibold">
                <strong>Mais difícil:</strong> {exercise.versao_dificil}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
