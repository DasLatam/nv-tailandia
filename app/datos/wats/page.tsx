import Link from 'next/link'
import { WATS } from '@/data/watsGuide'

export const dynamic = 'force-static'

export default function WatsIndexPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Wats</h1>
        <p className="text-zinc-700">
          Fichas largas por templo: historia (lo indispensable), arquitectura/diseño (cómo se recorre), qué observar sí o
          sí (para mirar con intención) y datos curiosos.
        </p>
      </header>

      <div className="grid gap-2">
        {WATS.map((w) => (
          <Link
            key={w.slug}
            href={`/datos/wats/${w.slug}`}
            className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm hover:bg-zinc-50 no-underline"
          >
            <div className="flex items-baseline justify-between gap-2">
              <div className="text-base font-semibold text-zinc-900">{w.name}</div>
              <div className="text-xs text-zinc-600">{w.city}</div>
            </div>
            {w.aka ? <div className="mt-1 text-xs text-zinc-600">{w.aka}</div> : null}
          </Link>
        ))}
      </div>

      <footer className="border-t border-zinc-200 pt-4" data-print-hide="1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/datos/7-eleven"
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50"
            >
              ← Anterior
            </Link>
            <Link
              href="/datos"
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50"
            >
              Índice
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
