/* nv-tailandia Service Worker (v13e)
   Objetivo: offline real para /datos/** + /data/activities.json + imágenes.
   Nota: NO devolver nunca null/undefined en respondWith (Chrome muestra "Response is null").
*/
const VERSION = 'v13i1';
const CORE_CACHE = `nv-core-${VERSION}`;
const PAGE_CACHE = `nv-pages-${VERSION}`;
const ASSET_CACHE = `nv-assets-${VERSION}`;
const IMAGE_CACHE = `nv-images-${VERSION}`;

const CORE_ASSETS = [
  '/offline.html',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/og.png',
  '/tiles/blank.png',
  '/thumbs/actividad.svg',
  '/thumbs/vuelo.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-192-maskable.png',
  '/icons/icon-512-maskable.png',
  '/data/activities.json',
];

// /datos routes base (se completa con /pwa/datos-routes si está disponible)
const DATOS_ROUTES_FALLBACK = [
  '/datos',
  '/datos/vuelo',
  '/datos/wats',
  '/datos/budismo',
  '/datos/cultura',
  '/datos/consejos',
  '/datos/7-eleven',
];

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

function isDatosPath(pathname) {
  return pathname === '/datos' || pathname.startsWith('/datos/');
}

function looksLikeMapTileHost(hostname) {
  return (
    hostname.includes('tile.openstreetmap.org') ||
    hostname.includes('tiles.openfreemap.org') ||
    hostname.includes('openfreemap.org') ||
    hostname.includes('maptiler.com') ||
    hostname.includes('cartocdn.com')
  );
}

async function getFallbackResponse(fallbackUrl, contentType = 'text/plain', body = 'Offline') {
  try {
    const cached = await caches.match(fallbackUrl);
    if (cached) return cached;
  } catch {}
  return new Response(body, { status: 503, headers: { 'Content-Type': contentType } });
}

async function imageFallback(urlObj) {
  // Tiles: devolver tile en blanco (no “rompe” MapLibre). Actividades: placeholder svg.
  const fallback = looksLikeMapTileHost(urlObj.hostname) ? '/tiles/blank.png' : '/thumbs/actividad.svg';
  return getFallbackResponse(fallback, looksLikeMapTileHost(urlObj.hostname) ? 'image/png' : 'image/svg+xml', '');
}

async function cachePut(cacheName, req, res) {
  try {
    const cache = await caches.open(cacheName);
    await cache.put(req, res);
  } catch {
    // ignore
  }
}

async function cacheFirst(req, cacheName, fallbackFn) {
  try {
    const cached = await caches.match(req);
    if (cached) return cached;

    const res = await fetch(req);
    // Opaque responses (no-cors) also cache ok.
    if (res) cachePut(cacheName, req, res.clone());
    return res || (await fallbackFn());
  } catch {
    const cached = await caches.match(req);
    if (cached) return cached;
    return await fallbackFn();
  }
}

async function networkFirst(req, cacheName, fallbackFn) {
  try {
    const res = await fetch(req);
    if (res) cachePut(cacheName, req, res.clone());
    return res || (await fallbackFn());
  } catch {
    const cached = await caches.match(req);
    if (cached) return cached;
    return await fallbackFn();
  }
}

// --- Precaching de /datos (HTML + assets) ---
function getStaticAssetsFromHtml(htmlText) {
  const out = new Set();

  // naive: href/src="/..."
  const re = /\b(?:href|src)=["'](\/[^"']+)["']/g;
  let m;
  while ((m = re.exec(htmlText))) {
    const u = m[1];
    if (!u) continue;
    // Evitar pre-cachear endpoints dinámicos
    if (u.startsWith('/api/')) continue;
    out.add(u);
  }
  return Array.from(out);
}

async function precacheOneRoute(routePath) {
  // Normalizar: sin trailing slash excepto "/"
  const path = routePath === '/' ? '/' : String(routePath).replace(/\/+$/, '');
  const req = new Request(path, { cache: 'reload' });

  try {
    const res = await fetch(req);
    if (!res) return;
    // Cachear el HTML aunque sea opaque/ok.
    await cachePut(PAGE_CACHE, req, res.clone());

    // Extraer assets del HTML y cachearlos
    const ct = (res.headers && res.headers.get && res.headers.get('content-type')) || '';
    if (!ct.includes('text/html')) return;

    const html = await res.clone().text();
    const assets = getStaticAssetsFromHtml(html);

    const assetCache = await caches.open(ASSET_CACHE);
    for (const a of assets) {
      try {
        // Evitar cachear rutas /datos como assets aquí; se manejan como páginas.
        if (isDatosPath(a)) continue;
        await assetCache.add(new Request(a, { cache: 'reload' }));
      } catch {
        // ignore
      }
    }
  } catch {
    // ignore
  }
}

