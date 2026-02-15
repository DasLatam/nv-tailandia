'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { clearProgress, readProgress, type DatosProgress } from './progress'

function formatWhen(ts: number) {
  try {
    return new Intl.DateTimeFormat('es-AR', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(ts))
  } catch {
    return new Date(ts).toLocaleString()
  }
}

export function ContinueBlock() {
  const [progress, setProgress] = useState<DatosProgress | null>(null)

  useEffect(() => {
    setProgress(readProgress())
  }, [])

  if (!progress?.lastPath) return null

  const pos = progress.positions?.[progress.lastPath]
  const hasScroll = typeof pos?.y === 'number' && pos.y > 80

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm" data-print-hide="1">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-emerald-900">Continuar donde dejé</div>
          <div className="mt-1 text-sm text-emerald-900/90">
            Última lectura:{' '}
            <span className="font-medium">{progress.lastPath}</span>
            {progress.lastUpdated ? <span className="text-emerald-900/70"> · {formatWhen(progress.lastUpdated)}</span> : null}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`${progress.lastPath}${hasScroll ? '?continue=1' : ''}`}
            className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            Continuar
          </Link>
          <button
            type="button"
            className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-900 shadow-sm hover:bg-emerald-100"
            onClick={() => {
              clearProgress()
              setProgress(null)
            }}
          >
            Reiniciar
          </button>
        </div>
      </div>
    </div>
  )
}
