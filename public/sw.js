/* nv-tailandia SW (PWA offline)
   Goal: /datos should be readable 100% offline after ONE online visit.
   Notes:
   - Cache strategies are conservative for storage.
   - Cross-origin images (activity photos, map tiles) are cached opportunistically once fetched online.
*/

const VERSION = 'v13d2'
const STATIC_CACHE = `nv-static-${VERSION}`
const PAGE_CACHE = `nv-pages-${VERSION}`
const ASSET_CACHE = `nv-assets-${VERSION}`
const IMAGE_CACHE = `nv-images-${VERSION}`

const CORE_ASSETS = [
  '/offline.html',
  '/manifest.webmanifest',
  '/apple-touch-icon.png',
  '/icons/icon-192.png',
  '/icons/icon-192-maskable.png',
  '/icons/icon-512.png',
  '/icons/icon-512-maskable.png',
  '/data/activities.json'
]

async function precacheCore() {
  const cache = await caches.open(STATIC_CACHE)
  await cache.addAll(CORE_ASSETS)
}

async function precacheDatosPages() {
  const pageCache = await caches.open(PAGE_CACHE)
  const assetCache = await caches.open(ASSET_CACHE)

  // Minimal known routes + expanded list from /pwa/datos-routes
  const routes = new Set(['/datos', '/datos/vuelo', '/datos/wats'])

  try {
    const res = await fetch('/pwa/datos-routes', { cache: 'no-store' })
    if (res.ok) {
      const json = await res.json()
      const extra = Array.isArray(json?.routes) ? json.routes : []
      for (const r of extra) {
        if (typeof r === 'string' && r.startsWith('/datos')) routes.add(r)
      }
    }
  } catch {
    // ignore
  }

  // Parse asset links out of HTML to pre-cache the JS/CSS needed offline.
  const assets = new Set()
  const assetRe = /\/(?:_next\/static\/[^"'\s>]+|_next\/image\?[^"'\s>]+|data\/[^"'\s>]+|icons\/[^"'\s>]+|thumbs\/[^"'\s>]+|apple-touch-icon\.png)/g

  const precacheOne = async (path) => {
    try {
      const req = new Request(path, { cache: 'reload' })
      const res = await fetch(req)
      if (!res || !res.ok) return
      await pageCache.put(req, res.clone())
      const html = await res.clone().text()
      const matches = html.match(assetRe) || []
      for (const a of matches) assets.add(a)
    } catch {
      // ignore
    }
  }

  // Cache HTML for each /datos route
  for (const r of routes) {
    await precacheOne(r)
  }

  // Cache referenced assets (JS/CSS/images)
  for (const a of Array.from(assets)) {
    try {
      await assetCache.add(new Request(a, { cache: 'reload' }))
    } catch {
      // ignore
    }
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      await precacheCore()
      // Precache /datos immediately – no UI button needed.
      await precacheDatosPages()
      self.skipWaiting()
    })()
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys.map((k) => {
          if (k.startsWith('nv-') && !k.endsWith(VERSION)) return caches.delete(k)
          return Promise.resolve(false)
        })
      )
      await self.clients.claim()
    })()
  )
})

self.addEventListener('message', (event) => {
  const data = event.data || {}
  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting()
    return
  }
  if (data.type === 'PRECACHE_DATOS') {
    event.waitUntil(precacheDatosPages())
  }
})

async function cacheFirstSafe(req, cacheName, fallbackUrl = '/offline.html') {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(req)
  if (cached) return cached
  try {
    const res = await fetch(req)
    // Cache OK responses + opaque (cross-origin images).
    if (res && (res.ok || res.type === 'opaque')) {
      cache.put(req, res.clone()).catch(() => {})
    }
    return res
  } catch {
    return cache.match(fallbackUrl) || caches.match(fallbackUrl)
  }
}

async function networkFirst(req, cacheName, fallbackUrl = '/offline.html') {
  const cache = await caches.open(cacheName)
  try {
    const res = await fetch(req)
    if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone()).catch(() => {})
    return res
  } catch {
    const cached = await cache.match(req)
    if (cached) return cached
    return cache.match(fallbackUrl) || caches.match(fallbackUrl)
  }
}

// Normalize Next App Router RSC requests so cache hits survive the random _rsc query param.
function normalizeRscUrl(url) {
  try {
    const u = new URL(url)
    if (!u.searchParams.has('_rsc')) return null
    u.searchParams.set('_rsc', '1')
    return u.toString()
  } catch {
    return null
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  const url = new URL(req.url)
  const path = url.pathname

  // 1) Images (ANY origin): cache-first.
  // This covers activity photos and map tiles opportunistically.
  if (req.destination === 'image') {
    event.respondWith(cacheFirstSafe(req, IMAGE_CACHE, '/thumbs/actividad.svg'))
    return
  }

  // 2) Navigations.
  if (req.mode === 'navigate') {
    if (path.startsWith('/datos')) {
      event.respondWith(cacheFirstSafe(req, PAGE_CACHE))
      return
    }
    event.respondWith(networkFirst(req, PAGE_CACHE))
    return
  }

  // 3) Next assets (JS/CSS/fonts/media) – cache-first.
  if (path.startsWith('/_next/')) {
    event.respondWith(cacheFirstSafe(req, ASSET_CACHE))
    return
  }

  // 4) /datos RSC fetches (App Router) – cache-first with normalized key.
  if (path.startsWith('/datos')) {
    const normalized = normalizeRscUrl(req.url)
    if (normalized) {
      const cacheReq = new Request(normalized, {
        headers: req.headers,
        method: 'GET',
        mode: req.mode,
        credentials: req.credentials,
        redirect: req.redirect,
        referrer: req.referrer,
        referrerPolicy: req.referrerPolicy,
        integrity: req.integrity
      })
      event.respondWith(cacheFirstSafe(cacheReq, PAGE_CACHE))
      return
    }
    event.respondWith(cacheFirstSafe(req, PAGE_CACHE))
    return
  }

  // 5) Public assets (same origin)
  if (path.startsWith('/icons/') || path.startsWith('/thumbs/') || path.startsWith('/data/')) {
    event.respondWith(cacheFirstSafe(req, STATIC_CACHE))
    return
  }

  // Default
  event.respondWith(networkFirst(req, ASSET_CACHE))
})
