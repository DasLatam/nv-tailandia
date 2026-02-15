import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Papa from 'papaparse'
import http from 'node:http'
import https from 'node:https'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectRoot = path.resolve(__dirname, '..')
const csvPath = process.argv[2] ? path.resolve(process.argv[2]) : path.join(projectRoot, 'data', 'activities.csv')
const outDir = process.argv[3] ? path.resolve(process.argv[3]) : path.join(projectRoot, 'public', 'img', 'activities')

function slugify(str) {
  return String(str ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function computeId(ciudad, nombre, idx) {
  return `${slugify(ciudad || 'na')}-${slugify(nombre || `item-${idx + 1}`)}`
}

function guessExtFromUrl(url) {
  const clean = String(url).split('?')[0].split('#')[0]
  const m = clean.match(/\.([a-zA-Z0-9]{2,5})$/)
  const ext = (m?.[1] || '').toLowerCase()
  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) return ext
  return 'jpg'
}

function requestBuffer(url, redirectsLeft = 5) {
  return new Promise((resolve, reject) => {
    const u = new URL(url)
    const lib = u.protocol === 'https:' ? https : http

    const req = lib.request(
      {
        method: 'GET',
        hostname: u.hostname,
        port: u.port || (u.protocol === 'https:' ? 443 : 80),
        path: u.pathname + (u.search || ''),
        headers: {
          'User-Agent': 'nv-tailandia/1.0',
          Accept: 'image/avif,image/webp,image/*,*/*;q=0.8',
        },
        timeout: 30000,
      },
      (res) => {
        const status = res.statusCode || 0
        const loc = res.headers.location

        if ([301, 302, 303, 307, 308].includes(status) && loc && redirectsLeft > 0) {
          res.resume()
          const next = new URL(loc, u).toString()
          requestBuffer(next, redirectsLeft - 1).then(resolve).catch(reject)
          return
        }

        if (status < 200 || status >= 300) {
          res.resume()
          reject(new Error(`HTTP ${status}`))
          return
        }

        const ct = String(res.headers['content-type'] || '').toLowerCase()
        if (!ct.startsWith('image/')) {
          // A veces devuelven HTML/JSON
          const chunks = []
          res.on('data', (d) => chunks.push(d))
          res.on('end', () => {
            reject(new Error(`Non-image content-type: ${ct || 'unknown'}`))
          })
          return
        }

        const chunks = []
        res.on('data', (d) => chunks.push(d))
        res.on('end', () => resolve(Buffer.concat(chunks)))
      }
    )

    req.on('timeout', () => {
      req.destroy(new Error('Timeout'))
    })
    req.on('error', (e) => reject(e))
    req.end()
  })
}

function existsAnyExt(id) {
  const exts = ['webp', 'jpg', 'jpeg', 'png', 'gif']
  for (const ext of exts) {
    const p = path.join(outDir, `${id}.${ext}`)
    if (fs.existsSync(p)) return true
  }
  return false
}

async function main() {
  if (!fs.existsSync(csvPath)) {
    console.error('ERROR: CSV no encontrado:', csvPath)
    process.exit(1)
  }

  fs.mkdirSync(outDir, { recursive: true })

  const csvRaw = fs.readFileSync(csvPath, 'utf8')
  const parsed = Papa.parse(csvRaw, { header: true, skipEmptyLines: true })
  if (parsed.errors?.length) {
    console.error('ERROR parseando CSV:')
    for (const e of parsed.errors) console.error(' -', e)
    process.exit(1)
  }

  const rows = parsed.data
    .filter((r) => r && Object.values(r).some((v) => String(v ?? '').trim() !== ''))
    .map((r) => ({
      Nombre: String(r['Nombre'] ?? '').trim(),
      Ciudad: String(r['Ciudad'] ?? '').trim(),
      Image: String(r['Image'] ?? '').trim(),
    }))

  const targets = rows
    .map((r, idx) => ({ idx, id: computeId(r.Ciudad, r.Nombre, idx), url: r.Image }))
    .filter((x) => x.url && /^https?:\/\//i.test(x.url))

  const concurrency = Number(process.env.NV_DL_CONCURRENCY || 6)

  let ok = 0
  let skip = 0
  let fail = 0

  console.log(`==> Descargando ${targets.length} imágenes (concurrency=${concurrency})`)
  console.log(`==> CSV: ${path.relative(projectRoot, csvPath)}`)
  console.log(`==> OUT: ${path.relative(projectRoot, outDir)}`)

  const queue = targets.slice()
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length) {
      const t = queue.shift()
      if (!t) return

      if (existsAnyExt(t.id)) {
        skip++
        continue
      }

      const ext = guessExtFromUrl(t.url)
      const outPath = path.join(outDir, `${t.id}.${ext}`)

      try {
        const buf = await requestBuffer(t.url)
        fs.writeFileSync(outPath, buf)
        ok++
      } catch (e) {
        fail++
        // no spamear demasiado
        if (fail <= 25) console.warn('FAIL:', t.id, '-', String(e?.message || e))
      }
    }
  })

  await Promise.all(workers)

  console.log(`==> OK=${ok} SKIP=${skip} FAIL=${fail}`)
  if (fail > 0) {
    console.log('Nota: algunas URLs pueden bloquear descargas o no ser imágenes. Las que fallan quedarán con placeholder offline.')
  }
}

main().catch((e) => {
  console.error('FATAL:', e)
  process.exit(1)
})
