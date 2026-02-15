import Link from 'next/link'
import { PrintButton } from '@/components/PrintButton'
import { ReadingProgress } from '@/components/datos/ReadingProgress'

export const dynamic = 'force-static'

export default function DatosLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-dvh bg-zinc-50">
      <div className="flex h-dvh min-h-0 flex-col">
        <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur" data-print-hide="1">
          <div className="mx-auto flex max-w-[860px] items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-sm font-semibold tracking-tight">
                nv-tailandia
              </Link>
              <span className="text-xs text-zinc-500">/ datos</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/datos"
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 shadow-sm hover:bg-zinc-100"
              >
                Índice
              </Link>
              <Link
                href="/datos/vuelo"
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 shadow-sm hover:bg-zinc-100"
              >
                Modo vuelo
              </Link>
              <PrintButton />
            </div>
          </div>
        </header>

        <div data-datos-scroll className="min-h-0 flex-1 overflow-auto overscroll-contain">
          <div className="mx-auto max-w-[860px] px-4 py-6">
            <ReadingProgress />
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
