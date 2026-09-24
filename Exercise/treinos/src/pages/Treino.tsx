import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWorkoutStore } from '../lib/store'
import { CheckItem } from '../components/CheckItem'
import { ExerciseAccordion } from '../components/ExerciseAccordion'
import { ProgressBar } from '../components/ProgressBar'
import { ConfirmDialog } from '../components/ConfirmDialog'
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
      <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#1a1a1a', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <p style={{ color: '#999', marginBottom: '16px' }}>Treino não encontrado</p>
          <button onClick={() => navigate(-1)} style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Voltar</button>
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
      <div key={title} style={{ marginBottom: '16px' }}>
        <h3
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#4CAF50',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          {title}
        </h3>
        <div>
          {items.map((item, idx) => {
            const exercise = exerciseMap.get(item.exercise_id)
            const checkKey = `${treinoId}-${title}-${idx}`

            if (!exercise) {
              return (
                <div key={idx} style={{ color: '#666', padding: '8px' }}>
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
              <div key={idx} style={{ marginBottom: '8px' }}>
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#1a1a1a',
        paddingBottom: '60px'
      }}
    >
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #2a2a2a' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: '#4CAF50',
            fontSize: '18px',
            cursor: 'pointer',
            marginBottom: '8px'
          }}
        >
          ← Voltar
        </button>
        <h1 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '8px' }}>
          {treino.nome}
        </h1>
        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#999' }}>
          <span>⏱️ {treino.duracao_min}-{treino.duracao_max} min</span>
          <span>📊 {treino.nivel}</span>
        </div>
        <p style={{ fontSize: '13px', color: '#bbb', marginTop: '8px' }}>
          {treino.objetivo}
        </p>
      </div>

      {/* Progress Bar */}
      <ProgressBar done={done} total={allItems.length} percent={percent} />

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 20px'
        }}
      >
        {renderExerciseSection('Aquecimento', treino.aquecimento)}
        {renderExerciseSection('Treino Principal', treino.exercicios)}
        {renderExerciseSection('Finalização', treino.finalizacao || [])}

        {/* Clear button */}
        <div style={{ marginTop: '24px', marginBottom: '12px' }}>
          <button
            onClick={() => setShowConfirm(true)}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: '#404040',
              color: '#999',
              border: '1px solid #555',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#505050'
              e.currentTarget.style.color = '#ddd'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#404040'
              e.currentTarget.style.color = '#999'
            }}
          >
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
