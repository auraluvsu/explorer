# Plan: Tree view, CSV export, Map view

## Context
Tree and Map are placeholder stubs in the Business Ideas Explorer. CSV export does not exist yet. The user asked for all three. Everything stays client-side and reads from `src/data/businesses.ts` and the zustand store, so weights still update every view.

## 1. Tree view (real)
- Install `@xyflow/react`.
- Rewrite `src/views/TreeView.tsx` using `useGraphData()` from `src/store/useExplorerStore.ts`.
- Extend `useGraphData()` to add category sub-branches: root, then tier, then category, then business. Add matching edges.
- Lay out left-to-right with a simple hand-computed column layout (no dagre dependency).
- Custom node component: color by final score (reuse `scoreTier` from `src/lib/scoring.ts`, with the same green/amber/red tokens as `ScoreBadge`). Size by `profitCeiling.high`.
- Click a business node to call `openDetail(id)`, which opens the existing `SidePanel`.
- Pan/zoom, `MiniMap` and `Controls` come from React Flow. Dark-theme the styles in `src/index.css`.
- Remove the "Coming soon" overlay.

## 2. CSV export
- Add `src/lib/exportCsv.ts` with `toCsv(rows: Scored[], weights)` and `downloadCsv()`. Escape quotes, commas and newlines. Columns: rank, name, category, tier, 7 scores, final score, profit low/high, exit low/high/basis, est. sale low/high, biggest con, feasibility reason.
- Add an "Export CSV" button (lucide `Download`) in `src/components/FilterBar.tsx`. It exports the current sorted list from `useSortedBusinesses()`, so it respects the active weights and sort.

## 3. Map view (real, Leaflet)
- Install `leaflet` and `react-leaflet` (no API key needed; Mapbox would require a token). Use CARTO dark tiles to match the theme.
- The data has no geography, so add an optional `markets` field to `Business` in `src/types/business.ts`: `{ label: string; lat: number; lng: number }[]`, or `remoteFirst: true`. Populate in `src/data/businesses.ts` with sensible target markets per idea (for example Vertical SaaS: US, UK, DACH; Niche Job Board: US, UK).
- Rewrite `useMapPins()` to derive pins from businesses: `{ id, businessId, lat, lng, label, category, score }`, scored with current weights.
- `src/views/MapView.tsx`: `MapContainer` with `CircleMarker` per pin, color by score and radius by profit ceiling. Popup shows name and score with a button to open `SidePanel`.
- Category chips (already in the UI) now filter pins for real. Remote-first ideas appear in a side list, since they have no pin.
- Import `leaflet/dist/leaflet.css` and set a fixed map height.

## Open point
Market locations are my judgment calls and are not in the spec. I will flag this in the summary so the user can edit them in `businesses.ts`.

## Critical files
`src/store/useExplorerStore.ts`, `src/types/business.ts`, `src/data/businesses.ts`, `src/views/TreeView.tsx`, `src/views/MapView.tsx`, `src/components/FilterBar.tsx`, new `src/lib/exportCsv.ts`, `src/index.css`.

## Verification
- `npx tsc --noEmit`.
- Run the dev server. Check that the tree renders, pans and zooms, and that a node click opens the panel.
- Change a preset and confirm node colors and map markers update.
- Export CSV, open it, and check the row count (20) and that commas in text are quoted.
- Check the map chips filter the pins.
