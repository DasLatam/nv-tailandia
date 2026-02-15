/* nv-tailandia SW (PWA offline for /datos)
   Version bump: update VERSION to force refresh.
*/

const VERSION = 'v13'
const STATIC_CACHE = `nv-static-${VERSION}`
const PAGE_CACHE = `nv-pages-${VERSION}`
const ASSET_CACHE = `nv-assets-${VERSION}`

const CORE_ASSETS = ['/offline.html', '/manifest.webmanifest', '/data/activities.json']

async function precacheCore() {
  const cache = await caches.open(STATIC_CACHE)
  await cache.addAll(CORE_ASSETS)
}

async function precacheDatosPages() {
  const pageCache = await caches.open(PAGE_CACHE)
  const assetCache = await caches.open(ASSET_CACHE)

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

  const assets = new Set()
  const assetRe = /\/(?:_next\/static\/[^"'\s>]+|data\/[^"'\s>]+|icons\/[^"'\s>]+)/g

  const precacheOne = async (path) => {
    try {
      const req = new Request(path, { cache: 'reload' })
      const res = await fetch(req)
      if (!res || !res.ok) return
      await pageCache.put(path, res.clone())
      const html = await res.clone().text()
      const matches = html.match(assetRe) || []
      for (const a of matches) assets.add(a)
    } catch {
      // ignore
    }
  }

  for (const r of routes) {
    await precacheOne(r)
  }

  const toCache = Array.from(assets)
  for (const a of toCache) {
    try {
      await assetCache.add(new Request(a, { cache: 'reload' }))
    } catch {
      // ignore
    }
  }
}

self.addEventListener('install' , (event) => {
  event.waitUntil(
    (async () => {
      await precacheCore()
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

function sameOrigin(url) {
  try {
    return new URL(url).origin === self.location.origin
  } catch {
    return false
  }
}

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(req)
  if (cached) return cached
  const res = await fetch(req)
  if (res && res.ok) cache.put(req, res.clone())
  return res
}

async function networkFirst(req, cacheName) {
  const cache = await caches.open(cacheName)
  try {
    const res = await fetch(req)
    if (res && res.ok) cache.put(req, res.clone())
    return res
  } catch {
    const cached = await cache.match(req)
    if (cached) return cached
    return caches.match('/offline.html')
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  if (!sameOrigin(req.url)) return

  const url = new URL(req.url)
  const path = url.pathname

  // Navigation: make /datos work offline.
  if (req.mode === 'navigate') {
    if (path.startsWith('/datos')) {
      event.respondWith(cacheFirst(req, PAGE_CACHE))
      return
    }
    // For the rest of the app, prefer network but fall back.
    event.respondWith(networkFirst(req, PAGE_CACHE))
    return
  }

  // Next static assets (JS/CSS) – cache-first.
  if (path.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(req, ASSET_CACHE))
    return
  }

  // Public assets (images, etc.) – cache-first.
  if (path.startsWith('/icons/') || path.startsWith('/thumbs/') || path.startsWith('/data/')) {
    event.respondWith(cacheFirst(req, STATIC_CACHE))
    return
  }

  // Default: stale-ish caching.
  event.respondWith(networkFirst(req, ASSET_CACHE))
})
