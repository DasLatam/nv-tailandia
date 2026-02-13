import type { Metadata } from 'next'
import './globals.css'
import 'maplibre-gl/dist/maplibre-gl.css'

export const metadata: Metadata = {
  title: 'Mapa de Actividades – Tailandia',
  description: 'Mapa interactivo + lista filtrada por viewport para planificar actividades.',
  icons: {
    icon: '/favicon.ico'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="h-dvh overflow-hidden overscroll-none bg-zinc-950 text-zinc-50">
        {children}
      </body>
    </html>
  )
}