async function getDatosRoutesFromServer() {
  try {
    const res = await fetch('/pwa/datos-routes', { cache: 'no-store' });
    if (!res || !res.ok) return [];
    const json = await res.json();
    const routes = Array.isArray(json && json.routes) ? json.routes : [];
    return routes.filter((x) => typeof x === 'string' && x.startsWith('/datos'));
  } catch {
    return [];
  }
}

async function precacheDatos() {
  const fromApi = await getDatosRoutesFromServer();
  const all = Array.from(new Set([...DATOS_ROUTES_FALLBACK, ...fromApi]));
  for (const r of all) {
    // Secuencial para no saturar móviles
    await precacheOneRoute(r);
  }
}

// --- Lifecycle ---
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const core = await caches.open(CORE_CACHE);
      await core.addAll(CORE_ASSETS);
      // Precache /datos para que "modo avión" funcione sin tocar botones
      await precacheDatos();
      // Precache home (PWA launch from home screen)
      await precacheOneRoute('/');
      self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      const keep = new Set([CORE_CACHE, PAGE_CACHE, ASSET_CACHE, IMAGE_CACHE]);
      await Promise.all(
        keys.map((k) => {
          if (k.startsWith('nv-') && !keep.has(k)) return caches.delete(k);
          return Promise.resolve(false);
        })
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('message', (event) => {
  const msg = event && event.data;
  if (!msg || typeof msg !== 'object') return;

  if (msg.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }

  if (msg.type === 'PRECACHE_DATOS') {
    event.waitUntil(precacheDatos());
    return;
  }
});

// --- Fetch routing ---
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (!req || req.method !== 'GET') return;

  const url = new URL(req.url);

  // Images (incluye tiles remotos): cache-first + fallback.
  if (req.destination === 'image') {
    event.respondWith(cacheFirst(req, IMAGE_CACHE, () => imageFallback(url)));
    return;
  }


  // Tiles / map hosts (MapLibre puede pedir tiles como fetch sin destination=image): cache-first + fallback.
  if (looksLikeMapTileHost(url.hostname)) {
    event.respondWith(cacheFirst(req, IMAGE_CACHE, () => imageFallback(url)));
    return;
  }
  // Navigations
  if (req.mode === 'navigate') {
    // Home: offline-first (PWA start_url)
    if (url.pathname === '/') {
      event.respondWith(
        cacheFirst(req, PAGE_CACHE, async () => getFallbackResponse('/offline.html', 'text/html', 'Offline'))
      );
      return;
    }
    if (isDatosPath(url.pathname)) {
      // Offline-first para /datos/**
      event.respondWith(
        cacheFirst(req, PAGE_CACHE, async () => getFallbackResponse('/offline.html', 'text/html', 'Offline'))
      );
      return;
    }
    // Resto: network-first con offline.html
    event.respondWith(networkFirst(req, PAGE_CACHE, async () => getFallbackResponse('/offline.html', 'text/html', 'Offline')));
    return;
  }

  // Same-origin assets
  if (isSameOrigin(url)) {
    // Datos JSON (map/list)
    if (url.pathname === '/data/activities.json') {
      event.respondWith(
        cacheFirst(req, ASSET_CACHE, async () => getFallbackResponse('/data/activities.json', 'application/json', '[]'))
      );
      return;
    }

    // /datos flight payloads + assets (cache-first)
    if (isDatosPath(url.pathname)) {
      event.respondWith(cacheFirst(req, ASSET_CACHE, async () => getFallbackResponse('/offline.html', 'text/html', 'Offline')));
      return;
    }

    // Next static assets
    if (url.pathname.startsWith('/_next/') || url.pathname.startsWith('/thumbs/') || url.pathname.startsWith('/icons/') || url.pathname.startsWith('/tiles/')) {
      event.respondWith(cacheFirst(req, ASSET_CACHE, async () => new Response('', { status: 504 })));
      return;
    }
  }

  // Default: passthrough (no intercept)
});
