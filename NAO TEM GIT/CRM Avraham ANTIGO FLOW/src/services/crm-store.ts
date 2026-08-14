import { initialState } from '../mocks/data'
import type { CRMState } from '../domain/types'

const STORAGE_KEY = 'flowconnect:crm-state:v1'

export function loadState(): CRMState {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return initialState
  try {
    return JSON.parse(raw) as CRMState
  } catch {
    return initialState
  }
}

export function saveState(state: CRMState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
