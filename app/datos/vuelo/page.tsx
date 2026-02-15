import Link from 'next/link'
import { ContinueBlock } from '@/components/datos/ContinueBlock'
import { AutoOfflineWarmup } from '@/components/pwa/AutoOfflineWarmup'
import {
  DATOS_CHAPTERS,
  chapterWordCount,
  countWords,
  estimateReadingMinutes
} from '@/data/datosChapters'
import { WATS } from '@/data/watsGuide'

export const dynamic = 'force-static'

function watWordCount(w: (typeof WATS)[number]) {
  const parts: string[] = [w.name, w.city, w.aka ? w.aka.join(' ') : '']
  parts.push(...w.sections.historia)
  parts.push(...w.sections.arquitectura)
  parts.push(...w.sections.diseno)
  parts.push(...w.sections.observar)
  parts.push(...w.sections.curiosidades)
  return countWords(parts.join(' '))
}

export default function ModoVueloPage() {
  const chapters = DATOS_CHAPTERS.map((c) => {
    const words = chapterWordCount(c)
    const minutes = estimateReadingMinutes(words)
    return { slug: c.slug, title: c.title, description: c.description, words, minutes }
  })

  const wats = WATS.map((w) => {
    const words = watWordCount(w)
    const minutes = estimateReadingMinutes(words)
    return { slug: w.slug, name: w.name, location: w.city, minutes }
  })

  const chaptersTotalMinutes = chapters.reduce((acc, c) => acc + c.minutes, 0)
  const watsTotalMinutes = wats.reduce((acc, w) => acc + w.minutes, 0)
  const totalMinutes = chaptersTotalMinutes + watsTotalMinutes

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2" data-print-hide="1">
          <Link
            href="/datos"
            className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 shadow-sm hover:bg-zinc-100"
          >
            ← Índice
          </Link>
          <AutoOfflineWarmup />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Modo vuelo</h1>
        <p className="text-zinc-700">
          Portada offline para leer <strong>/datos</strong> en el avión. Abrí <strong>/datos</strong> una vez con internet (se cachea automáticamente) y después vas a poder entrar y leer sin conexión.
        </p>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="text-xs text-zinc-500">Tiempo (capítulos)</div>
            <div className="mt-1 text-lg font-semibold text-zinc-900">{chaptersTotalMinutes} min</div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="text-xs text-zinc-500">Tiempo (wats)</div>
            <div className="mt-1 text-lg font-semibold text-zinc-900">{watsTotalMinutes} min</div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="text-xs text-zinc-500">Total estimado</div>
            <div className="mt-1 text-lg font-semibold text-zinc-900">{totalMinutes} min</div>
            <div className="mt-1 text-[11px] text-zinc-500">(palabras / 220 ppm, redondeado)</div>
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700 shadow-sm">
          <div className="font-semibold text-zinc-900">Offline real (cómo asegurarlo)</div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Entrá a <strong>/datos/vuelo</strong> con internet (una vez).</li>
            <li>Esperá 10–20 segundos y tocá <strong>“Preparar offline”</strong> si querés forzar el precache.</li>
            <li>Probá modo avión y recargá <strong>/datos/vuelo</strong>: si abre, ya estás.</li>
          </ul>
        </div>
      </header>

      <ContinueBlock />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Capítulos</h2>
        <div className="grid gap-3">
          {chapters.map((c) => (
            <Link
              key={c.slug}
              href={`/datos/${c.slug}`}
              className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm hover:bg-zinc-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-zinc-900">{c.title}</div>
                  <div className="mt-1 text-sm text-zinc-700">{c.description}</div>
                </div>
                <div className="shrink-0 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs text-zinc-700">
                  {c.minutes} min
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Wats que vamos a visitar</h2>
          <Link
            href="/datos/wats"
            className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 shadow-sm hover:bg-zinc-100"
          >
            Ver índice de wats
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {wats.map((w) => (
            <Link
              key={w.slug}
              href={`/datos/wats/${w.slug}`}
              className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm hover:bg-zinc-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-zinc-900">{w.name}</div>
                  <div className="mt-1 text-sm text-zinc-700">{w.location}</div>
                </div>
                <div className="shrink-0 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs text-zinc-700">
                  {w.minutes} min
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
