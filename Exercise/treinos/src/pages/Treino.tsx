import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Trash2 } from 'lucide-react'
import { useWorkoutStore } from '../lib/store'
import { CheckItem } from '../components/CheckItem'
import { ExerciseAccordion } from '../components/ExerciseAccordion'
import { ProgressBar } from '../components/ProgressBar'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { LevelBadge } from '../components/Badges'
import workoutsData from '../data/workouts.json'
import exercisesData from '../data/exercises.json'
import { Exercise, Workout, WorkoutExercise } from '../data/types'

export const Treino: React.FC = () => {
  const { treinoId } = useParams<{ treinoId: string }>()
  const navigate = useNavigate()
  const { getProgress, clearChecks } = useWorkoutStore()
  const [showConfirm, setShowConfirm] = useState(false)

  // Load workout dynamically from workouts.json
  const treino = (workoutsData as Workout[]).find(w => w.id === treinoId)

  if (!treino) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-neutral-950">
        <div className="text-center space-y-4">
          <p className="text-neutral-600 dark:text-neutral-400">Treino não encontrado</p>
          <button onClick={() => navigate(-1)} className="btn-primary">
            Voltar
          </button>
        </div>
      </div>
    )
  }
  const exerciseMap = new Map<string, Exercise>(
    (exercisesData as any[]).map((ex) => [ex.id, ex])
  )

  const allItems = [
    ...treino.aquecimento,
    ...treino.exercicios,
    ...(treino.finalizacao || [])
  ]

  const { done, percent } = useMemo(
    () => getProgress(allItems.length),
    [getProgress, allItems.length]
  )

  const renderExerciseSection = (
    title: string,
    items: WorkoutExercise[]
  ) => {
    if (items.length === 0) return null

    return (
      <div key={title} className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-3">
          {title}
        </h3>
        <div className="space-y-2">
          {items.map((item, idx) => {
            const exercise = exerciseMap.get(item.exercise_id)
            const checkKey = `${treinoId}-${title}-${idx}`

            if (!exercise) {
              return (
                <div key={idx} className="text-neutral-500 dark:text-neutral-400 p-3 text-sm">
                  Exercício não encontrado: {item.exercise_id}
                </div>
              )
            }

            const description = [
              item.repeticoes && `${item.repeticoes} repetições`,
              item.series && `${item.series} série${item.series > 1 ? 's' : ''}`,
              item.tempo && `${item.tempo}`,
              item.descanso && `Descanso: ${item.descanso}`
            ]
              .filter(Boolean)
              .join(' · ')

            return (
              <div key={idx}>
                <CheckItem
                  id={checkKey}
                  label={exercise.nome}
                  description={description}
                />
                <ExerciseAccordion
                  exercise={exercise}
                  label=""
                  description=""
                />
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const handleClearConfirm = () => {
    clearChecks()
    setShowConfirm(false)
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-neutral-950 pb-16">
      {/* Header */}
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-colors"
        >
          <ChevronLeft size={20} />
          Voltar
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            {treino.nome}
          </h1>
          <div className="flex flex-wrap gap-3 mt-2">
            <div className="stat-pill">
              <span>⏱️ {treino.duracao_min}-{treino.duracao_max} min</span>
            </div>
            <LevelBadge level={treino.nivel} />
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-3">
            {treino.objetivo}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar done={done} total={allItems.length} percent={percent} />

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {renderExerciseSection('Aquecimento', treino.aquecimento)}
        {renderExerciseSection('Treino Principal', treino.exercicios)}
        {renderExerciseSection('Finalização', treino.finalizacao || [])}

        {/* Clear button */}
        <div className="mt-8">
          <button
            onClick={() => setShowConfirm(true)}
            className="btn-ghost w-full flex items-center justify-center gap-2 border border-danger/30 text-danger hover:bg-danger/10"
          >
            <Trash2 size={18} />
            Limpar marcações
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <ConfirmDialog
          title="Limpar todas as marcações?"
          message="Esta ação não pode ser desfeita."
          cancelText="Cancelar"
          confirmText="Limpar"
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleClearConfirm}
          isDangerous
        />
      )}
    </div>
  )
}
