import Link from 'next/link'
import { notFound } from 'next/navigation'
import { WAT_BY_SLUG, WATS } from '@/data/watsGuide'
import fs from 'node:fs/promises'
import path from 'node:path'

type ActivityLite = { Nombre?: string; imageUrl?: string }

async function findHeroImageForWat(name: string): Promise<string | null> {
  try {
    const p = path.join(process.cwd(), 'public', 'data', 'activities.json')
    const raw = await fs.readFile(p, 'utf-8')
    const items = JSON.parse(raw) as ActivityLite[]
    const target = name.trim().toLowerCase()
    const hit = items.find((a) => String(a?.Nombre ?? '').trim().toLowerCase() === target)
    const url = hit?.imageUrl ? String(hit.imageUrl) : ''
    return url && url !== 'Link' ? url : null
  } catch {
    return null
  }
}

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

export const dynamic = 'force-static'

export default async function WatPage({ params }: { params: { slug: string } }) {
  const wat = WAT_BY_SLUG.get(params.slug)
  if (!wat) return notFound()

  const idx = WATS.findIndex((w) => w.slug === wat.slug)
  const prev = idx > 0 ? WATS[idx - 1] : null
  const next = idx >= 0 && idx < WATS.length - 1 ? WATS[idx + 1] : null

  const mapsQuery = wat.mapsQuery ?? `${wat.name}, ${wat.city}, Thailand`
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`

  const heroImg = await findHeroImageForWat(wat.name)

  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2" data-print-hide="1">
          <Link
            href="/datos/wats"
            className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 shadow-sm hover:bg-zinc-100"
          >
            ← Índice de wats
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

        {heroImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroImg}
            alt={wat.name}
            className="w-full rounded-2xl border border-zinc-200 object-cover shadow-sm"
            style={{ maxHeight: 320 }}
            loading="eager"
          />
        ) : null}
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

        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <div className="text-sm font-semibold">Datos rápidos</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
            {wat.sections.curiosidades.slice(0, 4).map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
      </div>

      <Section title="Historia" items={wat.sections.historia} />
      <Section title="Arquitectura y simbolismo" items={wat.sections.arquitectura} />
      <Section title="Diseño / recorrido" items={wat.sections.diseno} />
      <Section title="Datos curiosos" items={wat.sections.curiosidades} />

      <footer className="border-t border-zinc-200 pt-4" data-print-hide="1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {prev ? (
              <Link
                href={`/datos/wats/${prev.slug}`}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50"
              >
                ← Anterior
              </Link>
            ) : null}

            <Link
              href="/datos/wats"
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50"
            >
              Índice
            </Link>

            {next ? (
              <Link
                href={`/datos/wats/${next.slug}`}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50"
              >
                Siguiente →
              </Link>
            ) : null}
          </div>

          <div className="text-[11px] text-zinc-500">
            {prev ? `← ${prev.name}` : null}
            {prev && next ? ' · ' : null}
            {next ? `${next.name} →` : null}
          </div>
        </div>
      </footer>
    </article>
  )
}
