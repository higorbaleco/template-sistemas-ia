import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Locale } from '../domain/types'

const dict = {
  'pt-BR': { dashboard: 'Dashboard', pipeline: 'Pipeline', contacts: 'Contatos', products: 'Produtos', activities: 'Atividades', goals: 'Metas', tv: 'Modo TV' },
  en: { dashboard: 'Dashboard', pipeline: 'Pipeline', contacts: 'Contacts', products: 'Products', activities: 'Activities', goals: 'Goals', tv: 'TV Mode' },
  es: { dashboard: 'Panel', pipeline: 'Pipeline', contacts: 'Contactos', products: 'Productos', activities: 'Actividades', goals: 'Metas', tv: 'Modo TV' },
}

const I18nContext = createContext<{ locale: Locale; setLocale: (v: Locale) => void; t: typeof dict['pt-BR'] } | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => (localStorage.getItem('flowconnect:locale') as Locale) || 'pt-BR')

  useEffect(() => {
    localStorage.setItem('flowconnect:locale', locale)
  }, [locale])

  const value = useMemo(() => ({ locale, setLocale, t: dict[locale] }), [locale])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used in I18nProvider')
  return context
}
