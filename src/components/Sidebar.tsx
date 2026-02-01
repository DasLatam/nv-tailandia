"use client";

import type { Place } from "./MapPage";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/1NNplPVYzFmUsQFoqF6D4pz4bCqbWky59u90YVnU-l5I/edit?usp=sharing";

export default function Sidebar({
  total,
  shown,
  query,
  setQuery,
  filterCity,
  setFilterCity,
  filterCategory,
  setFilterCategory,
  cities,
  categories,
  items,
  selected,
  onPick,
}: {
  total: number;
  shown: number;
  query: string;
  setQuery: (v: string) => void;
  filterCity: string;
  setFilterCity: (v: string) => void;
  filterCategory: string;
  setFilterCategory: (v: string) => void;
  cities: string[];
  categories: string[];
  items: Place[];
  selected: Place | null;
  onPick: (p: Place) => void;
}) {
  return (
    <aside className="w-[420px] min-w-[360px] border-r border-neutral-200 bg-neutral-50/80 h-full flex flex-col z-[900] shadow-sm">
      <div className="p-4 border-b border-neutral-200 sticky top-0 bg-white/95 backdrop-blur z-10">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">NV Tailandia</h1>
          <a
            href={SHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-2.5 py-1.5 rounded-md border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors"
            title="Los lugares se gestionan desde la Google Sheet"
          >
            Añadir lugar
          </a>
        </div>
        <p className="text-sm text-neutral-500 mt-1">
          {shown} de {total} lugares • Clic abre detalle
        </p>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar (templo, masaje, Phuket...)"
          className="mt-3 w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-white"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="rounded-lg border border-neutral-200 px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 min-w-0 flex-1"
            title="Filtrar por ciudad"
          >
            <option value="">Todas las ciudades</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-lg border border-neutral-200 px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 min-w-0 flex-1"
            title="Filtrar por categoría"
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <p className="text-xs text-neutral-400 mt-2">
          Zoom out: lista completa • Zoom in: solo puntos visibles
        </p>
      </div>

      <div className="flex-1 overflow-auto">
        {items.map((p) => {
          const thumb = p.thumb || p.image || "/placeholder.svg";
          const isSelected = selected?.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onPick(p)}
              className={`w-full text-left px-4 py-3.5 border-b border-neutral-100 transition-colors flex gap-4 items-center ${
                isSelected
                  ? "bg-amber-50 border-l-4 border-l-amber-500 border-b-neutral-200"
                  : "hover:bg-white border-l-4 border-l-transparent"
              }`}
            >
              <img
                src={thumb}
                alt={p.name}
                className="w-20 h-20 rounded-lg object-cover bg-neutral-100 flex-shrink-0 shadow-sm"
                loading="lazy"
                onError={(e) => ((e.currentTarget as HTMLImageElement).src = "/placeholder.svg")}
              />
              <div className="min-w-0 flex-1">
                <div className={`font-semibold truncate ${isSelected ? "text-amber-900" : "text-neutral-800"}`}>
                  {p.name}
                </div>
                <div className="text-sm text-neutral-500 truncate">
                  {p.city} • {p.category} • {p.duration}
                </div>
                <div className="text-sm text-neutral-600 mt-0.5 line-clamp-2">{p.short}</div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
