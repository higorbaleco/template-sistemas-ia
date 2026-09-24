import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ProfileId = 'higor' | 'brenda'

interface WorkoutState {
  // Perfil atual
  profileId: ProfileId | null
  setProfile: (id: ProfileId) => void

  // Checks do treino (session)
  checks: Record<string, boolean>
  toggleCheck: (key: string) => void
  setCheck: (key: string, value: boolean) => void
  clearChecks: () => void

  // Progresso do treino
  getProgress: (totalItems: number) => { done: number; percent: number }
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      profileId: null,
      setProfile: (id: ProfileId) => set({ profileId: id }),

      checks: {},
      toggleCheck: (key: string) => {
        set((state) => ({
          checks: {
            ...state.checks,
            [key]: !state.checks[key]
          }
        }))
      },
      setCheck: (key: string, value: boolean) => {
        set((state) => ({
          checks: {
            ...state.checks,
            [key]: value
          }
        }))
      },
      clearChecks: () => set({ checks: {} }),

      getProgress: (totalItems: number) => {
        const state = get()
        const done = Object.values(state.checks).filter(Boolean).length
        const percent = totalItems > 0 ? Math.round((done / totalItems) * 100) : 0
        return { done, percent }
      }
    }),
    {
      name: 'workout-storage',
      version: 1
    }
  )
)
