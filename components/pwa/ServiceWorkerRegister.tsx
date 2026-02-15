'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js')

        // If there's already a waiting worker, tell it to activate.
        if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' })

        reg.addEventListener('updatefound', () => {
          const sw = reg.installing
          if (!sw) return
          sw.addEventListener('statechange', () => {
            if (sw.state === 'installed' && navigator.serviceWorker.controller) {
              sw.postMessage({ type: 'SKIP_WAITING' })
            }
          })
        })

        // Optional: keep registration fresh
        reg.update().catch(() => {})
      } catch {
        // ignore
      }
    }

    // Defer until after first paint
    const onControllerChange = () => {
      // When a new SW takes control, reload once to ensure fresh caches are used.
      window.location.reload()
    }
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange)

    const t = window.setTimeout(register, 0)
    return () => {
      window.clearTimeout(t)
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange)
    }
  }, [])

  return null
}
