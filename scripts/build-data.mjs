import fs from 'node:fs'
import path from 'node:path'
import Papa from 'papaparse'

const projectRoot = path.resolve(process.cwd())
const csvPath = path.join(projectRoot, 'data', 'activities.csv')
const outDir = path.join(projectRoot, 'public', 'data')
const outPath = path.join(outDir, 'activities.json')

// Coordenadas faltantes en tu CSV (puntos reales)
const COORD_OVERRIDES_BY_NAME = {
  // Asiatique The Riverfront: EXIF coords 13°42'17.91"N, 100°30'6.93"E
  'Asiatique The Riverfront': { lat: 13.704975, lon: 100.501925 },
  // Jim Thompson House: Mapcarta
  'Jim Thompson House Museum': { lat: 13.74923, lon: 100.52828 },
  // Rajadamnern Stadium: coords públicas (aprox)
  'Rajadamnern Muay Thai Stadium (Fight Night)': { lat: 13.756664, lon: 100.505331 },
  // Wat Chedi Luang: coords públicas (aprox)
  'Wat Chedi Luang': { lat: 18.787007, lon: 98.986489 }
}

// Centroides (fallback) por ciudad (si se detecta un item sin LATLON)
const CITY_CENTROIDS = {
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

function slugify(str) {
  return String(str ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function parseLatLon(latlon) {
  if (!latlon) return null
  const s = String(latlon).trim()
  if (!s || s === '-') return null
  const m = s.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/)
  if (!m) return null
  return { lat: Number(m[1]), lon: Number(m[2]) }
}

function normalizeTypeToThumb(tipo) {
  const t = String(tipo ?? '').trim()
  const slug = slugify(t || 'actividad') || 'actividad'
  const candidate = `/thumbs/${slug}.svg`
  // Si no existe icono para el tipo, usamos 'actividad'
  const abs = path.join(projectRoot, 'public', candidate)
  if (!fs.existsSync(abs)) return '/thumbs/actividad.svg'
  return candidate
}

function shortText(text, max = 120) {
  const s = String(text ?? '').replace(/\s+/g, ' ').trim()
  if (s.length <= max) return s
  return s.slice(0, max - 1).trimEnd() + '…'
}

function looksLikeUrl(v) {
  const s = String(v ?? '').trim()
  return /^https?:\/\//i.test(s)
}

function main() {
  if (!fs.existsSync(csvPath)) {
    console.error('No se encontró CSV:', csvPath)
    process.exit(1)
  }

  const csvRaw = fs.readFileSync(csvPath, 'utf8')

  const parsed = Papa.parse(csvRaw, {
    header: true,
    skipEmptyLines: true
  })

  if (parsed.errors?.length) {
    console.error('Errores parseando CSV:')
    for (const e of parsed.errors) console.error(' -', e)
    process.exit(1)
  }

  const rows = parsed.data

  const activities = rows
    .filter((r) => r && Object.values(r).some((v) => String(v ?? '').trim() !== ''))
    .map((r, idx) => {
      const Nombre = String(r['Nombre'] ?? '').trim()
      const Ciudad = String(r['Ciudad'] ?? '').trim()
      const Tipo = String(r['Tipo'] ?? '').trim()

      // Coordenadas
      let approxLocation = false
      let coords = parseLatLon(r['LATLON'])
      if (!coords && COORD_OVERRIDES_BY_NAME[Nombre]) {
        coords = COORD_OVERRIDES_BY_NAME[Nombre]
      }
      if (!coords) {
        // fallback por ciudad
        const cityKey = Object.keys(CITY_CENTROIDS).find((k) => k.toLowerCase() === Ciudad.toLowerCase())
        if (cityKey) {
          coords = CITY_CENTROIDS[cityKey]
          approxLocation = true
        } else {
          // fallback global (Bangkok) para no romper el mapa; marcado como aproximado
          coords = CITY_CENTROIDS.Bangkok
          approxLocation = true
        }
      }

      const id = `${slugify(Ciudad || 'na')}-${slugify(Nombre || `item-${idx + 1}`)}`

      const imageRaw = r['Image']
      const imageUrl = looksLikeUrl(imageRaw) ? String(imageRaw).trim() : normalizeTypeToThumb(Tipo)

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

  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(outPath, JSON.stringify(activities, null, 2), 'utf8')
  console.log(`OK: ${activities.length} actividades -> ${path.relative(projectRoot, outPath)}`)
}

main()
