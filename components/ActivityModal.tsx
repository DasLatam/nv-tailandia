'use client'

import type { Activity } from '@/app/page'
import { useEffect, useMemo, useState } from 'react'

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

function SafeImg({
  src,
  fallback,
  alt,
  className
}: {
  src: string
  fallback: string
  alt: string
  className?: string
}) {
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
  activity: Activity
  onClose: () => void
}

export function ActivityModal({ activity, onClose }: Props) {
  const [showCsv, setShowCsv] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const mapsUrl = useMemo(() => {
    const lat = Number(activity.lat)
    const lon = Number(activity.lon)
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
    return `https://www.google.com/maps?q=${lat},${lon}`
  }, [activity.lat, activity.lon])

  const thumbFallback = typeToThumb(activity.Tipo)

  return (
    <div className="fixed inset-0 z-20 flex items-end justify-center p-3 md:items-center">
      <div
        className="absolute inset-0 bg-zinc-900/30 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Cerrar"
        role="button"
        tabIndex={0}
      />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start gap-3 border-b border-zinc-200 p-4">
          <div className="h-11 w-11 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
            <SafeImg
              src={activity.imageUrl}
              fallback={thumbFallback}
              alt={activity.Tipo || 'Actividad'}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-base font-semibold text-zinc-900">{activity.Nombre}</h2>
              {activity.approxLocation ? (
                <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-800">
                  ubicación aproximada
                </span>
              ) : null}
            </div>

            <div className="mt-1 flex flex-wrap gap-2 text-xs text-zinc-700">
              <Pill>{activity.Ciudad}</Pill>
              {activity.Tipo ? <Pill>{activity.Tipo}</Pill> : null}
              {activity.Horario ? <Pill>{activity.Horario}</Pill> : null}
              {activity.Tiempo ? <Pill>{activity.Tiempo}</Pill> : null}
              {activity.Costo ? <Pill>{activity.Costo}</Pill> : null}
              {activity.Esfuerzo ? <Pill>{activity.Esfuerzo}</Pill> : null}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {mapsUrl ? (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-800 shadow-sm hover:bg-zinc-100"
              >
                Abrir en Maps
              </a>
            ) : null}
            <button
              onClick={onClose}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-800 shadow-sm hover:bg-zinc-100"
            >
              Cerrar
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[78dvh] overflow-auto p-4">
          {/* Bloques principales (reducen scroll: lo largo va en 1 columna solo cuando existe) */}
          {activity.Descripción ? (
            <section className="mb-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <h3 className="mb-1 text-sm font-semibold text-zinc-900">Descripción</h3>
              <p className="whitespace-pre-wrap text-sm text-zinc-700">{activity.Descripción}</p>
            </section>
          ) : null}

          {activity.Detalle ? (
            <section className="mb-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <h3 className="mb-1 text-sm font-semibold text-zinc-900">Detalle</h3>
              <p className="whitespace-pre-wrap text-sm text-zinc-700">{activity.Detalle}</p>
            </section>
          ) : null}

          {activity.NotaIA ? (
            <section className="mb-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <h3 className="mb-1 text-sm font-semibold text-zinc-900">Nota</h3>
              <p className="whitespace-pre-wrap text-sm text-zinc-700">{activity.NotaIA}</p>
            </section>
          ) : null}

          {/* Datos clave (siempre visible, compacto) */}
          <section className="mb-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-zinc-900">Datos clave</h3>
              <button
                type="button"
                onClick={() => setShowCsv((v) => !v)}
                className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[11px] text-zinc-800 shadow-sm hover:bg-zinc-100"
                title="Mostrar/ocultar todos los campos del CSV"
              >
                {showCsv ? 'Ocultar CSV' : 'Ver CSV completo'}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 text-xs md:grid-cols-2">
              <Field label="Nombre" value={activity.Nombre} />
              <Field label="Ciudad" value={activity.Ciudad} />
              <Field label="Tipo" value={activity.Tipo} />
              <Field label="Horario" value={activity.Horario} />
              <Field label="Tiempo" value={activity.Tiempo} />
              <Field label="Costo" value={activity.Costo} />
              <Field label="Esfuerzo" value={activity.Esfuerzo} />
              <Field label="Coordenadas" value={`${activity.lat}, ${activity.lon}`} />
            </div>
          </section>

          {/* CSV completo (colapsable) */}
          {showCsv ? (
            <section className="rounded-xl border border-zinc-200 bg-white p-4">
              <h3 className="mb-2 text-sm font-semibold text-zinc-900">Datos (CSV)</h3>
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
          ) : null}
        </div>
      </div>
    </div>
  )
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="rounded bg-zinc-100 px-2 py-1 text-zinc-700">{children}</span>
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3">
      <div className="text-[11px] text-zinc-500">{label}</div>
      <div className="mt-1 break-words text-zinc-800">{value || '-'}</div>
    </div>
  )
}
