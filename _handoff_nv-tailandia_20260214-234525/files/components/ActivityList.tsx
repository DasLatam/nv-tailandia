'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Activity } from '@/app/page'
import clsx from 'clsx'

function typeToThumb(tipo?: string) {
  const t = (tipo ?? '').trim().toLowerCase()
  const map: Record<string, string> = {
    actividad: 'actividad',
    visita: 'visita',
    consejo: 'consejo',
    comida: 'comida',
    vuelo: 'vuelo',
    transporte: 'transporte',
    compras: 'compras',
    experiencia: 'experiencia',
    spa: 'spa',
    gastronomia: 'gastronomia',
    gastronomía: 'gastronomia',
    hotel: 'hotel',
    alojamiento: 'alojamiento',
    mercado: 'mercado',
    playa: 'playa',
    naturaleza: 'naturaleza',
    cultura: 'cultura',
    logistica: 'logistica',
    logística: 'logistica',
    etico: 'etico',
    ético: 'etico',
    'vida nocturna': 'vida-nocturna'
  }
  const slug = map[t] ?? 'actividad'
  return `/thumbs/${slug}.svg`
}

function SafeImg({ src, fallback, alt, className }: { src: string; fallback: string; alt: string; className?: string }) {
  const [cur, setCur] = useState(src)
  useEffect(() => setCur(src), [src])
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={cur}
      alt={alt}
      className={className}
      onError={() => {
        if (cur !== fallback) setCur(fallback)
      }}
    />
  )
}

type Props = {
  items: Activity[]
  totalCount: number
  showingCount: number
  loading?: boolean
  onSelect: (a: Activity) => void
  onRefreshSource?: () => Promise<void>
  refreshing?: boolean
}


export function ActivityList({ items, totalCount, showingCount, loading, onSelect, onRefreshSource, refreshing }: Props) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((a) => {
      return (
        a.Nombre.toLowerCase().includes(q) ||
        a.Ciudad.toLowerCase().includes(q) ||
        a.Tipo.toLowerCase().includes(q) ||
        a.Horario.toLowerCase().includes(q)
      )
    })
  }, [items, query])

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-zinc-200 bg-white p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-semibold text-zinc-900">Actividades (vista actual)</div>
          <div className="flex items-center gap-2">
            {onRefreshSource ? (
              <button
                type="button"
                title="Actualizar fuente (reprocesar CSV)"
                aria-label="Actualizar fuente"
                onClick={() => void onRefreshSource()}
                disabled={!!refreshing}
                className={clsx(
                  'rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 shadow-sm hover:bg-zinc-100',
                  refreshing && 'opacity-60 cursor-not-allowed'
                )}
              >
                {refreshing ? '⏳…' : '⏳'}
              </button>
            ) : null}
          </div>
          <div className="text-xs text-zinc-600">
            {loading ? (
              <span>—</span>
            ) : (
              <span>
                Mostrando <b className="text-zinc-900">{showingCount}</b> de{' '}
                <b className="text-zinc-900">{totalCount}</b> referencias
              </span>
            )}
          </div>
        </div>

        <div className="mt-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar (nombre, ciudad, tipo)…"
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-300"
          />
          {query.trim() ? (
            <div className="mt-1 text-xs text-zinc-500">
              Filtrando <b className="text-zinc-900">{filtered.length}</b> de{' '}
              <b className="text-zinc-900">{items.length}</b> en la vista.
            </div>
          ) : null}
        </div>
      </div>

      <div
        className="min-h-0 flex-1 overflow-auto overscroll-contain"
        onWheelCapture={(e) => e.stopPropagation()}
        onTouchMoveCapture={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="p-4 text-sm text-zinc-600">Cargando actividades…</div>
        ) : filtered.length === 0 ? (
          <div className="p-4 text-sm text-zinc-600">No hay coincidencias en la vista actual.</div>
        ) : (
          <ul className="divide-y divide-zinc-200">
            {filtered.map((a) => (
              <li key={a.id}>
                <button
                  onClick={() => onSelect(a)}
                  className={clsx(
                    'flex w-full items-start gap-3 px-3 py-3 text-left hover:bg-zinc-50',
                    'focus:outline-none focus:ring-2 focus:ring-zinc-300'
                  )}
                >
                  <div className="mt-0.5 h-10 w-10 overflow-hidden rounded-lg border border-zinc-200 bg-white">
                    <SafeImg
                      src={a.imageUrl}
                      fallback={typeToThumb(a.Tipo)}
                      alt={a.Tipo || 'Actividad'}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-sm font-semibold text-zinc-900">{a.Nombre}</div>
                      {a.approxLocation ? (
                        <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-800">
                          aprox.
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-0.5 text-xs text-zinc-600">{a.shortDescription || a.Descripción}</div>
                    <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-zinc-600">
                      <span className="rounded bg-zinc-100 px-1.5 py-0.5">{a.Ciudad}</span>
                      {a.Tipo ? <span className="rounded bg-zinc-100 px-1.5 py-0.5">{a.Tipo}</span> : null}
                      {a.Horario ? <span className="rounded bg-zinc-100 px-1.5 py-0.5">{a.Horario}</span> : null}
                      {a.Tiempo ? <span className="rounded bg-zinc-100 px-1.5 py-0.5">{a.Tiempo}</span> : null}
                      {a.Costo ? <span className="rounded bg-zinc-100 px-1.5 py-0.5">{a.Costo}</span> : null}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
