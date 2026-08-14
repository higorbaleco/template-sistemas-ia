export type Locale = 'pt-BR' | 'en' | 'es'
export type DealStage = 'prospeccao' | 'qualificacao' | 'proposta' | 'negociacao' | 'ganho' | 'perdido'

export interface Deal {
  id: string
  title: string
  amount: number
  stage: DealStage
  companyId: string
  companyName: string
  contactId: string | null
  contactName: string | null
  ownerId: string
  expectedCloseDate: string
  createdAt: string
  updatedAt: string
  lostAt?: string
}

export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  companyName: string
  status: 'prospect' | 'client'
}

export interface Product {
  id: string
  name: string
  sku: string
  category: string
  cost: number
  price: number
  revenueType: 'unica' | 'recorrente'
  status: 'ativo' | 'inativo'
}

export interface Activity {
  id: string
  title: string
  dueAt: string
  priority: 'baixa' | 'media' | 'alta'
  status: 'open' | 'done' | 'overdue'
  dealId?: string
  contactId?: string
  type: 'task' | 'meeting' | 'call' | 'email' | 'whatsapp'
}

export interface Cadence {
  id: string
  name: string
  active: boolean
  steps: Array<{ day: number; type: Activity['type'] }>
}

export interface GlobalFilters {
  from: string
  to: string
  sellerId?: string
  channel?: string
  stage?: DealStage
}

export interface MetricsSnapshot {
  revenue: number
  wonCount: number
  lostCount: number
  totalCreated: number
  conversionClosed: number
  conversionGlobal: number
  averageTicket: number
  ltvByCompany: Array<{ companyId: string; total: number }>
  stageTotals: Record<DealStage, { count: number; amount: number }>
}

export interface TargetInput {
  revenueGoal: number
  daysLeft: number
  winRate: number
  proposalRate: number
  meetingRate: number
  approachRate: number
}

export interface TargetEngineOutput {
  requiredWonDeals: number
  requiredProposals: number
  requiredMeetings: number
  requiredApproaches: number
  approachesPerBusinessDay: number
  health: 'green' | 'yellow' | 'red'
}

export interface CRMState {
  deals: Deal[]
  contacts: Contact[]
  products: Product[]
  activities: Activity[]
  cadences: Cadence[]
}
