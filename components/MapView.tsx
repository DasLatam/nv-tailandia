'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import maplibregl, { type Map as MapLibreMap } from 'maplibre-gl'
import type { Activity } from '@/app/page'

type Props = {
  items: Activity[]
  onVisibleIdsChange: (ids: Set<string>) => void
  onSelect: (a: Activity) => void
  selectedId: string | null
  focusKey?: string | null
}

type Basemap = 'openfreemap_liberty' | 'openfreemap_positron' | 'raster_osm' | 'blank'

// OpenFreeMap (sin API key): estilos públicos recomendados.
const OPENFREEMAP_LIBERTY_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'
const OPENFREEMAP_POSITRON_STYLE_URL = 'https://tiles.openfreemap.org/styles/positron'

// Raster fallback (OSM). Siempre funciona y no depende de glyphs/sprites.
const RASTER_OSM_STYLE: any = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors'
    }
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }]
}

// Blank local style (useful offline: renders points with no external tiles)
const BLANK_STYLE: any = {
  version: 8,
  sources: {},
  layers: [{ id: 'bg', type: 'background', paint: { 'background-color': '#eef2f6' } }]
}


function basemapToStyle(b: Basemap) {
  if (b === 'openfreemap_positron') return OPENFREEMAP_POSITRON_STYLE_URL
  if (b === 'blank') return BLANK_STYLE
  if (b === 'raster_osm') return RASTER_OSM_STYLE
  return OPENFREEMAP_LIBERTY_STYLE_URL
}

function isFiniteNumber(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n)
}

function escapeHtml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

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

function makeAccuracyPolygon(lon: number, lat: number, meters: number) {
  // Aproximación: metros -> grados (válida para UI). 64 puntos.
  const points = 64
  const latRad = (lat * Math.PI) / 180
  const degLat = meters / 111320
  const degLon = meters / (111320 * Math.cos(latRad))

  const coords: [number, number][] = []
  for (let i = 0; i <= points; i++) {
    const a = (i / points) * Math.PI * 2
    const x = Math.cos(a) * degLon
    const y = Math.sin(a) * degLat
    coords.push([lon + x, lat + y])
  }

  return {
    type: 'Feature',
    geometry: { type: 'Polygon', coordinates: [coords] },
    properties: {}
  } as any
}

