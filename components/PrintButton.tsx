'use client'

export function PrintButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={
        className ??
        'rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-800 shadow-sm hover:bg-zinc-100'
      }
      title="Imprimir / Guardar PDF"
      onClick={() => {
        try {
          window.print()
        } catch {
          // ignore
        }
      }}
    >
      Imprimir / PDF
    </button>
  )
}
