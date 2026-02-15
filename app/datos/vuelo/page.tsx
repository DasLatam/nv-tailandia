import Link from 'next/link'
import { ContinueBlock } from '@/components/datos/ContinueBlock'
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

export default function DatosReadingIndexPage() {
  const chapters = DATOS_CHAPTERS.map((c) => {
    const words = chapterWordCount(c)
    const minutes = estimateReadingMinutes(words)
    return { slug: c.slug, title: c.title, description: c.description, minutes }
  })

  const wats = WATS.map((w) => {
    const minutes = estimateReadingMinutes(watWordCount(w))
    return { slug: w.slug, name: w.name, location: w.city, minutes }
  })

  const chaptersTotal = chapters.reduce((a, c) => a + c.minutes, 0)
  const watsTotal = wats.reduce((a, w) => a + w.minutes, 0)

  return (
    <div className="prose prose-zinc max-w-none">
      <h1>Índice de lectura</h1>
      <p>
        Este índice muestra los capítulos y el tiempo estimado (a ~220 palabras/min). Podés usarlo como “portada” para
        arrancar rápido. La lectura funciona sin conexión una vez sincronizado.
      </p>

      <ContinueBlock />

      <div className="not-prose mt-4 rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-800 shadow-sm">
        <div className="font-semibold">Tiempo total estimado</div>
        <div className="mt-1 text-zinc-700">
          Capítulos: <strong>{chaptersTotal} min</strong> · Wats: <strong>{watsTotal} min</strong>
        </div>
      </div>

      <h2>Capítulos</h2>
      <div className="not-prose grid gap-2">
        {chapters.map((c) => (
          <Link
            key={c.slug}
            href={`/datos/${c.slug}`}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-zinc-50 no-underline"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-semibold text-zinc-900">{c.title}</span>
              <span className="text-xs text-zinc-600">{c.minutes} min</span>
            </div>
            <div className="mt-0.5 text-xs text-zinc-700">{c.description}</div>
          </Link>
        ))}
        <Link
          href="/datos/wats"
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-zinc-50 no-underline"
        >
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-semibold text-zinc-900">Wats (índice)</span>
            <span className="text-xs text-zinc-600">{watsTotal} min</span>
          </div>
          <div className="mt-0.5 text-xs text-zinc-700">Entrá por templo o leelos en orden.</div>
        </Link>
      </div>

      <h2>Wats</h2>
      <div className="not-prose grid gap-2">
        {wats.map((w) => (
          <Link
            key={w.slug}
            href={`/datos/wats/${w.slug}`}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-zinc-50 no-underline"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-semibold text-zinc-900">{w.name}</span>
              <span className="text-xs text-zinc-600">{w.minutes} min</span>
            </div>
            <div className="mt-0.5 text-xs text-zinc-700">{w.location}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
