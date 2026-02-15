import { ChapterArticle } from '@/components/datos/ChapterArticle'
import { DATOS_CHAPTER_BY_SLUG } from '@/data/datosChapters'

export const dynamic = 'force-static'

export default function SevenElevenPage() {
  const chapter = DATOS_CHAPTER_BY_SLUG.get('7-eleven')
  if (!chapter) return null
  return <ChapterArticle chapter={chapter} />
}
