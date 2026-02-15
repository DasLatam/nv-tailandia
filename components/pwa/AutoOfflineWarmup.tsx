'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

type State = 'idle' | 'warming' | 'done' | 'offline' | 'error'

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

export function AutoOfflineWarmup({ compact = true }: { compact?: boolean }) {
  const router = useRouter()
  const [state, setState] = useState<State>('idle')
  const [details, setDetails] = useState<string | null>(null)

  const canSW = useMemo(() => typeof window !== 'undefined' && 'serviceWorker' in navigator, [])

  useEffect(() => {
    let cancelled = false

    async function run() {
      if (!canSW) return
      if (!navigator.onLine) {
        setState('offline')
        setDetails(null)
        return
      }

      try {
        setState('warming')
        setDetails('Preparando lectura offline…')

        // Ensure SW is ready and ask it to precache /datos.
        const reg = await navigator.serviceWorker.ready
        reg.active?.postMessage({ type: 'PRECACHE_DATOS' })

        // Also prefetch routes through Next router so the App Router flight payloads get cached too.
        const routes = await getDatosRoutes()
        const unique = Array.from(new Set(routes.filter((r) => typeof r === 'string' && r.startsWith('/datos'))))

        // Prefetch in small batches to avoid spikes.
        for (let i = 0; i < unique.length; i++) {
          if (cancelled) return
          const r = unique[i]
          // router.prefetch triggers the correct internal requests used by App Router.
          // We ignore failures (mobile network, etc.).
          router.prefetch(r)
          if (i % 6 === 0) await new Promise((res) => setTimeout(res, 40))
        }

        // Cache activities data for the map/list offline (extra safety beyond SW).
        try {
          const a = await fetch('/data/activities.json', { cache: 'force-cache' })
          if (a.ok) {
            const txt = await a.text()
            localStorage.setItem('nv.activities.v1', txt)
          }
        } catch {
          // ignore
        }

        setState('done')
        setDetails('Offline listo')
      } catch (e: any) {
        setState('error')
        setDetails(e?.message ?? 'No se pudo preparar offline')
      }
    }

    // Run once after first paint.
    const t = window.setTimeout(run, 0)
    return () => {
      cancelled = true
      window.clearTimeout(t)
    }
  }, [canSW, router])

  if (!compact) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-3 text-sm text-zinc-800 shadow-sm" data-print-hide="1">
        <div className="font-semibold">Offline</div>
        <div className="text-zinc-600">
          {state === 'offline' ? 'Estás sin conexión. Abrí /datos una vez con internet para cachear todo.' : details}
        </div>
      </div>
    )
  }

  // Compact badge (non-intrusive)
  if (state === 'idle') return null

  const label =
    state === 'warming'
      ? 'Preparando offline…'
      : state === 'done'
        ? 'Offline listo'
        : state === 'offline'
          ? 'Sin conexión'
          : 'Offline: error'

  return (
    <div
      className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-700 shadow-sm"
      data-print-hide="1"
      title={details ?? label}
    >
      {label}
    </div>
  )
}
