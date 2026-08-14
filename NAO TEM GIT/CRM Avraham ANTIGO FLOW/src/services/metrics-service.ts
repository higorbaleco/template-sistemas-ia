import { differenceInDays, parseISO } from 'date-fns'
import type { Deal, DealStage, GlobalFilters, MetricsSnapshot, TargetEngineOutput, TargetInput } from '../domain/types'

const stages: DealStage[] = ['prospeccao', 'qualificacao', 'proposta', 'negociacao', 'ganho', 'perdido']

function inRange(date: string, from: string, to: string) {
  const d = parseISO(date)
  return d >= parseISO(from) && d <= parseISO(to)
}

function isArchivedLostDeal(deal: Deal, now: Date) {
  if (deal.stage !== 'perdido' || !deal.lostAt) return false
  return differenceInDays(now, parseISO(deal.lostAt)) > 60
}

export class MetricsService {
  private readonly now: Date

  constructor(now: Date = new Date()) {
    this.now = now
  }

  getSnapshot(allDeals: Deal[], filters: GlobalFilters): MetricsSnapshot {
    const filtered = allDeals.filter((deal) => inRange(deal.createdAt, filters.from, filters.to))

    const dealsForMetrics = filtered.filter((d) => d.contactId)
    const wonDeals = dealsForMetrics.filter((d) => d.stage === 'ganho')
    const lostDeals = dealsForMetrics.filter((d) => d.stage === 'perdido')

    const revenue = wonDeals.reduce((sum, d) => sum + d.amount, 0)
    const wonCount = wonDeals.length
    const lostCount = lostDeals.length
    const totalCreated = dealsForMetrics.length

    const conversionClosed = wonCount + lostCount === 0 ? 0 : wonCount / (wonCount + lostCount)
    const conversionGlobal = totalCreated === 0 ? 0 : wonCount / totalCreated
    const averageTicket = wonCount === 0 ? 0 : revenue / wonCount

    const ltvMap = new Map<string, number>()
    for (const deal of wonDeals) {
      ltvMap.set(deal.companyId, (ltvMap.get(deal.companyId) ?? 0) + deal.amount)
    }

    const stageTotals = stages.reduce((acc, stage) => {
      const stageDeals = filtered.filter((d) => {
        if (stage === 'perdido') return d.stage === stage && !isArchivedLostDeal(d, this.now)
        return d.stage === stage
      })
      acc[stage] = {
        count: stageDeals.length,
        amount: stageDeals.reduce((sum, d) => sum + d.amount, 0),
      }
      return acc
    }, {} as MetricsSnapshot['stageTotals'])

    return {
      revenue,
      wonCount,
      lostCount,
      totalCreated,
      conversionClosed,
      conversionGlobal,
      averageTicket,
      ltvByCompany: Array.from(ltvMap.entries()).map(([companyId, total]) => ({ companyId, total })),
      stageTotals,
    }
  }

  runTargetEngine(input: TargetInput, avgTicket: number): TargetEngineOutput {
    const ticket = avgTicket > 0 ? avgTicket : 2500
    const requiredWonDeals = Math.ceil(input.revenueGoal / ticket)
    const requiredProposals = Math.ceil(requiredWonDeals / input.winRate)
    const requiredMeetings = Math.ceil(requiredProposals / input.proposalRate)
    const requiredApproaches = Math.ceil(requiredMeetings / input.meetingRate)
    const approachesPerBusinessDay = Math.ceil(requiredApproaches / Math.max(input.daysLeft, 1))

    let health: TargetEngineOutput['health'] = 'green'
    if (approachesPerBusinessDay > 20) health = 'red'
    else if (approachesPerBusinessDay > 10) health = 'yellow'

    return {
      requiredWonDeals,
      requiredProposals,
      requiredMeetings,
      requiredApproaches,
      approachesPerBusinessDay,
      health,
    }
  }
}
