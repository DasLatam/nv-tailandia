export const PROGRESS_KEY = 'nv_datos_progress_v1'

export type DatosProgress = {
  lastPath: string
  lastUpdated: number
  positions: Record<string, { y: number; updated: number }>
}

export function readProgress(): DatosProgress | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as DatosProgress
    if (!parsed?.lastPath || typeof parsed.lastUpdated !== 'number' || typeof parsed.positions !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

export function writeProgress(next: DatosProgress) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(next))
  } catch {
    // ignore quota
  }
}

export function clearProgress() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(PROGRESS_KEY)
  } catch {
    // ignore
  }
}

export function upsertProgress(pathname: string, y: number) {
  const now = Date.now()
  const prev = readProgress()
  const next: DatosProgress = {
    lastPath: pathname,
    lastUpdated: now,
    positions: { ...(prev?.positions ?? {}) }
  }
  next.positions[pathname] = { y: Math.max(0, Math.floor(y)), updated: now }
  writeProgress(next)
}
