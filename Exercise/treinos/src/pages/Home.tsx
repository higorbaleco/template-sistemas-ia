import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkoutStore, type ProfileId } from '../lib/store'
import { ThemeToggle } from '../components/ThemeToggle'
import { CategoryCard } from '../components/CategoryCard'
import categories from '../data/categories.json'
import workouts from '../data/workouts.json'

export const Home: React.FC = () => {
  const navigate = useNavigate()
  const { profileId, setProfile } = useWorkoutStore()

  const handleSelectProfile = (id: ProfileId) => {
    setProfile(id)
  }

  const handleChooseCategory = (categoryId: string) => {
    navigate(`/categoria/${categoryId}`)
  }

  // Count workouts per category
  const workoutsByCategory = categories.reduce((acc, cat) => {
    acc[cat.id] = workouts.filter(w => w.categoria === cat.id).length
    return acc
  }, {} as Record<string, number>)

  // Profile selection screen
  if (!profileId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6 bg-white dark:bg-neutral-950">
        <div className="text-center space-y-4 w-full max-w-sm">
          <h1 className="font-display text-4xl font-bold text-gradient">
            Catálogo de Treinos
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            Escolha quem vai treinar
          </p>

          <div className="space-y-3 pt-8">
            {(['higor', 'brenda'] as const).map((profile) => (
              <button
                key={profile}
                onClick={() => handleSelectProfile(profile)}
                className={`
                  w-full py-4 px-6 rounded-xl font-semibold text-white
                  transition-all duration-200 transform
                  hover:scale-105 active:scale-95
                  ${profile === 'higor'
                    ? 'bg-gradient-to-r from-green-600 to-green-500'
                    : 'bg-gradient-to-r from-purple-600 to-purple-500'
                  }
                `}
              >
                {profile.charAt(0).toUpperCase() + profile.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Category grid screen
  return (
    <div className="flex flex-col h-screen bg-white dark:bg-neutral-950 pb-16">
      {/* Header */}
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-neutral-900 dark:text-neutral-50">
              Olá, {profileId.charAt(0).toUpperCase() + profileId.slice(1)}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
              O que vamos treinar hoje?
            </p>
          </div>
          <ThemeToggle />
        </div>

        <button
          onClick={() => {
            useWorkoutStore.setState({ profileId: null })
          }}
          className="btn-secondary text-sm"
        >
          Trocar perfil
        </button>
      </div>

      {/* Category grid */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            workoutCount={workoutsByCategory[category.id]}
            onClick={() => handleChooseCategory(category.id)}
          />
        ))}
      </div>
    </div>
  )
}
