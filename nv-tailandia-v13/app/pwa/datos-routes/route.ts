import { NextResponse } from 'next/server'
import { DATOS_CHAPTERS } from '@/data/datosChapters'
import { WATS } from '@/data/watsGuide'

export const dynamic = 'force-static'

export function GET() {
  const routes = [
    '/datos',
    '/datos/vuelo',
    ...DATOS_CHAPTERS.map((c) => `/datos/${c.slug}`),
    '/datos/wats',
    ...WATS.map((w) => `/datos/wats/${w.slug}`)
  ]

  return NextResponse.json({ routes })
}
