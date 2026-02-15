import type { MetadataRoute } from 'next'

function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit && explicit.trim()) return explicit.replace(/\/$/, '')
  const vercel = process.env.VERCEL_URL
  if (vercel && vercel.trim()) return `https://${vercel}`.replace(/\/$/, '')
  return 'http://localhost:3000'
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
