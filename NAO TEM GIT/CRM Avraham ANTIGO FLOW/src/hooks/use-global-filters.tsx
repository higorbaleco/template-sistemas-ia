import { createContext, useContext, useMemo, useState } from 'react'
import type { GlobalFilters } from '../domain/types'

const defaultFilters: GlobalFilters = {
  from: '2026-04-01',
  to: '2026-04-30',
}

const GlobalFiltersContext = createContext<{
  filters: GlobalFilters
  setFilters: React.Dispatch<React.SetStateAction<GlobalFilters>>
} | null>(null)

export function GlobalFiltersProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<GlobalFilters>(defaultFilters)
  const value = useMemo(() => ({ filters, setFilters }), [filters])
  return <GlobalFiltersContext.Provider value={value}>{children}</GlobalFiltersContext.Provider>
}

export function useGlobalFilters() {
  const context = useContext(GlobalFiltersContext)
  if (!context) throw new Error('useGlobalFilters must be used inside GlobalFiltersProvider')
  return context
}
