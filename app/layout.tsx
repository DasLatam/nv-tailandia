import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mapa de Actividades – Tailandia',
  description: 'Mapa interactivo + lista filtrada por viewport para planificar actividades.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-zinc-950 text-zinc-50">
        {children}
      </body>
    </html>
  )
}
