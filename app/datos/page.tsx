import Link from 'next/link'
import { ContinueBlock } from '@/components/datos/ContinueBlock'
import { DATOS_CHAPTERS } from '@/data/datosChapters'

export const dynamic = 'force-static'

export default function DatosIndexPage() {
  return (
    <div className="prose prose-zinc max-w-none">
      <h1>Datos de viaje</h1>
      <p>
        Guía práctica para el viaje, pensada para leer en el celular. Cuando hay internet, el sitio se sincroniza solo y
        queda disponible sin conexión.
      </p>

      <div className="not-prose rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="text-sm font-semibold text-zinc-900">Qué hay acá</div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
          <li>
            <strong>Budismo y etiqueta en templos</strong>: mérito (bun), vida monástica, qué mirar en un wat y cómo
            comportarte (pies, cabeza, postura, fotos/flash).
          </li>
          <li>
            <strong>Idiosincrasia tailandesa</strong>: sanuk, jai yen, kreng jai, jerarquías y wai (con ejemplos reales).
          </li>
          <li>
            <strong>Consejos de viaje</strong>: salud/calor, mosquitos, transporte (Grab/BTS/MRT), dinero/ATM/propinas.
          </li>
          <li>
            <strong>7‑Eleven survival guide</strong>: qué comprar y para qué (electrolitos, repelente, SIM, antiácidos,
            snacks).
          </li>
          <li>
            <strong>Wats</strong>: guía por templo (historia, arquitectura, recorrido y “qué observar sí o sí”).
          </li>
        </ul>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Link
            href="/datos/vuelo"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-100 no-underline"
          >
            Ver portada de lectura
          </Link>
          <Link
            href="/datos/wats"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 no-underline"
          >
            Índice de wats
          </Link>
        </div>

        <div className="mt-2 text-xs text-zinc-600">
          Arriba vas a ver el estado: <em>Sincronizado</em> (online) o <em>Sin conexión: OK</em> (modo avión). Si alguna vez
          actualizás contenido, abrí esta sección con internet una vez para re‑sincronizar.
        </div>
      </div>

      <ContinueBlock />

      <h2>Capítulos</h2>
      <p>Entrá por acá. El sistema guarda tu posición (ruta + scroll) para continuar donde dejaste.</p>

      <div className="not-prose grid gap-3">
        {DATOS_CHAPTERS.map((c) => (
          <div key={c.slug} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold text-zinc-900">{c.title}</div>
            <p className="mt-1 text-sm text-zinc-700">{c.description}</p>
            <div className="mt-3">
              <Link
                href={`/datos/${c.slug}`}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-100 no-underline"
              >
                Leer →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <h2>Cómo usar esta guía</h2>
      <ul>
        <li>
          En cada capítulo tenés <strong>Imprimir / Guardar PDF</strong> (ideal para guardar en Archivos/Drive).
        </li>
        <li>
          Si estás sin conexión, la guía igual abre. Para refrescar contenido: conectate y recargá <strong>/datos</strong>{' '}
          o <strong>/datos/vuelo</strong> una vez.
        </li>
      </ul>
    </div>
  )
}
