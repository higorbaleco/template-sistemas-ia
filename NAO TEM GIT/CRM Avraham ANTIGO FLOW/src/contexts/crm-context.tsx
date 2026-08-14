import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loadState, saveState } from '../services/crm-store'
import type { Activity, CRMState, Contact, Deal, DealStage, Product } from '../domain/types'

interface CRMContextValue extends CRMState {
  moveDeal: (dealId: string, stage: DealStage) => { ok: boolean; reason?: string }
  createDeal: (payload: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => void
  createContact: (payload: Omit<Contact, 'id'>) => void
  createProduct: (payload: Omit<Product, 'id'>) => void
  createActivity: (payload: Omit<Activity, 'id'>) => void
}

const CRMContext = createContext<CRMContextValue | null>(null)

function hasNextActivity(activities: Activity[], dealId: string) {
  return activities.some((a) => a.dealId === dealId && a.status === 'open')
}

export function CRMProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CRMState>(() => loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  const value = useMemo<CRMContextValue>(() => ({
    ...state,
    moveDeal: (dealId, stage) => {
      const deal = state.deals.find((d) => d.id === dealId)
      if (!deal) return { ok: false, reason: 'Negócio não encontrado.' }

      if (stage === 'ganho') {
        if (!deal.contactId) return { ok: false, reason: 'Não pode ganhar sem contato vinculado.' }
        if (!hasNextActivity(state.activities, dealId)) return { ok: false, reason: 'Negócio aberto precisa próxima atividade.' }
      }

      setState((prev) => ({
        ...prev,
        deals: prev.deals.map((d) =>
          d.id === dealId
            ? {
                ...d,
                stage,
                updatedAt: new Date().toISOString().slice(0, 10),
                lostAt: stage === 'perdido' ? new Date().toISOString().slice(0, 10) : d.lostAt,
              }
            : d,
        ),
      }))
      return { ok: true }
    },
    createDeal: (payload) => {
      setState((prev) => ({
        ...prev,
        deals: [{ ...payload, id: crypto.randomUUID(), createdAt: new Date().toISOString().slice(0, 10), updatedAt: new Date().toISOString().slice(0, 10) }, ...prev.deals],
      }))
    },
    createContact: (payload) => setState((prev) => ({ ...prev, contacts: [{ ...payload, id: crypto.randomUUID() }, ...prev.contacts] })),
    createProduct: (payload) => setState((prev) => ({ ...prev, products: [{ ...payload, id: crypto.randomUUID() }, ...prev.products] })),
    createActivity: (payload) => setState((prev) => ({ ...prev, activities: [{ ...payload, id: crypto.randomUUID() }, ...prev.activities] })),
  }), [state])

  return <CRMContext.Provider value={value}>{children}</CRMContext.Provider>
}

export function useCRM() {
  const context = useContext(CRMContext)
  if (!context) throw new Error('useCRM must be used inside CRMProvider')
  return context
}