export function MapView({ items, onVisibleIdsChange, onSelect, selectedId, focusKey }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const popupRef = useRef<maplibregl.Popup | null>(null)

  const didInitialFitRef = useRef(false)
  const layersReadyRef = useRef(false)
  const lastAppliedBasemapRef = useRef<Basemap | null>(null)

  // Refs para evitar closures “viejas” en handlers registrados una sola vez.
  const validItemsRef = useRef<Activity[]>([])
  const itemsByIdRef = useRef<Map<string, Activity>>(new Map())
  const geojsonRef = useRef<any>(null)
  const onVisibleIdsChangeRef = useRef(onVisibleIdsChange)
  const onSelectRef = useRef(onSelect)
  const selectedIdRef = useRef<string | null>(selectedId)

  const [basemap, setBasemap] = useState<Basemap>('openfreemap_liberty')
  const [ready, setReady] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [layersOk, setLayersOk] = useState(false)
  const [controlsOpen, setControlsOpen] = useState(true)
  const [locating, setLocating] = useState(false)
  const userLocRef = useRef<{ lon: number; lat: number; acc?: number } | null>(null)

  const validItems = useMemo(() => items.filter((a) => isFiniteNumber(a.lat) && isFiniteNumber(a.lon)), [items])

  const geojson = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: validItems.map((a) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [a.lon, a.lat] },
        properties: {
          id: a.id,
          Nombre: a.Nombre,
          Ciudad: a.Ciudad,
          Tipo: a.Tipo,
          imageUrl: a.imageUrl,
          shortDescription: a.shortDescription,
          approxLocation: a.approxLocation ? '1' : ''
        }
      }))
    } as any
  }, [validItems])

  useEffect(() => {
    validItemsRef.current = validItems
    geojsonRef.current = geojson
    itemsByIdRef.current = new Map(items.map((a) => [a.id, a]))
  }, [validItems, geojson, items])

  useEffect(() => {
    onVisibleIdsChangeRef.current = onVisibleIdsChange
  }, [onVisibleIdsChange])

  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  useEffect(() => {
    selectedIdRef.current = selectedId
  }, [selectedId])

  const computeBounds = useCallback((mode: 'thai' | 'all') => {
    const points = validItemsRef.current
    if (!points.length) return null

    const filtered =
      mode === 'thai'
        ? points.filter((a) => a.lat >= 5 && a.lat <= 22 && a.lon >= 97 && a.lon <= 106)
        : points

    if (!filtered.length) return null

    let minLat = filtered[0].lat
    let maxLat = filtered[0].lat
    let minLon = filtered[0].lon
    let maxLon = filtered[0].lon

    for (const p of filtered) {
      minLat = Math.min(minLat, p.lat)
      maxLat = Math.max(maxLat, p.lat)
      minLon = Math.min(minLon, p.lon)
      maxLon = Math.max(maxLon, p.lon)
    }

    if (minLat === maxLat) {
      minLat -= 0.01
      maxLat += 0.01
    }
    if (minLon === maxLon) {
      minLon -= 0.01
      maxLon += 0.01
    }

    return new maplibregl.LngLatBounds([minLon, minLat], [maxLon, maxLat])
  }, [])

  const fitTo = useCallback(
    (mode: 'thai' | 'all') => {
      const map = mapRef.current
      if (!map) return
      const b = computeBounds(mode)
      if (!b) return
      map.fitBounds(b, {
        padding: 60,
        duration: 0,
        maxZoom: mode === 'thai' ? 13 : 5
      })
    },
    [computeBounds]
  )

  const fitBest = useCallback(() => {
    const map = mapRef.current
    if (!map) return
    const points = validItemsRef.current
    if (!points.length) return

    const thaiCount = points.filter((a) => a.lat >= 5 && a.lat <= 22 && a.lon >= 97 && a.lon <= 106).length
    const thaiBounds = computeBounds('thai')
    const allBounds = computeBounds('all')

    if (thaiBounds && thaiCount >= Math.min(20, Math.floor(points.length * 0.35))) {
      map.fitBounds(thaiBounds, { padding: 60, duration: 0, maxZoom: 13 })
      return
    }
    if (allBounds) {
      map.fitBounds(allBounds, { padding: 60, duration: 0, maxZoom: 5 })
    }
  }, [computeBounds])

  const updateVisibleIds = useCallback(() => {
    const map = mapRef.current
    if (!map) return

    const points = validItemsRef.current
    if (!points.length) return

    const b = map.getBounds()
    const ids = new Set<string>()

    for (const a of points) {
      if (b.contains([a.lon, a.lat] as any)) ids.add(a.id)
    }

    onVisibleIdsChangeRef.current(ids)
  }, [])

  const onEnterCursor = useCallback(() => {
    const map = mapRef.current
    if (map) map.getCanvas().style.cursor = 'pointer'
  }, [])

  const onLeaveCursor = useCallback(() => {
    const map = mapRef.current
    if (map) map.getCanvas().style.cursor = ''
  }, [])

  const onLeaveHover = useCallback(() => {
    popupRef.current?.remove()
  }, [])

  const onHoverPoint = useCallback((e: any) => {
    const map = mapRef.current
    if (!map) return

    const f = e?.features?.[0]
    if (!f?.properties) return

    const Nombre = escapeHtml(String(f.properties.Nombre ?? ''))
    const Ciudad = escapeHtml(String(f.properties.Ciudad ?? ''))
    const shortDescription = escapeHtml(String(f.properties.shortDescription ?? ''))
    const imageUrl = String(f.properties.imageUrl ?? '')
    const approx = String(f.properties.approxLocation ?? '')

    const fallback = typeToThumb(String(f.properties.Tipo ?? ''))
    const img = imageUrl && imageUrl !== 'Link' ? imageUrl : fallback

    const html = `
      <div style="display:flex;gap:10px;align-items:flex-start;max-width:300px">
        <img src="${escapeHtml(img)}" onerror="this.onerror=null;this.src='${escapeHtml(fallback)}'" alt="" width="44" height="44" style="border-radius:10px;object-fit:cover;background:#f4f4f5;border:1px solid #e5e7eb" />
        <div style="min-width:0">
          <div style="font-weight:700;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${Nombre}</div>
          <div style="font-size:12px;color:#52525b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${Ciudad}${approx ? ' · aprox.' : ''}</div>
          <div style="margin-top:4px;font-size:12px;color:#3f3f46">${shortDescription}</div>
        </div>
      </div>
    `.trim()

    popupRef.current?.remove()
    popupRef.current = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 14 })
      .setLngLat(e.lngLat)
      .setHTML(html)
      .addTo(map)
  }, [])

  const onClickPoint = useCallback((e: any) => {
    const f = e?.features?.[0]
    const id = String(f?.properties?.id ?? '')
    if (!id) return

    const found = itemsByIdRef.current.get(id)
    if (found) onSelectRef.current(found)
  }, [])

  const onClickCluster = useCallback((e: any) => {
    const map = mapRef.current
    if (!map) return

    const f = e?.features?.[0]
    const clusterId = f?.properties?.cluster_id
    const src = map.getSource('activities') as any
    if (!src || clusterId == null) return

    src.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
      if (err) return
      const maxZoom = typeof (map as any).getMaxZoom === 'function' ? (map as any).getMaxZoom() : 22
      const targetZoom = Math.min(zoom + 0.35, maxZoom)
      map.easeTo({ center: f.geometry.coordinates, zoom: targetZoom, duration: 380 })
    })
  }, [])

  const ensureLayers = useCallback(() => {
    const map = mapRef.current
    if (!map) return

    // 1) Asegurar que el style exista
    try {
      const style = map.getStyle()
      if (!style || !style.layers) return
    } catch {
      return
    }

    const data = geojsonRef.current ?? { type: 'FeatureCollection', features: [] }

    // 2) Source (crear o actualizar)
    try {
      const src = map.getSource('activities') as maplibregl.GeoJSONSource | undefined
      if (!src) {
        map.addSource('activities', {
          type: 'geojson',
          data,
          cluster: true,
          clusterRadius: 45,
          clusterMaxZoom: 12
        })
      } else {
        src.setData(data)
      }
    } catch {
      return
    }

    const hasLayer = (id: string) => Boolean(map.getLayer(id))

    // 3) Layers (solo circle layers — evita dependencia de glyphs/fonts)
    if (!hasLayer('clusters')) {
      try {
        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'activities',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': '#10b981',
            'circle-radius': ['step', ['get', 'point_count'], 16, 20, 20, 50, 26],
            'circle-opacity': 0.75,
            'circle-stroke-color': '#052e1e',
            'circle-stroke-width': 2
          }
        })
      } catch {
        return
      }
    }

    if (!hasLayer('unclustered-point')) {
      try {
        map.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'activities',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#e5e7eb',
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 3, 8, 6, 12, 8],
            'circle-stroke-color': '#0f172a',
            'circle-stroke-width': 2,
            'circle-opacity': 0.9
          }
        })
      } catch {
        return
      }
    }

    if (!hasLayer('selected-point')) {
      try {
        map.addLayer({
          id: 'selected-point',
          type: 'circle',
          source: 'activities',
          filter: ['==', ['get', 'id'], '__none__'],
          paint: {
            'circle-color': '#f59e0b',
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 6, 8, 10, 12, 14],
            'circle-stroke-color': '#111827',
            'circle-stroke-width': 3
          }
        })
      } catch {
        return
      }
    }

    // Selected highlight
    if (map.getLayer('selected-point')) {
      map.setFilter('selected-point', ['==', ['get', 'id'], selectedIdRef.current ?? '__none__'])
    }

    // 4) Re-registrar handlers (idempotente)
    map.off('mousemove', 'unclustered-point', onHoverPoint)
    map.off('mouseleave', 'unclustered-point', onLeaveHover)
    map.off('click', 'unclustered-point', onClickPoint)
    map.off('click', 'clusters', onClickCluster)
    map.off('mouseenter', 'clusters', onEnterCursor)
    map.off('mouseleave', 'clusters', onLeaveCursor)
    map.off('mouseenter', 'unclustered-point', onEnterCursor)
    map.off('mouseleave', 'unclustered-point', onLeaveCursor)

    map.on('mousemove', 'unclustered-point', onHoverPoint)
    map.on('mouseleave', 'unclustered-point', onLeaveHover)
    map.on('click', 'unclustered-point', onClickPoint)
    map.on('click', 'clusters', onClickCluster)
    map.on('mouseenter', 'clusters', onEnterCursor)
    map.on('mouseleave', 'clusters', onLeaveCursor)
    map.on('mouseenter', 'unclustered-point', onEnterCursor)
    map.on('mouseleave', 'unclustered-point', onLeaveCursor)

    layersReadyRef.current = true
    setLayersOk(true)
  }, [onClickCluster, onClickPoint, onEnterCursor, onHoverPoint, onLeaveCursor, onLeaveHover])

  const ensureUserLocationLayers = useCallback(() => {
    const map = mapRef.current
    if (!map) return

    const loc = userLocRef.current
    if (!loc) return

    const hasSource = (id: string) => Boolean(map.getSource(id))
    const hasLayer = (id: string) => Boolean(map.getLayer(id))

    const pointData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [loc.lon, loc.lat] },
          properties: {}
        }
      ]
    } as any

    const accuracy = typeof loc.acc === 'number' && Number.isFinite(loc.acc) ? Math.min(Math.max(loc.acc, 10), 1500) : null
    const poly = accuracy ? makeAccuracyPolygon(loc.lon, loc.lat, accuracy) : null
    const polyData = poly ? { type: 'FeatureCollection', features: [poly] } : { type: 'FeatureCollection', features: [] }

    if (!hasSource('user-location')) {
      try {
        map.addSource('user-location', { type: 'geojson', data: pointData })
      } catch {
        // ignore
      }
    } else {
      try {
        ;(map.getSource('user-location') as any)?.setData(pointData)
      } catch {
        // ignore
      }
    }

    if (!hasSource('user-accuracy')) {
      try {
        map.addSource('user-accuracy', { type: 'geojson', data: (polyData as any) })
      } catch {
        // ignore
      }
    } else {
      try {
        ;(map.getSource('user-accuracy') as any)?.setData(polyData)
      } catch {
        // ignore
      }
    }

    // Accuracy fill
    if (!hasLayer('user-accuracy-fill')) {
      try {
        map.addLayer({
          id: 'user-accuracy-fill',
          type: 'fill',
          source: 'user-accuracy',
          paint: {
            'fill-color': '#60a5fa',
            'fill-opacity': 0.15
          }
        })
      } catch {
        // ignore
      }
    }

    // Accuracy outline
    if (!hasLayer('user-accuracy-line')) {
      try {
        map.addLayer({
          id: 'user-accuracy-line',
          type: 'line',
          source: 'user-accuracy',
          paint: {
            'line-color': '#60a5fa',
            'line-width': 1.5,
            'line-opacity': 0.6
          }
        })
      } catch {
        // ignore
      }
    }

    // User point
    if (!hasLayer('user-location-dot')) {
      try {
        map.addLayer({
          id: 'user-location-dot',
          type: 'circle',
          source: 'user-location',
          paint: {
            'circle-color': '#2563eb',
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 4, 10, 7, 14, 9],
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 2,
            'circle-opacity': 0.95
          }
        })
      } catch {
        // ignore
      }
    }
  }, [])

  const centerOnUser = useCallback(() => {
    const map = mapRef.current
    if (!map) return

    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setStatus('Geolocalización no disponible en este dispositivo.')
      return
    }

    setLocating(true)
    setStatus('Obteniendo tu ubicación…')

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords
        userLocRef.current = { lat: latitude, lon: longitude, acc: accuracy }
        ensureUserLocationLayers()
        map.easeTo({ center: [longitude, latitude], zoom: Math.max(map.getZoom(), 13), duration: 600 })
        setLocating(false)
        setStatus(null)
      },
      (err) => {
        setLocating(false)
        const msg = err?.message || 'No se pudo obtener tu ubicación.'
        setStatus(msg)
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
    )
  }, [ensureUserLocationLayers])

  // ---------- Init map (una sola vez) ----------
  useEffect(() => {
    if (!containerRef.current) return
    if (mapRef.current) return

    setStatus('Inicializando mapa…')

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      // Offline: usar un estilo local (sin depender de tiles/estilos remotos).
      setBasemap('raster_osm')
      setStatus('Offline: el mapa base no está disponible, pero los puntos sí.')
    }

    const initialBasemap: Basemap = typeof navigator !== 'undefined' && !navigator.onLine ? 'raster_osm' : basemap
    lastAppliedBasemapRef.current = initialBasemap

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: basemapToStyle(initialBasemap),
      center: [100.501762, 13.756331],
      zoom: 4,
      attributionControl: true,
      cooperativeGestures: true
    } as any)

    mapRef.current = map

    // UX: sin rotación por defecto.
    map.dragRotate.disable()
    map.touchZoomRotate.disableRotation()

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left')
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-left')

    // Wheel: evitar que el scroll "se pase" al mapa (zoom solo con Ctrl/⌘)
    const el = containerRef.current
    const wheel = (ev: WheelEvent) => {
      const wantsZoom = ev.ctrlKey || ev.metaKey
      if (!wantsZoom) {
        ev.preventDefault()
      }
    }
    el?.addEventListener('wheel', wheel, { passive: false })

    const onLoad = () => {
      setReady(true)
      setStatus(null)
      ensureLayers()
      // Si ya hay ubicación del usuario, reinyectar la capa luego del load.
      ensureUserLocationLayers()

      if (!didInitialFitRef.current && validItemsRef.current.length > 0) {
        didInitialFitRef.current = true
        fitBest()
      }

      updateVisibleIds()
    }

    // Cuando cambia el style (setStyle), este evento es el lugar fiable para reinyectar capas.
    const onStyleLoad = () => {
      layersReadyRef.current = false
      setLayersOk(false)
      ensureLayers()
      ensureUserLocationLayers()
      updateVisibleIds()
    }

    const onError = (ev: any) => {
      // Ignorar errores de tiles individuales (si estamos offline o con mala señal, es ruido).
      if (ev?.sourceId) return

      const msg = ev?.error?.message || ev?.error?.toString?.() || 'Error de mapa'

      // Si el estilo remoto falla, caer a un estilo local (raster/blank) para que los puntos sigan funcionando.
      const last = lastAppliedBasemapRef.current
      const looksNetwork = /Failed to fetch|NetworkError|Load failed|fetch/i.test(String(msg))
      const remoteBasemap = last === 'openfreemap_liberty' || last === 'openfreemap_positron'
      if (looksNetwork && remoteBasemap) {
        setBasemap('raster_osm')
        setStatus('Mapa base no disponible (sin conexión). Mostrando puntos.')
        return
      }

      setStatus(`Mapa: ${msg}`)
    }

    map.on('load', onLoad)
    map.on('style.load', onStyleLoad)
    map.on('moveend', updateVisibleIds)
    map.on('zoomend', updateVisibleIds)

    // styledata se dispara muchas veces, pero es útil para reintentos cuando estilos remotos tardan.
    map.on('styledata', () => {
      if (!layersReadyRef.current) ensureLayers()
    })

    map.on('error', onError)

    return () => {
      el?.removeEventListener('wheel', wheel)
      popupRef.current?.remove()
      popupRef.current = null
      map.remove()
      mapRef.current = null
    }
  }, [basemap, ensureLayers, fitBest, updateVisibleIds])

  // Basemap switch (evitar setStyle redundante al montar)
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (!ready) return

    const last = lastAppliedBasemapRef.current
    if (last === basemap) return
    lastAppliedBasemapRef.current = basemap

    setStatus('Cambiando basemap…')
    layersReadyRef.current = false
    setLayersOk(false)

    try {
      // IMPORTANT: diff:false evita errores internos de style diff (y flashes raros con fuentes/sprites)
      map.setStyle(basemapToStyle(basemap), { diff: false } as any)
      window.setTimeout(() => setStatus(null), 500)
    } catch (e: any) {
      setStatus(e?.message ?? 'No se pudo cambiar el basemap')
    }
  }, [basemap, ready])

  // Sync data -> source
  useEffect(() => {
    if (!ready) return
    ensureLayers()

    if (!didInitialFitRef.current && validItemsRef.current.length > 0) {
      didInitialFitRef.current = true
      fitBest()
    }

    updateVisibleIds()
  }, [ready, items, ensureLayers, fitBest, updateVisibleIds])

  // Selected highlight
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (!map.getLayer('selected-point')) return
    map.setFilter('selected-point', ['==', ['get', 'id'], selectedId ?? '__none__'])
  }, [selectedId])

  // Focus (desde lista): centrar y hacer zoom a un punto aunque sea el mismo ID repetido
  useEffect(() => {
    if (!focusKey) return
    const map = mapRef.current
    if (!map) return

    const id = String(focusKey).split('|')[0]
    const a = itemsByIdRef.current.get(id)
    if (!a) return
    if (!isFiniteNumber(a.lat) || !isFiniteNumber(a.lon)) return

    // Asegurar salir del clustering (clusterMaxZoom=12)
    const targetZoom = Math.max(map.getZoom(), 13.25)
    popupRef.current?.remove()
    map.easeTo({ center: [a.lon, a.lat], zoom: targetZoom, duration: 650 })
  }, [focusKey])


  return (
    <div className="relative h-full w-full overscroll-none">
      <div ref={containerRef} className="h-full w-full" />

      <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-start justify-end">
        {controlsOpen ? (
          <div className="pointer-events-auto w-[min(420px,calc(100vw-24px))] rounded-xl border border-zinc-200 bg-white/90 p-3 shadow-xl backdrop-blur">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-semibold text-zinc-900">Mapa</div>
              <div className="flex items-center gap-2">
                <div className="hidden text-[11px] text-zinc-600 sm:block">Zoom: Ctrl/⌘ + scroll · Pan: arrastrar</div>
                <button
                  onClick={() => setControlsOpen(false)}
                  className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[11px] text-zinc-800 shadow-sm hover:bg-zinc-100"
                  type="button"
                  title="Ocultar controles"
                >
                  Ocultar
                </button>
              </div>
            </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <label className="text-xs text-zinc-700">Base</label>
            <select
              value={basemap}
              onChange={(e) => setBasemap(e.target.value as Basemap)}
              className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-900 outline-none shadow-sm"
            >
              <option value="openfreemap_liberty">Vector (OpenFreeMap · Liberty)</option>
              <option value="openfreemap_positron">Vector (OpenFreeMap · Positron)</option>
              <option value="raster_osm">Raster (OSM, fallback)</option>
            </select>

            <button
              onClick={() => {
                layersReadyRef.current = false
                setLayersOk(false)
                ensureLayers()
                if (!didInitialFitRef.current && validItemsRef.current.length > 0) {
                  didInitialFitRef.current = true
                  fitBest()
                }
              }}
              className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-900 shadow-sm hover:bg-zinc-100"
              type="button"
            >
              Reintentar puntos
            </button>

            <div className="ml-auto flex items-center gap-2 text-[11px] text-zinc-700">
              <span className="rounded bg-zinc-100 px-2 py-1">
                Coordenadas: <b className="text-zinc-900">{validItems.length}</b>
              </span>
              <span className="rounded bg-zinc-100 px-2 py-1">
                Capa: <b className={layersOk ? 'text-emerald-700' : 'text-amber-700'}>{layersOk ? 'OK' : '…'}</b>
              </span>
            </div>

            <button
              onClick={() => fitTo('thai')}
              className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-900 shadow-sm hover:bg-zinc-100"
              type="button"
            >
              Centrar Tailandia
            </button>
            <button
              onClick={() => fitTo('all')}
              className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-900 shadow-sm hover:bg-zinc-100"
              type="button"
            >
              Centrar todo
            </button>

            <button
              onClick={centerOnUser}
              disabled={locating}
              className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-900 shadow-sm hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              title="Centrar en tu ubicación (pide permiso)"
            >
              {locating ? 'Ubicando…' : '📍 Mi ubicación'}
            </button>
          </div>

            {status ? <div className="mt-2 text-xs text-zinc-600">{status}</div> : null}
          </div>
        ) : (
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={centerOnUser}
              disabled={locating}
              className="rounded-xl border border-zinc-200 bg-white/90 px-3 py-2 text-xs text-zinc-900 shadow-xl backdrop-blur hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              title="Centrar en tu ubicación"
            >
              {locating ? '…' : '📍'}
            </button>
            <button
              onClick={() => setControlsOpen(true)}
              className="rounded-xl border border-zinc-200 bg-white/90 px-3 py-2 text-xs text-zinc-900 shadow-xl backdrop-blur hover:bg-white"
              type="button"
              title="Mostrar controles del mapa"
            >
              Controles
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
