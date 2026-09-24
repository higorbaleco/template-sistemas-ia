import React, { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import exercisesData from '../data/exercises.json'
import { Exercise } from '../data/types'
import { ExerciseCard } from '../components/ExerciseCard'

export const Exercicios: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = useMemo((): string[] => {
    const cats = new Set<string>()
    ;(exercisesData as any[]).forEach((ex: any) => {
      ex.categorias?.forEach((cat: string) => cats.add(cat))
    })
    return Array.from(cats).sort()
  }, [])

  const filteredExercises: Exercise[] = useMemo(() => {
    return (exercisesData as any[]).filter((ex) => {
      const matchesSearch =
        ex.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.nome_secundario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.descricao.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory =
        !selectedCategory || ex.categorias.includes(selectedCategory)

      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-neutral-950 pb-16">
      {/* Header */}
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 space-y-4">
        <h1 className="font-display text-2xl font-bold text-neutral-900 dark:text-neutral-50">
          Biblioteca de Exercícios
        </h1>

        {/* Search bar */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3 text-neutral-400 dark:text-neutral-600" />
          <input
            type="text"
            placeholder="Buscar exercício..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              w-full pl-10 pr-4 py-2 rounded-lg
              bg-neutral-100 dark:bg-neutral-800
              border border-neutral-300 dark:border-neutral-700
              text-neutral-900 dark:text-neutral-50
              placeholder-neutral-500 dark:placeholder-neutral-400
              focus:outline-none focus:ring-2 focus:ring-primary-500
              transition-all
            "
          />
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`
              px-4 py-2 rounded-full text-sm font-semibold
              transition-all
              ${!selectedCategory
                ? 'bg-gradient-primary text-white'
                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-300 dark:hover:bg-neutral-700'
              }
            `}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-4 py-2 rounded-full text-sm font-semibold
                transition-all whitespace-nowrap
                ${selectedCategory === cat
                  ? 'bg-gradient-primary text-white'
                  : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-300 dark:hover:bg-neutral-700'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredExercises.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="space-y-2">
              <p className="text-neutral-600 dark:text-neutral-400">
                Nenhum exercício encontrado
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-500">
                Tente ajustar sua busca ou filtros
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredExercises.map((ex) => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
