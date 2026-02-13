'use client'

import type { Activity } from '@/app/page'
import { useEffect } from 'react'

type Props = {
  activity: Activity
  onClose: () => void
}

export function ActivityModal({ activity, onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const mapsUrl = `https://www.google.com/maps?q=${activity.lat},${activity.lon}`

  return (
    <div className="fixed inset-0 z-20 flex items-end justify-center bg-black/60 p-3 md:items-center">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Cerrar"
        role="button"
        tabIndex={0}
      />
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        <div className="flex items-start gap-3 border-b border-zinc-800 p-4">
          <div className="h-12 w-12 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={activity.imageUrl} alt={activity.Tipo || 'Actividad'} className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-base font-semibold">{activity.Nombre}</h2>
              {activity.approxLocation ? (
                <span className="shrink-0 rounded bg-amber-950/40 px-1.5 py-0.5 text-[10px] text-amber-200">
                  ubicación aproximada
                </span>
              ) : null}
            </div>
            <div className="mt-1 flex flex-wrap gap-2 text-xs text-zinc-400">
              <span className="rounded bg-zinc-900 px-2 py-1">{activity.Ciudad}</span>
              {activity.Tipo ? <span className="rounded bg-zinc-900 px-2 py-1">{activity.Tipo}</span> : null}
              {activity.Horario ? <span className="rounded bg-zinc-900 px-2 py-1">{activity.Horario}</span> : null}
              {activity.Tiempo ? <span className="rounded bg-zinc-900 px-2 py-1">{activity.Tiempo}</span> : null}
              {activity.Costo ? <span className="rounded bg-zinc-900 px-2 py-1">{activity.Costo}</span> : null}
              {activity.Esfuerzo ? <span className="rounded bg-zinc-900 px-2 py-1">{activity.Esfuerzo}</span> : null}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-900/60"
            >
              Abrir en Google Maps
            </a>
            <button
              onClick={onClose}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-900/40"
            >
              Cerrar
            </button>
          </div>
        </div>

        <div className="max-h-[75dvh] overflow-auto p-4">
          {activity.Descripción ? (
            <section className="mb-4">
              <h3 className="mb-1 text-sm font-semibold text-zinc-100">Descripción</h3>
              <p className="whitespace-pre-wrap text-sm text-zinc-200">{activity.Descripción}</p>
            </section>
          ) : null}

          {activity.Detalle ? (
            <section className="mb-4">
              <h3 className="mb-1 text-sm font-semibold text-zinc-100">Detalle</h3>
              <p className="whitespace-pre-wrap text-sm text-zinc-200">{activity.Detalle}</p>
            </section>
          ) : null}

          {activity.NotaIA ? (
            <section className="mb-4">
              <h3 className="mb-1 text-sm font-semibold text-zinc-100">Nota</h3>
              <p className="whitespace-pre-wrap text-sm text-zinc-200">{activity.NotaIA}</p>
            </section>
          ) : null}

          <section>
            <h3 className="mb-2 text-sm font-semibold text-zinc-100">Datos (CSV)</h3>
            <div className="grid grid-cols-1 gap-2 text-xs md:grid-cols-2">
              <Field label="Nombre" value={activity.Nombre} />
              <Field label="Ciudad" value={activity.Ciudad} />
              <Field label="Tipo" value={activity.Tipo} />
              <Field label="Horario" value={activity.Horario} />
              <Field label="Tiempo" value={activity.Tiempo} />
              <Field label="Esfuerzo" value={activity.Esfuerzo} />
              <Field label="Costo" value={activity.Costo} />
              <Field label="LATLON (original)" value={activity.LATLON || '-'} />
              <Field label="lat/lon (usado)" value={`${activity.lat}, ${activity.lon}`} />
              <Field label="Image (original)" value={activity.Image || '-'} />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-900 bg-zinc-950 p-3">
      <div className="text-[11px] text-zinc-500">{label}</div>
      <div className="mt-1 break-words text-zinc-200">{value || '-'}</div>
    </div>
  )
}
