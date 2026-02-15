import Link from 'next/link'
import { ContinueBlock } from '@/components/datos/ContinueBlock'
import { DATOS_CHAPTERS } from '@/data/datosChapters'

export const dynamic = 'force-static'

export default function DatosIndexPage() {
  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Datos de viaje</h1>
        <p className="text-zinc-700">
          Lectura larga y práctica para el viaje. Está pensada para celular y para usarla <strong>offline</strong> en el
          avión.
        </p>
      </header>

      <ContinueBlock />

      <section className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/datos/vuelo"
            className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm hover:bg-emerald-100"
          >
            <div className="text-sm font-semibold text-emerald-900">Modo vuelo (offline)</div>
            <p className="mt-1 text-sm text-emerald-900/90">
              Portada con índice + tiempos de lectura. Prepará el precache para poder leer todo /datos sin internet.
            </p>
            <div className="mt-3 inline-flex rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm">
              Abrir Modo vuelo
            </div>
          </Link>

          <Link
            href="/datos/wats"
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm hover:bg-zinc-50"
          >
            <div className="text-sm font-semibold text-zinc-900">Wats que vamos a visitar</div>
            <p className="mt-1 text-sm text-zinc-700">
              Guía por templo: historia, arquitectura, recorrido, qué mirar sí o sí, curiosidades y tips.
            </p>
            <div className="mt-3 inline-flex rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-900 shadow-sm">
              Ver índice de wats
            </div>
          </Link>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Capítulos</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {DATOS_CHAPTERS.map((c) => (
            <Link
              key={c.slug}
              href={`/datos/${c.slug}`}
              className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm hover:bg-zinc-50"
            >
              <div className="text-sm font-semibold text-zinc-900">{c.title}</div>
              <p className="mt-1 text-sm text-zinc-700">{c.description}</p>
              <div className="mt-3 inline-flex rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-900 shadow-sm">
                Leer
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700 shadow-sm">
        <div className="font-semibold text-zinc-900">Tips rápidos</div>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            En cada capítulo podés usar <strong>Imprimir / Guardar PDF</strong> para llevarte un PDF al teléfono.
          </li>
          <li>
            El sistema guarda tu posición de lectura dentro de <strong>/datos</strong> (ruta + scroll) para continuar.
          </li>
          <li>
            Si estás offline y algo no carga, volvé a abrir <strong>/datos/vuelo</strong> una vez con internet para
            re-cachear.
          </li>
        </ul>
      </section>
    </main>
  )
}
