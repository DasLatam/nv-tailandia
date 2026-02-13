'use client'

import { useEffect, useMemo, useState } from 'react'
import { ActivityList } from '@/components/ActivityList'
import { MapView } from '@/components/MapView'
import { ActivityModal } from '@/components/ActivityModal'

export type Activity = {
  id: string
  Nombre: string
  Tipo: string
  Horario: string
  Ciudad: string
  Tiempo: string
  Esfuerzo: string
  Costo: string
  Descripción: string
  Detalle: string
  NotaIA: string
  LATLON: string
  Image: string

  // Campos derivados (generados por scripts/build-data.mjs)
  lat: number
  lon: number
  approxLocation?: boolean
  imageUrl: string
  shortDescription: string
}

export default function Page() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set())
  const [selected, setSelected] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function run() {
      try {
        setLoading(true)
        const res = await fetch('/data/activities.json')
        if (!res.ok) throw new Error(`No se pudo cargar data: ${res.status}`)
        const json = (await res.json()) as Activity[]
        if (cancelled) return
        setActivities(json)
        setVisibleIds(new Set(json.map((a) => a.id)))
        setError(null)
      } catch (e: any) {
        if (cancelled) return
        setError(e?.message ?? 'Error desconocido cargando data')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  const totalCount = activities.length

  const visibleActivities = useMemo(() => {
    if (visibleIds.size === 0) return []
    const byId = new Set(visibleIds)
    return activities.filter((a) => byId.has(a.id))
  }, [activities, visibleIds])

  const hasAny = totalCount > 0
  const showingCount = visibleActivities.length

  return (
    <main className="flex h-dvh w-full flex-col overflow-hidden">
      <header className="z-10 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold">Mapa de Actividades — Tailandia</h1>
            <p className="truncate text-xs text-zinc-400">
              Lista se filtra por lo que esté dentro del mapa (zoom / pan).
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-300">
            {loading ? (
              <span className="rounded bg-zinc-900 px-2 py-1">Cargando…</span>
            ) : error ? (
              <span className="rounded bg-red-950/40 px-2 py-1 text-red-200">Error: {error}</span>
            ) : (
              <span className="rounded bg-zinc-900 px-2 py-1">
                Mostrando <b>{showingCount}</b> de <b>{totalCount}</b> referencias
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1600px] flex-1 min-h-0 grid-cols-1 gap-0 overflow-hidden md:grid-cols-[420px_1fr]">
        <section className="order-2 h-full overflow-hidden border-t border-zinc-800 md:order-1 md:border-r md:border-t-0">
          <ActivityList
            items={visibleActivities}
            totalCount={totalCount}
            showingCount={showingCount}
            loading={loading}
            onSelect={(a) => setSelected(a)}
          />
        </section>

        <section className="order-1 h-full overflow-hidden md:order-2">
          <MapView
            items={activities}
            onVisibleIdsChange={(ids) => setVisibleIds(ids)}
            onSelect={(a) => setSelected(a)}
            selectedId={selected?.id ?? null}
          />
        </section>
      </div>

      {selected ? <ActivityModal activity={selected} onClose={() => setSelected(null)} /> : null}

      {!loading && !error && !hasAny ? (
        <div className="fixed inset-0 flex items-center justify-center p-6">
          <div className="max-w-md rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-sm text-zinc-200">
            No hay actividades cargadas. Revisa <code className="text-zinc-100">data/activities.csv</code> y ejecuta{' '}
            <code className="text-zinc-100">npm run data:build</code>.
          </div>
        </div>
      ) : null}
    </main>
  )
}
