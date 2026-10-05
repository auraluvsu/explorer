import { FilterBar } from '@/components/FilterBar'
import { SidePanel } from '@/components/SidePanel'
import { useExplorerStore } from '@/store/useExplorerStore'
import { DashboardView } from '@/views/DashboardView'
import { ScatterView } from '@/views/ScatterView'
import { TreeView } from '@/views/TreeView'
import { MapView } from '@/views/MapView'
import { CompareView } from '@/views/CompareView'

const views = { dashboard: DashboardView, scatter: ScatterView, tree: TreeView, map: MapView, compare: CompareView }

export default function App() {
  const view = useExplorerStore((s) => s.activeView)
  const View = views[view]
  return (
    <div className="min-h-screen bg-base">
      <FilterBar />
      <main><View /></main>
      <SidePanel />
    </div>
  )
}
