import { useMemo } from 'react'
import { Background, Controls, Handle, MiniMap, Position, ReactFlow, type Edge, type Node, type NodeProps } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useExplorerStore, useGraphData, type GraphNode } from '@/store/useExplorerStore'
import { scoreTier } from '@/lib/scoring'

const COLORS = { high: '#34d399', mid: '#fbbf24', low: '#f87171' }
const X = { root: 0, tier: 280, category: 520, business: 740 }
const ROW = 52

type Data = GraphNode & { color?: string; dot?: number; [key: string]: unknown }

function TreeNode({ data }: NodeProps<Node<Data>>) {
  const open = useExplorerStore((s) => s.openDetail)
  if (data.kind === 'business') {
    const d = data.dot ?? 16
    return (
      <button onClick={() => open(data.id)} className="flex items-center gap-2 rounded-md border bg-panel py-1 pl-2 pr-3 text-left text-[13px] hover:bg-elevated" style={{ borderColor: data.color }}>
        <Handle type="target" position={Position.Left} className="!size-1.5 !border-0 !bg-line" />
        <span className="shrink-0 rounded-full" style={{ width: d, height: d, background: data.color }} />
        <span className="whitespace-nowrap">{data.label}</span>
        <span className="num text-[12px]" style={{ color: data.color }}>{data.score?.toFixed(1)}</span>
      </button>
    )
  }
  const cls = data.kind === 'root' ? 'border-sky bg-sky/10 text-[15px] font-semibold text-sky' : data.kind === 'tier' ? 'border-sky/50 bg-panel font-semibold' : 'border-line bg-base text-muted caption'
  return (
    <div className={`rounded-md border px-3 py-1.5 ${cls}`}>
      {data.kind !== 'root' && <Handle type="target" position={Position.Left} className="!size-1.5 !border-0 !bg-line" />}
      {data.label}
      <Handle type="source" position={Position.Right} className="!size-1.5 !border-0 !bg-line" />
    </div>
  )
}

const nodeTypes = { tree: TreeNode }

export function TreeView() {
  const { nodes: raw, edges: rawEdges } = useGraphData()

  const { nodes, edges } = useMemo(() => {
    const scores = raw.filter((n) => n.kind === 'business').map((n) => n.score!)
    const children = new Map<string, string[]>()
    rawEdges.forEach((e) => children.set(e.source, [...(children.get(e.source) ?? []), e.target]))
    const y = new Map<string, number>()
    let row = 0
    const place = (id: string): number => {
      const kids = children.get(id)
      if (!kids) { y.set(id, row++ * ROW); return y.get(id)! }
      const ys = kids.map(place)
      const mid = (ys[0] + ys[ys.length - 1]) / 2
      y.set(id, mid)
      return mid
    }
    place('root')
    const maxSize = Math.max(...raw.map((n) => n.size ?? 0))
    const nodes: Node<Data>[] = raw.map((n) => ({
      id: n.id,
      type: 'tree',
      position: { x: X[n.kind], y: y.get(n.id)! },
      data: n.kind === 'business'
        ? { ...n, color: COLORS[scoreTier(n.score!, scores)], dot: 12 + ((n.size ?? 0) / maxSize) * 20 }
        : n,
      draggable: false,
    }))
    const edges: Edge[] = rawEdges.map((e) => ({ id: `${e.source}-${e.target}`, ...e, style: { stroke: '#475569' } }))
    return { nodes, edges }
  }, [raw, rawEdges])

  return (
    <div className="p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted">Color = weighted score quartile · dot size = profit ceiling · click an idea for detail.</p>
        <ul className="flex gap-4 text-[12px] text-muted">
          {(['high', 'mid', 'low'] as const).map((t) => (
            <li key={t} className="flex items-center gap-1.5"><span className="size-2.5 rounded-full" style={{ background: COLORS[t] }} />{t === 'high' ? 'Top quartile' : t === 'mid' ? 'Middle' : 'Bottom quartile'}</li>
          ))}
        </ul>
      </div>
      <div className="h-[calc(100vh-170px)] min-h-[520px] overflow-hidden rounded-lg border border-line bg-panel/40">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.1 }}
          minZoom={0.3}
          nodesConnectable={false}
          colorMode="dark"
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#334155" gap={24} />
          <Controls showInteractive={false} />
          <MiniMap pannable zoomable maskColor="rgba(15,23,42,.7)" nodeColor={(n) => (n.data as unknown as Data).color ?? '#475569'} style={{ background: '#1e293b' }} />
        </ReactFlow>
      </div>
    </div>
  )
}
