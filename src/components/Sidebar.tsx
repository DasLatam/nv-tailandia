"use client";

import type { Place } from "./MapPage";

export default function Sidebar({
  total,
  shown,
  query,
  setQuery,
  items,
  onPick,
}: {
  total: number;
  shown: number;
  query: string;
  setQuery: (v: string) => void;
  items: Place[];
  onPick: (p: Place) => void;
}) {
  return (
    <aside className="w-[440px] border-r bg-white h-full flex flex-col z-[900]">
      <div className="p-4 border-b sticky top-0 bg-white z-10">
        <div className="text-lg font-semibold">NV Tailandia</div>
        <div className="text-sm opacity-70">
          Lista: {shown} / {total} • Click abre detalle
        </div>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar (templo, masaje, Phuket...)"
          className="mt-3 w-full rounded-md border px-3 py-2 text-sm"
        />

        <div className="text-xs opacity-60 mt-2">
          Zoom out: lista completa • Zoom in: solo puntos visibles
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {items.map((p: any) => {
          const thumb = p.thumb || p.image || "/placeholder.svg";
          return (
            <button
              key={p.id}
              onClick={() => onPick(p)}
              className="w-full text-left px-4 py-3 border-b hover:bg-gray-50"
            >
              <div className="flex gap-3">
                <img
                  src={thumb}
                  alt={p.name}
                  className="w-16 h-16 rounded-md object-cover bg-gray-100 flex-shrink-0"
                  loading="lazy"
                  onError={(e) => ((e.currentTarget as HTMLImageElement).src = "/placeholder.svg")}
                />

                <div className="min-w-0">
                  <div className="font-medium truncate">{p.name}</div>
                  <div className="text-sm opacity-70 truncate">
                    {p.city} • {p.category} • {p.duration}
                  </div>
                  <div className="text-sm mt-1 line-clamp-2">{p.short}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
