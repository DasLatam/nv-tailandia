import { ChapterArticle } from '@/components/datos/ChapterArticle'
import { DATOS_CHAPTER_BY_SLUG } from '@/data/datosChapters'

export const dynamic = 'force-static'

export default function ExperienciasPage() {
  const chapter = DATOS_CHAPTER_BY_SLUG.get('experiencias')
  if (!chapter) return null
  return <ChapterArticle chapter={chapter} />
}
