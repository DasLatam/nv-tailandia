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
    <aside className="w-[380px] border-r bg-white h-full flex flex-col">
      <div className="p-4 border-b sticky top-0 bg-white z-10">
        <div className="text-lg font-semibold">NV Tailandia</div>
        <div className="text-sm opacity-70">
          Lista: {shown} / {total} (zoom in → solo visibles)
        </div>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar (templo, masaje, Phuket...)"
          className="mt-3 w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <div className="flex-1 overflow-auto">
        {items.map((p) => (
          <button
            key={p.id}
            onClick={() => onPick(p)}
            className="w-full text-left px-4 py-3 border-b hover:bg-gray-50"
          >
            <div className="font-medium">{p.name}</div>
            <div className="text-sm opacity-70">
              {p.city} • {p.category} • {p.duration}
            </div>
            <div className="text-sm mt-1 line-clamp-2">{p.short}</div>
          </button>
        ))}
      </div>
    </aside>
  );
}
