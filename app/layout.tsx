import type { Metadata } from 'next'
import './globals.css'
import 'maplibre-gl/dist/maplibre-gl.css'
import { ServiceWorkerRegister } from '@/components/pwa/ServiceWorkerRegister'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nv-tailandia.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'NV Tailandia — Mapa + Guía Offline',
    template: '%s · NV Tailandia',
  },
  description: 'Mapa de actividades + guía larga (/datos) optimizada para lectura offline durante el viaje.',
  applicationName: 'NV Tailandia',
  manifest: '/manifest.webmanifest',
  themeColor: '#0f172a',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'NV Tailandia' },
  icons: {
    icon: ['/icons/icon-192.png', '/icons/icon-512.png'],
    apple: ['/apple-touch-icon.png'],
  },
  openGraph: {
    type: 'website',
    url: '/',
    title: 'NV Tailandia — Mapa + Guía Offline',
    description: 'Mapa de actividades + guía larga (/datos) para usar en el avión y en el viaje, sin conexión.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'NV Tailandia' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NV Tailandia — Mapa + Guía Offline',
    description: 'Mapa + guía offline (/datos/vuelo) para el viaje.',
    images: ['/og.png'],
  },
  verification: {
    google: 'oY0iAP-IvpOXfXBB36EyUGGjAAWBoFKMc_bBBQJ_aDA',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-dvh bg-white text-zinc-900">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  )
}
