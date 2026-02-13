'use client'

import { useMemo, useState } from 'react'
import type { Activity } from '@/app/page'
import clsx from 'clsx'

type Props = {
  items: Activity[]
  totalCount: number
  showingCount: number
  loading?: boolean
  onSelect: (a: Activity) => void
}

export function ActivityList({ items, totalCount, showingCount, loading, onSelect }: Props) {
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
      <div className="border-b border-zinc-800 p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-medium">Actividades (vista actual)</div>
          <div className="text-xs text-zinc-400">
            {loading ? (
              <span>—</span>
            ) : (
              <span>
                Mostrando <b className="text-zinc-100">{showingCount}</b> de{' '}
                <b className="text-zinc-100">{totalCount}</b> referencias
              </span>
            )}
          </div>
        </div>

        <div className="mt-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar (nombre, ciudad, tipo)…"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm outline-none ring-0 placeholder:text-zinc-500 focus:border-zinc-700"
          />
          {query.trim() ? (
            <div className="mt-1 text-xs text-zinc-500">
              Filtrando <b className="text-zinc-200">{filtered.length}</b> de{' '}
              <b className="text-zinc-200">{items.length}</b> en la vista.
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
          <div className="p-4 text-sm text-zinc-400">Cargando actividades…</div>
        ) : filtered.length === 0 ? (
          <div className="p-4 text-sm text-zinc-400">No hay coincidencias en la vista actual.</div>
        ) : (
          <ul className="divide-y divide-zinc-900">
            {filtered.map((a) => (
              <li key={a.id}>
                <button
                  onClick={() => onSelect(a)}
                  className={clsx(
                    'flex w-full items-start gap-3 px-3 py-3 text-left hover:bg-zinc-900/40',
                    'focus:outline-none focus:ring-2 focus:ring-zinc-700'
                  )}
                >
                  <div className="mt-0.5 h-10 w-10 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.imageUrl} alt={a.Tipo || 'Actividad'} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-sm font-semibold">{a.Nombre}</div>
                      {a.approxLocation ? (
                        <span className="shrink-0 rounded bg-amber-950/40 px-1.5 py-0.5 text-[10px] text-amber-200">
                          aprox.
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-0.5 text-xs text-zinc-400">{a.shortDescription || a.Descripción}</div>
                    <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-zinc-500">
                      <span className="rounded bg-zinc-900 px-1.5 py-0.5">{a.Ciudad}</span>
                      {a.Tipo ? <span className="rounded bg-zinc-900 px-1.5 py-0.5">{a.Tipo}</span> : null}
                      {a.Horario ? <span className="rounded bg-zinc-900 px-1.5 py-0.5">{a.Horario}</span> : null}
                      {a.Tiempo ? <span className="rounded bg-zinc-900 px-1.5 py-0.5">{a.Tiempo}</span> : null}
                      {a.Costo ? <span className="rounded bg-zinc-900 px-1.5 py-0.5">{a.Costo}</span> : null}
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
