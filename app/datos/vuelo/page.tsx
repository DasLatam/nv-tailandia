import Link from 'next/link'
import { ContinueBlock } from '@/components/datos/ContinueBlock'
import { AutoOfflineWarmup } from '@/components/pwa/AutoOfflineWarmup'
import { DATOS_CHAPTERS, chapterWordCount, countWords, estimateReadingMinutes } from '@/data/datosChapters'
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
    <div className="prose prose-zinc max-w-none">
      <p>
        <Link href="/datos">← Índice</Link>
      </p>

      <h1>Modo vuelo</h1>
      <p>
        Portada para leer <code>/datos</code> sin internet. El sitio cachea automáticamente cuando hay conexión. Si arriba ves{' '}
        <em>“Sin conexión: OK”</em>, ya está listo para abrir en modo avión.
      </p>

      <div className="not-prose">
        <AutoOfflineWarmup compact={false} />
      </div>

      <div className="not-prose mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
          <div className="text-xs text-zinc-500">Tiempo (capítulos)</div>
          <div className="mt-1 text-lg font-semibold text-zinc-900">{chaptersTotalMinutes} min</div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
          <div className="text-xs text-zinc-500">Tiempo (wats)</div>
          <div className="mt-1 text-lg font-semibold text-zinc-900">{watsTotalMinutes} min</div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
          <div className="text-xs text-zinc-500">Total estimado</div>
          <div className="mt-1 text-lg font-semibold text-zinc-900">{totalMinutes} min</div>
        </div>
      </div>

      <p className="text-xs text-zinc-500">(palabras / 220 ppm, redondeado)</p>

      <ContinueBlock />

      <h2>Capítulos</h2>
      <div className="not-prose grid gap-3">
        {chapters.map((c) => (
          <Link
            key={c.slug}
            href={`/datos/${c.slug}`}
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm no-underline hover:bg-zinc-50"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-zinc-900">{c.title}</div>
                <div className="mt-1 text-xs text-zinc-600">{c.description}</div>
              </div>
              <div className="shrink-0 rounded-full border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700">
                {c.minutes} min
              </div>
            </div>
          </Link>
        ))}
      </div>

      <h2>Wats que vamos a visitar</h2>
      <p>
        <Link href="/datos/wats">Ver índice de wats →</Link>
      </p>

      <div className="not-prose grid gap-2">
        {wats.map((w) => (
          <Link
            key={w.slug}
            href={`/datos/wats/${w.slug}`}
            className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm no-underline hover:bg-zinc-50"
          >
            <div>
              <div className="text-sm font-semibold text-zinc-900">{w.name}</div>
              <div className="text-xs text-zinc-600">{w.location}</div>
            </div>
            <div className="shrink-0 rounded-full border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700">
              {w.minutes} min
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
