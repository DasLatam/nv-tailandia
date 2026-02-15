'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { readProgress, upsertProgress } from './progress'

function getScrollEl(): HTMLElement | null {
  return document.querySelector('[data-datos-scroll]') as HTMLElement | null
}

export function ReadingProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const debounceRef = useRef<number | null>(null)
  const scrollElRef = useRef<HTMLElement | null>(null)

  const isDatos = useMemo(() => pathname?.startsWith('/datos'), [pathname])
  const wantsAutoContinue = searchParams?.get('continue') === '1'

  const [restoreY, setRestoreY] = useState<number>(0)
  const [showRestore, setShowRestore] = useState(false)

  // Attach / re-attach scroll element when route changes
  useEffect(() => {
    if (!isDatos) return

    const el = getScrollEl()
    scrollElRef.current = el

    const progress = readProgress()
    const pos = progress?.positions?.[pathname]
    const y = typeof pos?.y === 'number' ? pos.y : 0
    setRestoreY(y)
    setShowRestore(!wantsAutoContinue && y > 200)

    // record lastPath early so the "Continuar" card has the latest
    upsertProgress(pathname, el?.scrollTop ?? 0)

    // auto-continue if requested
    if (wantsAutoContinue && el && y > 80) {
      // Let layout/content render before jumping.
      window.setTimeout(() => {
        try {
          el.scrollTo({ top: y })
        } catch {
          el.scrollTop = y
        }
        // remove query param to avoid re-jumps
        router.replace(pathname, { scroll: false })
      }, 60)
    }
  }, [isDatos, pathname, wantsAutoContinue, router])

  // Save progress on scroll (debounced)
  useEffect(() => {
    if (!isDatos) return

    const el = scrollElRef.current ?? getScrollEl()
    if (!el) return

    const onScroll = () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
      debounceRef.current = window.setTimeout(() => {
        upsertProgress(pathname, el.scrollTop)
      }, 250)
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
      debounceRef.current = null
    }
  }, [isDatos, pathname])

  if (!isDatos || !showRestore) return null

  return (
    <div className="sticky top-0 z-20 mb-4" data-print-hide="1">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="font-semibold">Continuar:</span> tenés progreso guardado en esta página.
          </div>
          <button
            type="button"
            className="rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-700"
            onClick={() => {
              const el = scrollElRef.current ?? getScrollEl()
              if (!el) return
              try {
                el.scrollTo({ top: restoreY, behavior: 'smooth' })
              } catch {
                el.scrollTop = restoreY
              }
              setShowRestore(false)
            }}
          >
            Ir a mi punto
          </button>
        </div>
      </div>
    </div>
  )
}
