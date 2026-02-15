import Link from 'next/link'
import { PrintButton } from '@/components/PrintButton'

export default function DatosLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-white text-zinc-900">
      <header data-print-hide="1" className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <Link
              href="/"
              className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 shadow-sm hover:bg-zinc-100"
              title="Volver al mapa"
            >
              ← Mapa
            </Link>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">DATOS – Guía de lectura</div>
              <div className="truncate text-xs text-zinc-600">Budismo, cultura e info práctica de wats</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-2 sm:flex">
              <Link
                href="/datos"
                className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 shadow-sm hover:bg-zinc-100"
              >
                Índice
              </Link>
              <Link
                href="/datos/budismo"
                className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 shadow-sm hover:bg-zinc-100"
              >
                Budismo
              </Link>
              <Link
                href="/datos/cultura"
                className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 shadow-sm hover:bg-zinc-100"
              >
                Cultura
              </Link>
              <Link
                href="/datos/wats"
                className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 shadow-sm hover:bg-zinc-100"
              >
                Wats
              </Link>
            </nav>
            <PrintButton />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto overscroll-contain">
        <div className="mx-auto max-w-[1100px] px-4 py-6">
          <div className="data-prose">{children}</div>
        </div>
      </div>
    </div>
  )
}
