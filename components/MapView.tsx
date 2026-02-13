'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import maplibregl, { type Map as MapLibreMap } from 'maplibre-gl'
import type { Activity } from '@/app/page'

type Props = {
  items: Activity[]
  onVisibleIdsChange: (ids: Set<string>) => void
  onSelect: (a: Activity) => void
  selectedId: string | null
}

type Basemap = 'vector_demo' | 'vector_openfreemap' | 'raster_osm'

// Vector sin API key (muy estable para demos / prototipos)
const VECTOR_DEMO_STYLE_URL = 'https://demotiles.maplibre.org/style.json'

// Vector sin API key (OpenFreeMap)
const VECTOR_OPENFREEMAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'

// Raster fallback (OSM). Nota: en pantallas retina puede verse menos nítido que vector.
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

function basemapToStyle(b: Basemap) {
  if (b === 'vector_openfreemap') return VECTOR_OPENFREEMAP_STYLE_URL
  if (b === 'raster_osm') return RASTER_OSM_STYLE
  return VECTOR_DEMO_STYLE_URL
}

export function MapView({ items, onVisibleIdsChange, onSelect, selectedId }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const popupRef = useRef<maplibregl.Popup | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const didInitialFitRef = useRef(false)

  // Refs para evitar closures “viejas” en handlers registrados una sola vez.
  const validItemsRef = useRef<Activity[]>([])
  const itemsByIdRef = useRef<Map<string, Activity>>(new Map())
  const geojsonRef = useRef<any>(null)
  const onVisibleIdsChangeRef = useRef(onVisibleIdsChange)
  const onSelectRef = useRef(onSelect)
  const selectedIdRef = useRef<string | null>(selectedId)

  const [basemap, setBasemap] = useState<Basemap>('vector_demo')
  const [ready, setReady] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

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

    // Padding mínimo si cae en el mismo punto.
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

  const fitTo = useCallback((mode: 'thai' | 'all') => {
    const map = mapRef.current
    if (!map) return
    const b = computeBounds(mode)
    if (!b) return

    map.fitBounds(b, {
      padding: 60,
      duration: 0,
      maxZoom: mode === 'thai' ? 13 : 5
    })
  }, [computeBounds])

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

  // ---------- Map interaction handlers ----------
  const onEnterCursor = useCallback(() => {
    const map = mapRef.current
    if (map) map.getCanvas().style.cursor = 'pointer'
  }, [])

  const onLeaveCursor = useCallback(() => {
    const map = mapRef.current
    if (map) map.getCanvas().style.cursor = ''
  }, [])

  const onLeave = useCallback(() => {
    popupRef.current?.remove()
  }, [])

  const onHover = useCallback((e: any) => {
    const map = mapRef.current
    if (!map) return
    const f = e?.features?.[0]
    if (!f?.properties) return

    const Nombre = escapeHtml(String(f.properties.Nombre ?? ''))
    const Ciudad = escapeHtml(String(f.properties.Ciudad ?? ''))
    const shortDescription = escapeHtml(String(f.properties.shortDescription ?? ''))
    const imageUrl = String(f.properties.imageUrl ?? '')
    const approx = String(f.properties.approxLocation ?? '')

    const html = `
      <div style="display:flex;gap:10px;align-items:flex-start;max-width:280px">
        <img src="${escapeHtml(imageUrl)}" alt="" width="44" height="44" style="border-radius:10px;object-fit:cover;background:#0b1220" />
        <div style="min-width:0">
          <div style="font-weight:700;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${Nombre}</div>
          <div style="font-size:12px;opacity:0.8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${Ciudad}${approx ? ' · aprox.' : ''}</div>
          <div style="margin-top:4px;font-size:12px;opacity:0.9">${shortDescription}</div>
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
      map.easeTo({ center: f.geometry.coordinates, zoom, duration: 250 })
    })
  }, [])

  const ensureLayers = useCallback(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return

    const data = geojsonRef.current ?? { type: 'FeatureCollection', features: [] }

    // Fuente (crear o actualizar)
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

    const hasLayer = (id: string) => Boolean(map.getLayer(id))

    if (!hasLayer('clusters')) {
      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'activities',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#10b981',
          'circle-radius': ['step', ['get', 'point_count'], 16, 20, 20, 50, 26],
          'circle-opacity': 0.8,
          'circle-stroke-color': '#052e1e',
          'circle-stroke-width': 2
        }
      })
    }

    if (!hasLayer('cluster-count')) {
      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'activities',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 12
        },
        paint: {
          'text-color': '#0b1220'
        }
      })
    }

    if (!hasLayer('unclustered-point')) {
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
    }

    if (!hasLayer('selected-point')) {
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
    }

    // Selected highlight
    if (map.getLayer('selected-point')) {
      map.setFilter('selected-point', ['==', ['get', 'id'], selectedIdRef.current ?? '__none__'])
    }

    // Handlers idempotentes (si se cambia el style, hay que re-registrar)
    map.off('mousemove', 'unclustered-point', onHover)
    map.off('mouseleave', 'unclustered-point', onLeave)
    map.off('click', 'unclustered-point', onClickPoint)
    map.off('click', 'clusters', onClickCluster)
    map.off('mouseenter', 'clusters', onEnterCursor)
    map.off('mouseleave', 'clusters', onLeaveCursor)
    map.off('mouseenter', 'unclustered-point', onEnterCursor)
    map.off('mouseleave', 'unclustered-point', onLeaveCursor)

    map.on('mousemove', 'unclustered-point', onHover)
    map.on('mouseleave', 'unclustered-point', onLeave)
    map.on('click', 'unclustered-point', onClickPoint)
    map.on('click', 'clusters', onClickCluster)
    map.on('mouseenter', 'clusters', onEnterCursor)
    map.on('mouseleave', 'clusters', onLeaveCursor)
    map.on('mouseenter', 'unclustered-point', onEnterCursor)
    map.on('mouseleave', 'unclustered-point', onLeaveCursor)
  }, [onClickCluster, onClickPoint, onEnterCursor, onHover, onLeave, onLeaveCursor])

  // ---------- Init map (una sola vez) ----------
  useEffect(() => {
    if (!containerRef.current) return
    if (mapRef.current) return

    setStatus('Inicializando mapa…')

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: basemapToStyle('vector_demo'),
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

    const onLoad = () => {
      setReady(true)
      setStatus(null)
      ensureLayers()

      // Si ya hay datos, hacemos fit ahora mismo.
      if (!didInitialFitRef.current && validItemsRef.current.length > 0) {
        didInitialFitRef.current = true
        fitBest()
      }

      updateVisibleIds()
    }

    const onError = (ev: any) => {
      const msg = ev?.error?.message || ev?.error?.toString?.() || 'Error de mapa'
      setStatus(`Mapa: ${msg}`)
    }

    map.on('load', onLoad)
    map.on('moveend', updateVisibleIds)
    map.on('zoomend', updateVisibleIds)
    map.on('style.load', () => {
      ensureLayers()
      updateVisibleIds()
    })
    map.on('error', onError)

    // ResizeObserver para evitar tiles borrosos/offset en resize.
    resizeObserverRef.current = new ResizeObserver(() => map.resize())
    resizeObserverRef.current.observe(containerRef.current)

    return () => {
      resizeObserverRef.current?.disconnect()
      resizeObserverRef.current = null
      popupRef.current?.remove()
      popupRef.current = null
      map.remove()
      mapRef.current = null
    }
  }, [ensureLayers, fitBest, updateVisibleIds])

  // Basemap switch
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    setStatus('Cambiando basemap…')
    try {
      map.setStyle(basemapToStyle(basemap))
      window.setTimeout(() => setStatus(null), 500)
    } catch (e: any) {
      setStatus(e?.message ?? 'No se pudo cambiar el basemap')
    }
  }, [basemap])

  // Sync data to map
  useEffect(() => {
    if (!ready) return
    ensureLayers()

    // Fit inicial cuando los datos llegan DESPUÉS de que el mapa ya cargó.
    if (!didInitialFitRef.current && validItemsRef.current.length > 0) {
      didInitialFitRef.current = true
      fitBest()
    }

    updateVisibleIds()
  }, [ready, items, ensureLayers, fitBest, updateVisibleIds])

  // Selected highlight (sin re-crear listeners)
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (!map.getLayer('selected-point')) return
    map.setFilter('selected-point', ['==', ['get', 'id'], selectedId ?? '__none__'])
  }, [selectedId])

  return (
    <div className="relative h-full w-full overscroll-none">
      <div ref={containerRef} className="h-full w-full" />

      <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-start justify-end">
        <div className="pointer-events-auto w-[min(380px,calc(100vw-24px))] rounded-xl border border-zinc-800 bg-zinc-950/90 p-3 shadow-xl backdrop-blur">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-semibold text-zinc-100">Mapa</div>
            <div className="text-[11px] text-zinc-400">Zoom: Ctrl/⌘ + scroll · Pan: arrastrar</div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <label className="text-xs text-zinc-300">Base</label>
            <select
              value={basemap}
              onChange={(e) => setBasemap(e.target.value as Basemap)}
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-100 outline-none"
            >
              <option value="vector_demo">Vector (MapLibre demo)</option>
              <option value="vector_openfreemap">Vector (OpenFreeMap)</option>
              <option value="raster_osm">Raster (OSM, fallback)</option>
            </select>

            <button
              onClick={() => fitTo('thai')}
              className="ml-auto rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-100 hover:bg-zinc-800"
              type="button"
            >
              Centrar Tailandia
            </button>
            <button
              onClick={() => fitTo('all')}
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-100 hover:bg-zinc-800"
              type="button"
            >
              Centrar todo
            </button>
          </div>

          {status ? <div className="mt-2 text-xs text-zinc-400">{status}</div> : null}
        </div>
      </div>
    </div>
  )
}
