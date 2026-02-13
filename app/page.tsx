'use client'

import { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
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
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [rebuilding, setRebuilding] = useState(false)
  const [rebuildMsg, setRebuildMsg] = useState<string | null>(null)

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

  async function refreshSource() {
    try {
      setRebuilding(true)
      setRebuildMsg(null)
      const res = await fetch('/api/rebuild', { method: 'POST' })
      const data = await res.json()
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? `Error ${res.status}`)
      const json = data.activities as Activity[]
      setActivities(json)
      setVisibleIds(new Set(json.map((a) => a.id)))
      setError(null)
      setRebuildMsg(`Actualizado: ${data.count} (${data.persisted ? 'persistido' : 'en memoria'})`)
      window.setTimeout(() => setRebuildMsg(null), 2500)
    } catch (e: any) {
      setRebuildMsg(`Error actualizando: ${e?.message ?? 'desconocido'}`)
      window.setTimeout(() => setRebuildMsg(null), 4000)
    } finally {
      setRebuilding(false)
    }
  }

  const totalCount = activities.length

  const visibleActivities = useMemo(() => {
    if (visibleIds.size === 0) return []
    const byId = new Set(visibleIds)
    return activities.filter((a) => byId.has(a.id))
  }, [activities, visibleIds])

  const hasAny = totalCount > 0
  const showingCount = visibleActivities.length

  return (
    <main className="flex h-dvh w-full flex-col overflow-hidden bg-zinc-50">
      <header className="z-10 border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold">Mapa de Actividades — Tailandia</h1>
            <p className="truncate text-xs text-zinc-600">
              Lista se filtra por lo que esté dentro del mapa (zoom / pan).
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-700">
            {rebuildMsg ? (
              <span className="rounded border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 shadow-sm">{rebuildMsg}</span>
            ) : null}
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className={clsx(
                'rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 shadow-sm hover:bg-zinc-100',
                !sidebarOpen && 'bg-zinc-50'
              )}
              type="button"
              title={sidebarOpen ? 'Ocultar lista' : 'Mostrar lista'}
            >
              {sidebarOpen ? 'Ocultar lista' : 'Mostrar lista'}
            </button>
            {loading ? (
              <span className="rounded bg-zinc-100 px-2 py-1 text-zinc-700">Cargando…</span>
            ) : error ? (
              <span className="rounded border border-red-200 bg-red-50 px-2 py-1 text-red-700">Error: {error}</span>
            ) : (
              <span className="rounded bg-zinc-100 px-2 py-1 text-zinc-700">
                Mostrando <b>{showingCount}</b> de <b>{totalCount}</b> referencias
              </span>
            )}
          </div>
        </div>
      </header>

      <div
        className={clsx(
          'mx-auto grid w-full max-w-[1600px] flex-1 min-h-0 grid-cols-1 gap-0 overflow-hidden',
          sidebarOpen ? 'md:grid-cols-[420px_1fr]' : 'md:grid-cols-1'
        )}
      >
        {sidebarOpen ? (
          <section className="order-2 h-full overflow-hidden border-t border-zinc-200 bg-white md:order-1 md:border-r md:border-t-0">
            <ActivityList
              items={visibleActivities}
              totalCount={totalCount}
              showingCount={showingCount}
              loading={loading}
              onSelect={(a) => setSelected(a)}
              onRefreshSource={refreshSource}
              refreshing={rebuilding}
            />
          </section>
        ) : null}

        <section className={clsx('order-1 h-full overflow-hidden', sidebarOpen && 'md:order-2')}>
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
          <div className="max-w-md rounded-xl border border-zinc-200 bg-white p-5 text-sm text-zinc-700 shadow-sm">
            No hay actividades cargadas. Revisa{' '}
            <code className="rounded bg-zinc-100 px-1 py-0.5 text-zinc-900">data/activities.csv</code> y ejecuta{' '}
            <code className="rounded bg-zinc-100 px-1 py-0.5 text-zinc-900">npm run data:build</code>.
          </div>
        </div>
      ) : null}
    </main>
  )
}
