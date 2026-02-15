import type { Metadata } from 'next'
import './globals.css'
import { ServiceWorkerRegister } from '@/components/pwa/ServiceWorkerRegister'
import 'maplibre-gl/dist/maplibre-gl.css'

export const metadata: Metadata = {
  title: 'nv-tailandia',
  description: 'Mapa + actividades desde CSV, con sección /datos para lectura offline.',
  manifest: '/manifest.webmanifest',
  themeColor: '#0f172a',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'nv-tailandia'
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/apple-touch-icon.png'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      {/*
        Nota: NO bloqueamos el scroll global acá. Algunas pantallas (p.ej. /datos) necesitan
        scroll vertical normal. Las vistas full-screen (mapa) ya controlan su altura a nivel
        de layout/página.
      */}
      <body className="min-h-dvh overflow-x-hidden bg-zinc-50 text-zinc-900 antialiased">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}
