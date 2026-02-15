import { ChapterArticle } from '@/components/datos/ChapterArticle'
import { DATOS_CHAPTER_BY_SLUG } from '@/data/datosChapters'

export const dynamic = 'force-static'

export default function IdiomaPage() {
  const chapter = DATOS_CHAPTER_BY_SLUG.get('idioma')
  if (!chapter) return null
  return <ChapterArticle chapter={chapter} />
}
