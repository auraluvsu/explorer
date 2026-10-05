import { WeightRail } from '@/components/WeightRail'
import { RankingTable } from '@/components/RankingTable'

export function DashboardView() {
  return (
    <div className="grid lg:grid-cols-[280px_1fr]">
      <WeightRail />
      <div className="min-w-0 p-6">
        <p className="mb-3 text-muted">Click any row for detail. Profit ceiling and exit multiples are estimates.</p>
        <RankingTable />
      </div>
    </div>
  )
}
