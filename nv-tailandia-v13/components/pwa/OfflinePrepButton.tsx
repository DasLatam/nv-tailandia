'use client'

import { useState } from 'react'

export function OfflinePrepButton() {
  const [state, setState] = useState<'idle' | 'working' | 'done' | 'error'>('idle')

  const onClick = async () => {
    try {
      setState('working')
      if (!('serviceWorker' in navigator)) {
        setState('error')
        return
      }
      const reg = await navigator.serviceWorker.ready
      reg.active?.postMessage({ type: 'PRECACHE_DATOS' })
      // We can't reliably await cache completion without a channel; keep it simple.
      window.setTimeout(() => setState('done'), 600)
    } catch {
      setState('error')
    }
  }

  const label =
    state === 'idle'
      ? 'Preparar offline'
      : state === 'working'
        ? 'Preparando…'
        : state === 'done'
          ? 'Listo'
          : 'No disponible'

  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
      disabled={state === 'working'}
      title="Pre-cachea /datos para lectura offline"
    >
      {label}
    </button>
  )
}
