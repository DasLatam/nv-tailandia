import { ChapterArticle } from '@/components/datos/ChapterArticle'
import { DATOS_CHAPTER_BY_SLUG } from '@/data/datosChapters'

export const dynamic = 'force-static'

export default function AnimalesPage() {
  const chapter = DATOS_CHAPTER_BY_SLUG.get('animales')
  if (!chapter) return null
  return <ChapterArticle chapter={chapter} />
}
