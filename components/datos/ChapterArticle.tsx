import Link from 'next/link'
import { PrintButton } from '@/components/PrintButton'
import type { DatosChapter } from '@/data/datosChapters'

type NavLink = { href: string; label: string }
type Nav = { prev?: NavLink; next?: NavLink }

function Toc({ chapter }: { chapter: DatosChapter }) {
  return (
    <nav className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="text-sm font-semibold">Tabla de contenidos</div>
      <ul className="mt-2 space-y-1 text-sm">
        {chapter.sections.map((s) => (
          <li key={s.id}>
            <a className="text-zinc-700 hover:text-zinc-900 hover:underline" href={`#${s.id}`}>
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function Tips({ tips }: { tips: { title: string; bullets: string[] }[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {tips.map((t, i) => (
        <div key={i} className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="text-sm font-semibold text-emerald-900">{t.title}</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-emerald-900/90">
            {t.bullets.map((b, idx) => (
              <li key={idx}>{b}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export function ChapterArticle({ chapter, nav }: { chapter: DatosChapter; nav?: Nav }) {
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2" data-print-hide="1">
          <Link
            href="/datos"
            className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 shadow-sm hover:bg-zinc-100"
          >
            ← Índice
          </Link>
          <PrintButton />
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">{chapter.title}</h1>
        <p className="text-zinc-700">{chapter.description}</p>
      </header>

      <Toc chapter={chapter} />

      <div className="space-y-10">
        {chapter.sections.map((s) => (
          <section key={s.id} className="space-y-3">
            <h2 id={s.id} className="text-xl font-semibold">
              {s.title}
            </h2>
            {s.paragraphs.map((p, idx) => (
              <p key={idx} className="text-zinc-700">
                {p}
              </p>
            ))}
            {s.bullets?.length ? (
              <ul className="list-disc space-y-1 pl-5 text-zinc-700">
                {s.bullets.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            ) : null}
            {s.tips?.length ? <Tips tips={s.tips} /> : null}
          </section>
        ))}
      </div>

      <footer className="border-t border-zinc-200 pt-4" data-print-hide="1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {nav?.prev ? (
              <Link
                href={nav.prev.href}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50"
              >
                ← Anterior
              </Link>
            ) : null}

            <Link
              href="/datos"
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50"
            >
              Índice
            </Link>

            {nav?.next ? (
              <Link
                href={nav.next.href}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50"
              >
                Siguiente →
              </Link>
            ) : null}
          </div>

          <div className="text-[11px] text-zinc-500">
            {nav?.prev ? `← ${nav.prev.label}` : null}
            {nav?.prev && nav?.next ? ' · ' : null}
            {nav?.next ? `${nav.next.label} →` : null}
          </div>
        </div>
      </footer>
    </article>
  )
}
