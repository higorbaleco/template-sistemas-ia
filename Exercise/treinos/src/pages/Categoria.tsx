import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import categories from '../data/categories.json'
import workoutsData from '../data/workouts.json'
import { WorkoutCard } from '../components/WorkoutCard'
import { Workout } from '../data/types'

export const Categoria: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>()
  const navigate = useNavigate()

  const category = categories.find((c) => c.id === categoryId)
  const treinos = (workoutsData as Workout[]).filter(w => w.categoria === categoryId) || []

  if (!category) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-neutral-950">
        <div className="text-center space-y-4">
          <p className="text-neutral-600 dark:text-neutral-400">Categoria não encontrada</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Voltar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-neutral-950 pb-16">
      {/* Header */}
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 space-y-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-colors"
        >
          <ChevronLeft size={20} />
          Voltar
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            {category.nome}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            {category.descricao}
          </p>
        </div>
      </div>

      {/* Content */}
      {treinos.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-center px-6">
          <div className="space-y-2">
            <p className="text-neutral-600 dark:text-neutral-400">
              Nenhum treino adicionado ainda nesta categoria.
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">
              Em breve mais opções!
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {treinos.map((treino) => (
            <WorkoutCard
              key={treino.id}
              workout={treino}
              onClick={() => navigate(`/treino/${treino.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
