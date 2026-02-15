import { ChapterArticle } from '@/components/datos/ChapterArticle'
import { DATOS_CHAPTER_BY_SLUG } from '@/data/datosChapters'

export const dynamic = 'force-static'

export default function ConsejosPage() {
  const chapter = DATOS_CHAPTER_BY_SLUG.get('consejos')
  if (!chapter) return null
  return <ChapterArticle chapter={chapter} />
}
