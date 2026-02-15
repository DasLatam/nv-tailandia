import Link from 'next/link'
import { WATS } from '@/data/watsGuide'

export default function DatosIndexPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">Guía DATOS (para el vuelo y para el viaje)</h1>
        <p className="text-zinc-700">
          Esta sección está pensada para leer con tiempo (vuelo de ida) y para consultar rápido durante el viaje.
          El foco es práctico: cómo mirar un wat, qué observar, cómo recorrer sin agotarse y cómo interpretar lo que
          tenés delante.
        </p>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="text-sm font-medium">Cómo usar esta guía</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
            <li>
              <b>Lectura larga:</b> Budismo y Cultura (te da el “lenguaje” para entender lo demás).
            </li>
            <li>
              <b>Consulta puntual:</b> fichas de Wats (historia + arquitectura + qué mirar + curiosidades).
            </li>
            <li>
              <b>Offline:</b> usá <b>Imprimir / PDF</b> para guardar un PDF y leer sin conexión.
            </li>
          </ul>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/datos/budismo"
          className="group rounded-xl border border-zinc-200 bg-white p-4 shadow-sm hover:bg-zinc-50"
        >
          <div className="flex items-center justify-between">
            <div className="text-base font-semibold">Budismo y Tailandia</div>
            <div className="text-zinc-400 group-hover:text-zinc-600">→</div>
          </div>
          <p className="mt-2 text-sm text-zinc-700">
            Vida monástica y mérito; filosofía y fiestas sagradas; arquitectura y simbolismo de los wats.
          </p>
        </Link>

        <Link
          href="/datos/cultura"
          className="group rounded-xl border border-zinc-200 bg-white p-4 shadow-sm hover:bg-zinc-50"
        >
          <div className="flex items-center justify-between">
            <div className="text-base font-semibold">Tailandia e idiosincrasia</div>
            <div className="text-zinc-400 group-hover:text-zinc-600">→</div>
          </div>
          <p className="mt-2 text-sm text-zinc-700">
            Costumbres, etiqueta social, escritura e idioma (por qué se ven/funcionan así), y contexto histórico.
          </p>
        </Link>
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-semibold">Wats del viaje</h2>
          <Link
            href="/datos/wats"
            className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 shadow-sm hover:bg-zinc-100"
          >
            Ver todos
          </Link>
        </div>
        <p className="text-sm text-zinc-700">
          Cada wat tiene una ficha práctica: historia (lo mínimo necesario), arquitectura/diseño (cómo está compuesto),
          qué observar sí o sí, y datos curiosos.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {WATS.slice(0, 8).map((w) => (
            <Link
              key={w.slug}
              href={`/datos/wats/${w.slug}`}
              className="rounded-lg border border-zinc-200 bg-white p-3 text-sm shadow-sm hover:bg-zinc-50"
            >
              <div className="font-semibold">{w.name}</div>
              <div className="text-xs text-zinc-600">{w.city}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="text-sm font-semibold">Etiqueta rápida en templos (checklist)</div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
          <li>Hombros y rodillas cubiertos (ideal para la mayoría de los wats).</li>
          <li>Sacarse zapatos en interiores (observá carteles y filas de calzado).</li>
          <li>Evitar apuntar los pies hacia imágenes de Buda; no tocar estatuas.</li>
          <li>Fotos: evitá flash donde haya señalización; en rituales, prioridad al respeto.</li>
          <li>Voz baja, movimientos suaves, y ceder paso a monjes/personas rezando.</li>
        </ul>
      </section>
    </div>
  )
}
