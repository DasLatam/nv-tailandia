import { ChapterArticle } from '@/components/datos/ChapterArticle'
import { DATOS_CHAPTERS, DATOS_CHAPTER_BY_SLUG } from '@/data/datosChapters'

export const dynamic = 'force-static'

export default function SevenElevenPage() {
  const chapter = DATOS_CHAPTER_BY_SLUG.get('7-eleven')
  if (!chapter) return null

  const idx = DATOS_CHAPTERS.findIndex((c) => c.slug === '7-eleven')
  const prev = idx > 0 ? DATOS_CHAPTERS[idx - 1] : null

  // Último capítulo -> siguiente es Wats (índice)
  const next =
    idx >= 0 && idx < DATOS_CHAPTERS.length - 1
      ? DATOS_CHAPTERS[idx + 1]
      : { slug: 'wats', title: 'Wats (guía por templo)' }

  const nav = {
    prev: prev ? { href: `/datos/${prev.slug}`, label: prev.title } : undefined,
    next: next ? { href: next.slug === 'wats' ? '/datos/wats' : `/datos/${next.slug}`, label: next.title } : undefined
  }

  return <ChapterArticle chapter={chapter} nav={nav} />
}
