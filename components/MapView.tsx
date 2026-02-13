'use client'

import { useEffect, useMemo, useRef } from 'react'
import maplibregl, { Map as MapLibreMap, Marker, Popup } from 'maplibre-gl'
import type { Activity } from '@/app/page'

type Props = {
  items: Activity[]
  selectedId: string | null
  onVisibleIdsChange: (ids: Set<string>) => void
  onSelect: (a: Activity) => void
}

function escapeHtml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function makeBounds(points: Array<{ lat: number; lon: number }>) {
  const lats = points.map((p) => p.lat)
  const lons = points.map((p) => p.lon)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLon = Math.min(...lons)
  const maxLon = Math.max(...lons)
  return new maplibregl.LngLatBounds([minLon, minLat], [maxLon, maxLat])
}

export function MapView({ items, selectedId, onVisibleIdsChange, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const markersRef = useRef<Map<string, Marker>>(new Map())
  const hoverPopupRef = useRef<Popup | null>(null)

  const itemById = useMemo(() => {
    const m = new Map<string, Activity>()
    for (const a of items) m.set(a.id, a)
    return m
  }, [items])

  const thailandItems = useMemo(() => {
    // Heurística: Tailandia aprox lat 5..22 lon 97..106
    return items.filter((a) => a.lat >= 5 && a.lat <= 22 && a.lon >= 97 && a.lon <= 106)
  }, [items])

  useEffect(() => {
    if (!containerRef.current) return
    if (mapRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [{ id: 'osm', type: 'raster', source: 'osm' }]
      },
      center: [100.501762, 13.756331],
      zoom: 5
    })

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right')

    mapRef.current = map

    return () => {
      hoverPopupRef.current?.remove()
      hoverPopupRef.current = null
      for (const mk of markersRef.current.values()) mk.remove()
      markersRef.current.clear()
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Crear markers (solo una vez cuando llegan items)
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (!items.length) return

    // Evitar duplicar markers si ya están cargados
    if (markersRef.current.size > 0) return

    for (const a of items) {
      const el = document.createElement('button')
      el.type = 'button'
      el.className =
        'group relative flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950/80 shadow-lg backdrop-blur hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-700'
      el.setAttribute('aria-label', a.Nombre)

      const img = document.createElement('img')
      img.src = a.imageUrl
      img.alt = a.Tipo || 'Actividad'
      img.className = 'h-6 w-6 rounded-md'
      el.appendChild(img)

      el.addEventListener('mouseenter', () => {
        const m = mapRef.current
        if (!m) return
        hoverPopupRef.current?.remove()
        hoverPopupRef.current = new maplibregl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 14
        })
          .setLngLat([a.lon, a.lat])
          .setHTML(
            `<div style="display:flex;gap:8px;align-items:center;max-width:260px;">` +
              `<img src="${escapeHtml(a.imageUrl)}" style="width:28px;height:28px;border-radius:8px;border:1px solid rgba(255,255,255,0.12);"/>` +
              `<div style="font-size:12px;line-height:1.2;">` +
              `<div style="font-weight:700;">${escapeHtml(a.Nombre)}</div>` +
              `<div style="opacity:0.8;">${escapeHtml(a.Ciudad)}${a.Tipo ? ' • ' + escapeHtml(a.Tipo) : ''}</div>` +
              `</div></div>`
          )
          .addTo(m)
      })

      el.addEventListener('mouseleave', () => {
        hoverPopupRef.current?.remove()
        hoverPopupRef.current = null
      })

      el.addEventListener('click', () => onSelect(a))

      const marker = new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat([a.lon, a.lat]).addTo(map)
      markersRef.current.set(a.id, marker)
    }

    // Al cargar, encuadrar Tailandia (si existe), sino encuadrar todo
    const points = (thailandItems.length ? thailandItems : items).map((a) => ({ lat: a.lat, lon: a.lon }))
    if (points.length >= 2) {
      const bounds = makeBounds(points)
      map.fitBounds(bounds, { padding: 60, maxZoom: 12, duration: 0 })
    }

    const updateVisible = () => {
      const m = mapRef.current
      if (!m) return
      const b = m.getBounds()
      const ids = new Set<string>()
      for (const a of items) {
        if (b.contains([a.lon, a.lat])) ids.add(a.id)
      }
      onVisibleIdsChange(ids)
    }

    map.on('moveend', updateVisible)
    map.on('zoomend', updateVisible)
    map.on('dragend', updateVisible)
    map.on('load', updateVisible)

    // Primera evaluación
    updateVisible()

    return () => {
      map.off('moveend', updateVisible)
      map.off('zoomend', updateVisible)
      map.off('dragend', updateVisible)
      map.off('load', updateVisible)
    }
  }, [items, onSelect, onVisibleIdsChange, thailandItems])

  // Highlight / flyTo selección
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // reset highlight
    for (const [id, marker] of markersRef.current.entries()) {
      const el = marker.getElement()
      if (id === selectedId) {
        el.classList.add('ring-2', 'ring-emerald-400')
      } else {
        el.classList.remove('ring-2', 'ring-emerald-400')
      }
    }

    if (!selectedId) return
    const a = itemById.get(selectedId)
    if (!a) return

    map.flyTo({ center: [a.lon, a.lat], zoom: Math.max(map.getZoom(), 13), speed: 0.9 })
  }, [selectedId, itemById])

  const fitThailand = () => {
    const map = mapRef.current
    if (!map) return
    const points = (thailandItems.length ? thailandItems : items).map((a) => ({ lat: a.lat, lon: a.lon }))
    if (!points.length) return
    if (points.length === 1) {
      map.flyTo({ center: [points[0].lon, points[0].lat], zoom: 12 })
      return
    }
    map.fitBounds(makeBounds(points), { padding: 60, maxZoom: 12 })
  }

  const fitAll = () => {
    const map = mapRef.current
    if (!map) return
    const points = items.map((a) => ({ lat: a.lat, lon: a.lon }))
    if (!points.length) return
    if (points.length === 1) {
      map.flyTo({ center: [points[0].lon, points[0].lat], zoom: 12 })
      return
    }
    map.fitBounds(makeBounds(points), { padding: 60, maxZoom: 6 })
  }

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      <div className="absolute left-3 top-3 z-10 flex gap-2">
        <button
          onClick={fitThailand}
          className="rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-200 backdrop-blur hover:bg-zinc-900/70"
        >
          Ver Tailandia
        </button>
        <button
          onClick={fitAll}
          className="rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-200 backdrop-blur hover:bg-zinc-900/70"
        >
          Ver todo
        </button>
      </div>

      {selectedId ? (
        <div className="absolute bottom-3 left-3 z-10 rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-200 backdrop-blur">
          Seleccionado: <b>{itemById.get(selectedId)?.Nombre ?? selectedId}</b>
        </div>
      ) : null}
    </div>
  )
}
