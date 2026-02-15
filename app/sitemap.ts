import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { WATS } from '@/data/watsGuide'

function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit && explicit.trim()) return explicit.replace(/\/$/, '')

  // Infer host from request (solves GSC "URL no permitida" when the property is a different host)
  const h = headers()
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const proto = h.get('x-forwarded-proto') ?? 'https'
  if (host && host.trim()) return `${proto}://${host}`.replace(/\/$/, '')

  const vercel = process.env.VERCEL_URL
  if (vercel && vercel.trim()) return `https://${vercel}`.replace(/\/$/, '')

  return 'http://localhost:3000'
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl()
  const now = new Date()

  const staticPaths = [
    '/',
    '/datos',
    '/datos/vuelo',
    '/datos/budismo',
    '/datos/cultura',
    '/datos/consejos',
    '/datos/7-eleven',
    '/datos/wats',
  ]

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.7,
  }))

  for (const wat of WATS) {
    entries.push({
      url: `${siteUrl}/datos/wats/${wat.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  }

  return entries
}
