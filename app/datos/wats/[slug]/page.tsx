import Link from 'next/link'
import { notFound } from 'next/navigation'
import { WAT_BY_SLUG, WATS } from '@/data/watsGuide'

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="space-y-2">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="space-y-2">
        {items.map((p, idx) => (
          <p key={idx} className="text-zinc-700">
            {p}
          </p>
        ))}
      </div>
    </section>
  )
}

export default function WatPage({ params }: { params: { slug: string } }) {
  const wat = WAT_BY_SLUG.get(params.slug)
  if (!wat) return notFound()

  const idx = WATS.findIndex((w) => w.slug === wat.slug)
  const prev = idx > 0 ? WATS[idx - 1] : null
  const next = idx >= 0 && idx < WATS.length - 1 ? WATS[idx + 1] : null

  const mapsHref = wat.mapsQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(wat.mapsQuery)}`
    : null

  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/datos/wats"
            className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 shadow-sm hover:bg-zinc-100"
          >
            ← Todos los wats
          </Link>
          {mapsHref ? (
            <a
              href={mapsHref}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 shadow-sm hover:bg-zinc-100"
            >
              Abrir en Maps
            </a>
          ) : null}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{wat.name}</h1>
        <div className="text-sm text-zinc-600">
          {wat.city}
          {wat.aka ? ` · ${wat.aka}` : ''}
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="text-sm font-semibold">Qué mirar sí o sí</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
            {wat.sections.observar.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold">Mini-plan de visita (en 20–45 min)</div>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-zinc-700">
            <li>Entrá y ubicá el eje principal (entrada → patio → edificio/torre principal).</li>
            <li>Hacé 1 vuelta de orientación (sin fotos) y elegí 3 detalles para mirar con calma.</li>
            <li>Pasá a “modo detalle”: texturas, guardianes, murales, techo, base, simetrías.</li>
            <li>Tomá 5–10 fotos clave (no 50) y salí con un recuerdo claro del lugar.</li>
          </ol>
        </div>
      </div>

      <Section title="Historia" items={wat.sections.historia} />
      <Section title="Arquitectura" items={wat.sections.arquitectura} />
      <Section title="El diseño del recorrido" items={wat.sections.diseno} />
      <Section title="Datos curiosos" items={wat.sections.curiosidades} />

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-200 pt-4">
        <div className="flex items-center gap-2">
          {prev ? (
            <Link
              href={`/datos/wats/${prev.slug}`}
              className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 shadow-sm hover:bg-zinc-100"
            >
              ← {prev.name}
            </Link>
          ) : null}
          {next ? (
            <Link
              href={`/datos/wats/${next.slug}`}
              className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 shadow-sm hover:bg-zinc-100"
            >
              {next.name} →
            </Link>
          ) : null}
        </div>
        <Link
          href="/"
          className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 shadow-sm hover:bg-zinc-100"
        >
          Volver al mapa
        </Link>
      </footer>
    </article>
  )
}
