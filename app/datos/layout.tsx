import Link from 'next/link'
import { ReadingProgress } from '@/components/datos/ReadingProgress'
import { AutoOfflineWarmup } from '@/components/pwa/AutoOfflineWarmup'

export const dynamic = 'force-static'

export default function DatosLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-white text-zinc-900">
      <ReadingProgress />
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-2">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Link href="/" className="hover:text-zinc-800">
              nv-tailandia
            </Link>
            <span>/</span>
            <span className="text-zinc-800">datos</span>
          </div>

          <nav className="flex items-center gap-2">
            <Link
              href="/datos"
              className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 shadow-sm hover:bg-zinc-50"
            >
              Índice
            </Link>
            <Link
              href="/datos/vuelo"
              className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 shadow-sm hover:bg-zinc-50"
            >
              Modo vuelo
            </Link>
            <AutoOfflineWarmup compact />
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-4 pb-16">{children}</main>
    </div>
  )
}
