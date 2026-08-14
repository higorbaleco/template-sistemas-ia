import { useMemo } from 'react'
import { MetricsService } from '../services/metrics-service'
import { useCRM } from '../contexts/crm-context'
import { useGlobalFilters } from './use-global-filters'

const metricsService = new MetricsService(new Date('2026-04-28'))

export function useMetrics() {
  const { filters } = useGlobalFilters()
  const { deals } = useCRM()

  return useMemo(() => {
    const snapshot = metricsService.getSnapshot(deals, filters)
    const target = metricsService.runTargetEngine(
      {
        revenueGoal: 100_000,
        daysLeft: 2,
        winRate: 0.2,
        proposalRate: 0.5,
        meetingRate: 0.5,
        approachRate: 0.3,
      },
      snapshot.averageTicket,
    )

    return { snapshot, target }
  }, [deals, filters])
}
