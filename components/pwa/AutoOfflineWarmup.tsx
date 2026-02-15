'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

type State = 'idle' | 'warming' | 'ready' | 'offline_ok' | 'offline_needs' | 'error'

const LS_SYNC = 'nv.offline_sync_ts'

function readLastSync(): number | null {
  try {
    const raw = localStorage.getItem(LS_SYNC)
    if (!raw) return null
    const n = Number(raw)
    return Number.isFinite(n) ? n : null
  } catch {
    return null
  }
}

function writeLastSync(ts: number) {
  try {
    localStorage.setItem(LS_SYNC, String(ts))
  } catch {
    // ignore
  }
}

function formatAgo(ts: number): string {
  const diff = Math.max(0, Date.now() - ts)
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'recién'
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `hace ${hours} h`
  const days = Math.floor(hours / 24)
  return `hace ${days} d`
}

async function getDatosRoutes(): Promise<string[]> {
  try {
    const res = await fetch('/pwa/datos-routes', { cache: 'no-store' })
    if (!res.ok) return []
    const json = await res.json()
    return Array.isArray(json?.routes) ? (json.routes as string[]) : []
  } catch {
    return []
  }
}

async function hasOfflineCore(): Promise<boolean> {
  try {
    if (!('caches' in window)) return false
    const need = ['/datos/vuelo', '/datos', '/data/activities.json', '/offline.html']
    const hits = await Promise.all(
      need.map(async (u) => {
        try {
          const r = await caches.match(u)
          return Boolean(r)
        } catch {
          return false
        }
      })
    )
    return hits.every(Boolean)
  } catch {
    return false
  }
}

// Prefetch images using <img> so SW sees request.destination === 'image'
function warmImage(url: string, timeoutMs = 9000): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const img = new Image()
      const t = window.setTimeout(() => {
        cleanup()
        resolve(false)
      }, timeoutMs)
      const cleanup = () => {
        window.clearTimeout(t)
        img.onload = null
        img.onerror = null
      }
      img.onload = () => {
        cleanup()
        resolve(true)
      }
      img.onerror = () => {
        cleanup()
        resolve(false)
      }
      img.decoding = 'async'
      img.loading = 'eager'
      img.src = url
    } catch {
      resolve(false)
    }
  })
}

async function prefetchActivityImages(limit = 90) {
  try {
    const res = await fetch('/data/activities.json', { cache: 'force-cache' })
    if (!res.ok) return
    const json = (await res.json()) as any[]
    const urls = (json || [])
      .map((a) => String(a?.imageUrl ?? ''))
      .filter((u) => u && u !== 'Link')
    const unique = Array.from(new Set(urls)).slice(0, limit)

    for (let i = 0; i < unique.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      await warmImage(unique[i])
      if (i % 8 === 0) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 40))
      }
    }
  } catch {
    // ignore
  }
}

export function AutoOfflineWarmup({ compact = true }: { compact?: boolean }) {
  const router = useRouter()
  const [state, setState] = useState<State>('idle')
  const [details, setDetails] = useState<string | null>(null)
  const [lastSync, setLastSync] = useState<number | null>(null)

  const canSW = useMemo(() => typeof window !== 'undefined' && 'serviceWorker' in navigator, [])

  useEffect(() => {
    setLastSync(readLastSync())
  }, [])

  useEffect(() => {
    let cancelled = false

    async function run() {
      if (!canSW) return

      const online = navigator.onLine
      try {
        setState('warming')
        setDetails('Sincronizando contenido…')

        // 1) Asegurar SW listo y pedir precache /datos (sin botones)
        const reg = await navigator.serviceWorker.ready
        reg.active?.postMessage({ type: 'PRECACHE_DATOS' })

        // 2) Prefetch rutas App Router (mejora cold-start offline)
        if (online) {
          const routes = await getDatosRoutes()
          const unique = Array.from(new Set(routes.filter((r) => typeof r === 'string' && r.startsWith('/datos'))))
          for (let i = 0; i < unique.length; i++) {
            if (cancelled) return
            router.prefetch(unique[i])
            if (i % 6 === 0) await new Promise((res) => setTimeout(res, 35))
          }
        }

        // 3) Cache extra: activities.json en localStorage (fallback)
        try {
          const a = await fetch('/data/activities.json', { cache: 'force-cache' })
          if (a.ok) {
            const txt = await a.text()
            localStorage.setItem('nv.activities.v1', txt)
          }
        } catch {
          // ignore
        }

        // 4) Prefetch imágenes de actividades (best-effort) cuando hay internet
        if (online) {
          prefetchActivityImages().catch(() => {})
        }

        // 5) Estado final (online/offline)
        const ok = await hasOfflineCore()
        if (cancelled) return

        if (!navigator.onLine) {
          setState(ok ? 'offline_ok' : 'offline_needs')
          setDetails(null)
        } else {
          setState('ready')
          const ts = Date.now()
          if (ok) {
            writeLastSync(ts)
            setLastSync(ts)
          }
          setDetails(ok ? 'Sincronizado' : 'Sincronizando…')
        }
      } catch (e: any) {
        if (cancelled) return
        setState('error')
        setDetails(e?.message ?? 'No se pudo sincronizar')
      }
    }

    const t = window.setTimeout(run, 0)
    return () => {
      cancelled = true
      window.clearTimeout(t)
    }
  }, [canSW, router])

  const online = typeof navigator !== 'undefined' ? navigator.onLine : true
  const offlineCoreOk = state === 'ready' || state === 'offline_ok'

  // Compact badge (header)
  if (compact) {
    if (state === 'idle') return null

    let label = 'Sincronizando…'
    if (state === 'warming') label = 'Sincronizando…'
    else if (!online) label = offlineCoreOk ? 'Sin conexión: OK' : 'Sin conexión: sincronizar'
    else label = offlineCoreOk ? 'Sincronizado' : 'Sincronizando…'

    return (
      <span className="rounded-full border border-zinc-200 bg-white/70 px-2 py-1 text-[11px] text-zinc-800 shadow-sm backdrop-blur">
        {label}
      </span>
    )
  }

  // Full card (portada)
  const status = !online ? (offlineCoreOk ? 'Sin conexión: OK' : 'Sin conexión: sincronizar') : offlineCoreOk ? 'Sincronizado' : 'Sincronizando…'

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3 text-sm text-zinc-900 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="font-medium">Estado</div>
        <div className="text-xs text-zinc-600">{status}</div>
      </div>

      <div className="mt-2 text-xs text-zinc-600">
        {online
          ? `El sitio se sincroniza automáticamente cuando hay internet.${lastSync ? ` Última sincronización: ${formatAgo(lastSync)}.` : ''}`
          : 'Estás sin conexión. Para refrescar contenido, conectate y recargá esta página una vez.'}
      </div>

      {details ? <div className="mt-1 text-[11px] text-zinc-500">{details}</div> : null}
    </div>
  )
}
