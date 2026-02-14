import Link from 'next/link'
import { WATS } from '@/data/watsGuide'

export default function WatsIndexPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Wats (fichas de lectura)</h1>
        <p className="text-zinc-700">
          Abrí cualquier wat para ver una ficha completa con: historia (lo indispensable), arquitectura y diseño (cómo se
          recorre), qué observar sí o sí (para mirar con intención) y datos curiosos (para recordar el lugar). La idea es
          que el templo deje de ser “uno más” y se convierta en un conjunto de detalles identificables.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/datos"
            className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 shadow-sm hover:bg-zinc-100"
          >
            Volver al índice
          </Link>
        </div>
      </header>

      <div className="grid gap-2 sm:grid-cols-2">
        {WATS.map((w) => (
          <Link
            key={w.slug}
            href={`/datos/wats/${w.slug}`}
            className="group rounded-xl border border-zinc-200 bg-white p-4 shadow-sm hover:bg-zinc-50"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold">{w.name}</div>
                <div className="mt-0.5 text-xs text-zinc-600">{w.city}{w.aka ? ` · ${w.aka}` : ''}</div>
              </div>
              <div className="text-zinc-400 group-hover:text-zinc-600">→</div>
            </div>
            <div className="mt-3 grid gap-2 text-sm text-zinc-700">
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2">
                <div className="text-[11px] font-semibold text-zinc-700">Qué mirar sí o sí</div>
                <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[13px]">
                  {w.sections.observar.slice(0, 2).map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
