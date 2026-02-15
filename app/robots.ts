import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'

function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit && explicit.trim()) return explicit.replace(/\/$/, '')

  const h = headers()
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const proto = h.get('x-forwarded-proto') ?? 'https'
  if (host && host.trim()) return `${proto}://${host}`.replace(/\/$/, '')

  const vercel = process.env.VERCEL_URL
  if (vercel && vercel.trim()) return `https://${vercel}`.replace(/\/$/, '')

  return 'http://localhost:3000'
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
