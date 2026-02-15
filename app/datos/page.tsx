import Link from 'next/link'
import { ContinueBlock } from '@/components/datos/ContinueBlock'
import { DATOS_CHAPTERS } from '@/data/datosChapters'

export const dynamic = 'force-static'

export default function DatosIndexPage() {
  return (
    <div className="prose prose-zinc max-w-none">
      <h1>Datos de viaje</h1>
      <p>
        Lectura larga y práctica para el viaje. Está pensada para celular y para usarla offline (modo avión) una vez que el
        sitio haya cacheado.
      </p>

      <ContinueBlock />

      <h2>Modo vuelo (sin conexión)</h2>
      <p>
        La portada <Link href="/datos/vuelo">/datos/vuelo</Link> te deja un índice por capítulos con tiempo estimado de lectura
        y el acceso rápido a los wats. <strong>No hace falta apretar botones</strong>: el sitio prepara el offline
        automáticamente cuando hay internet. Si arriba ves <em>“Sin conexión: OK”</em>, ya está.
      </p>

      <p>
        <Link
          href="/datos/vuelo"
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm hover:bg-zinc-50 no-underline"
        >
          Abrir Modo vuelo →
        </Link>
      </p>

      <h2>Wats que vamos a visitar</h2>
      <p>
        Guía por templo: historia, arquitectura, recorrido, qué mirar sí o sí, curiosidades y tips. Pensada para mirar el
        lugar con intención y no “pasar por arriba”.
      </p>
      <p>
        <Link
          href="/datos/wats"
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm hover:bg-zinc-50 no-underline"
        >
          Ver índice de wats →
        </Link>
      </p>

      <h2>Capítulos</h2>
      <div className="not-prose grid gap-3">
        {DATOS_CHAPTERS.map((c) => (
          <div key={c.slug} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold text-zinc-900">{c.title}</div>
            <div className="mt-1 text-xs text-zinc-600">{c.description}</div>
            <div className="mt-3">
              <Link
                href={`/datos/${c.slug}`}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm hover:bg-zinc-50 no-underline"
              >
                Leer →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <h2>Tips rápidos</h2>
      <ul>
        <li>En cada capítulo podés usar “Imprimir / Guardar PDF” para llevarte un PDF al teléfono.</li>
        <li>El sistema guarda tu posición de lectura dentro de /datos (ruta + scroll) para continuar.</li>
      </ul>
    </div>
  )
}
