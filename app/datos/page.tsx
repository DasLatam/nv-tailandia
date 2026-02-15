import Link from 'next/link'
import { ContinueBlock } from '@/components/datos/ContinueBlock'
import { DATOS_CHAPTERS } from '@/data/datosChapters'

export const dynamic = 'force-static'

export default function DatosIndexPage() {
  return (
    <div className="prose prose-zinc max-w-none">
      <h1>Datos</h1>
      <p>
        Esto es una guía práctica para el viaje. Está pensada para <strong>leer rápido</strong> desde el celular (y
        funciona sin conexión una vez que el sitio se sincronizó al menos una vez con internet).
      </p>

      <ContinueBlock />

      <h2>Capítulos</h2>
      <p>Elegí un capítulo. Al final de cada uno tenés botones de: <strong>Anterior</strong>, <strong>Índice</strong> y <strong>Siguiente</strong>.</p>

      <div className="not-prose grid gap-3">
        {DATOS_CHAPTERS.map((c) => (
          <Link
            key={c.slug}
            href={`/datos/${c.slug}`}
            className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm hover:bg-zinc-50 no-underline"
          >
            <div className="text-base font-semibold text-zinc-900">{c.title}</div>
            <div className="mt-1 text-sm text-zinc-700">{c.description}</div>
          </Link>
        ))}

        <Link
          href="/datos/wats"
          className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm hover:bg-zinc-50 no-underline"
        >
          <div className="text-base font-semibold text-zinc-900">Wats (guía por templo)</div>
          <div className="mt-1 text-sm text-zinc-700">
            Historia + arquitectura + recorrido + “qué observar sí o sí” para cada wat que vamos a visitar.
          </div>
        </Link>
      </div>

      <div className="not-prose mt-4 text-xs text-zinc-600">
        El estado de sincronización aparece arriba a la derecha: <em>Sincronizado</em> (online) o <em>Sin conexión: OK</em>
        (modo avión). Si alguna vez actualizás contenido, abrí esta sección con internet una vez para re‑sincronizar.
      </div>
    </div>
  )
}
