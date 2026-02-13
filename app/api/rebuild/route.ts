import { NextResponse } from 'next/server'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import Papa from 'papaparse'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const projectRoot = path.resolve(process.cwd())
const csvPath = path.join(projectRoot, 'data', 'activities.csv')
const outDir = path.join(projectRoot, 'public', 'data')
const outPath = path.join(outDir, 'activities.json')

// Coordenadas faltantes (mismo set que scripts/build-data.mjs)
const COORD_OVERRIDES_BY_NAME: Record<string, { lat: number; lon: number }> = {
  'Asiatique The Riverfront': { lat: 13.704975, lon: 100.501925 },
  'Jim Thompson House Museum': { lat: 13.74923, lon: 100.52828 },
  'Rajadamnern Muay Thai Stadium (Fight Night)': { lat: 13.756664, lon: 100.505331 },
  'Wat Chedi Luang': { lat: 18.787007, lon: 98.986489 }
}

const CITY_CENTROIDS: Record<string, { lat: number; lon: number }> = {
  Bangkok: { lat: 13.756331, lon: 100.501762 },
  'Chiang Mai': { lat: 18.788343, lon: 98.9853 },
  'Chiang Rai': { lat: 19.91048, lon: 99.840576 },
  Phuket: { lat: 7.880447, lon: 98.392281 },
  Krabi: { lat: 8.086299, lon: 98.906283 },
  Ayutthaya: { lat: 14.353212, lon: 100.568959 },
  Sukhothai: { lat: 17.006, lon: 99.823 },
  'Phuket Town': { lat: 7.884, lon: 98.389 },
  Railay: { lat: 8.011, lon: 98.837 },
  Estambul: { lat: 41.0082, lon: 28.9784 },
  'San Pablo': { lat: -23.55052, lon: -46.633308 },
  'Buenos Aires': { lat: -34.603722, lon: -58.381592 }
}

function slugify(str: any) {
  return String(str ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function parseLatLon(latlon: any): { lat: number; lon: number } | null {
  if (!latlon) return null
  const s = String(latlon).trim()
  if (!s || s === '-') return null
  const m = s.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/)
  if (!m) return null
  return { lat: Number(m[1]), lon: Number(m[2]) }
}

function normalizeTypeToThumb(tipo: any) {
  const t = String(tipo ?? '').trim()
  const slug = slugify(t || 'actividad') || 'actividad'
  const candidate = `/thumbs/${slug}.svg`
  const abs = path.join(projectRoot, 'public', candidate)
  if (!fs.existsSync(abs)) return '/thumbs/actividad.svg'
  return candidate
}

function shortText(text: any, max = 120) {
  const s = String(text ?? '').replace(/\s+/g, ' ').trim()
  if (s.length <= max) return s
  return s.slice(0, max - 1).trimEnd() + '…'
}

function looksLikeImageRef(v: any) {
  const s = String(v ?? '').trim()
  if (!s) return false
  if (s.toLowerCase() === 'link') return false
  if (/^https?:\/\//i.test(s)) return true
  if (s.startsWith('/')) return true
  return false
}

type Activity = {
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
  lat: number
  lon: number
  approxLocation?: boolean
  imageUrl: string
  shortDescription: string
}

async function buildActivities(): Promise<Activity[]> {
  const csvRaw = await fsp.readFile(csvPath, 'utf8')

  const parsed = Papa.parse(csvRaw, { header: true, skipEmptyLines: true })
  if ((parsed as any).errors?.length) {
    const errs = (parsed as any).errors?.map((e: any) => e?.message ?? String(e)) ?? []
    throw new Error(`Errores parseando CSV: ${errs.join(' | ')}`)
  }

  const rows: any[] = (parsed as any).data ?? []

  const activities: Activity[] = rows
    .filter((r) => r && Object.values(r).some((v) => String(v ?? '').trim() !== ''))
    .map((r, idx) => {
      const Nombre = String(r['Nombre'] ?? '').trim()
      const Ciudad = String(r['Ciudad'] ?? '').trim()
      const Tipo = String(r['Tipo'] ?? '').trim()

      let approxLocation = false
      let coords = parseLatLon(r['LATLON'])
      if (!coords && COORD_OVERRIDES_BY_NAME[Nombre]) {
        coords = COORD_OVERRIDES_BY_NAME[Nombre]
      }
      if (!coords) {
        const cityKey = Object.keys(CITY_CENTROIDS).find((k) => k.toLowerCase() === Ciudad.toLowerCase())
        if (cityKey) {
          coords = CITY_CENTROIDS[cityKey]
          approxLocation = true
        } else {
          coords = CITY_CENTROIDS.Bangkok
          approxLocation = true
        }
      }

      const id = `${slugify(Ciudad || 'na')}-${slugify(Nombre || `item-${idx + 1}`)}`

      const imageRaw = r['Image']
      const imageUrl = looksLikeImageRef(imageRaw) ? String(imageRaw).trim() : normalizeTypeToThumb(Tipo)

      return {
        id,
        Nombre,
        Tipo,
        Horario: String(r['Horario'] ?? '').trim(),
        Ciudad,
        Tiempo: String(r['Tiempo'] ?? '').trim(),
        Esfuerzo: String(r['Esfuerzo'] ?? '').trim(),
        Costo: String(r['Costo'] ?? '').trim(),
        Descripción: String(r['Descripción'] ?? '').trim(),
        Detalle: String(r['Detalle'] ?? '').trim(),
        NotaIA: String(r['NotaIA'] ?? '').trim(),
        LATLON: String(r['LATLON'] ?? '').trim(),
        Image: String(r['Image'] ?? '').trim(),
        lat: coords.lat,
        lon: coords.lon,
        approxLocation: approxLocation || undefined,
        imageUrl,
        shortDescription: shortText(r['Descripción'], 110)
      }
    })

  return activities
}

export async function POST() {
  try {
    if (!fs.existsSync(csvPath)) {
      return NextResponse.json(
        { ok: false, error: `No se encontró CSV en ${path.relative(projectRoot, csvPath)}` },
        { status: 404 }
      )
    }

    const activities = await buildActivities()

    // Intentar persistir el JSON (funciona local/dev; en Vercel puede ser read-only)
    let persisted = false
    try {
      await fsp.mkdir(outDir, { recursive: true })
      await fsp.writeFile(outPath, JSON.stringify(activities, null, 2), 'utf8')
      persisted = true
    } catch {
      persisted = false
    }

    return NextResponse.json(
      { ok: true, count: activities.length, persisted, activities },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'Error desconocido' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
