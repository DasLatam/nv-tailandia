#!/usr/bin/env bash
set -euo pipefail

echo "==> Add placeholder image"
cat <<'SVG' > public/placeholder.svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" x2="1">
      <stop offset="0" stop-color="#f3f4f6"/>
      <stop offset="1" stop-color="#e5e7eb"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <g fill="#6b7280" font-family="Arial, Helvetica, sans-serif">
    <text x="60" y="140" font-size="48" font-weight="700">NV Tailandia</text>
    <text x="60" y="210" font-size="28">Imagen no disponible</text>
    <text x="60" y="260" font-size="22">Podés curar la URL en el dataset más adelante</text>
  </g>
</svg>
SVG

echo "==> Overwrite src/components/MapView.tsx (fix pan/zoom + map sizing)"
cat <<'TSX' > src/components/MapView.tsx
"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useMemo } from "react";
import type { Place } from "./MapPage";

type Props = {
  places: Place[];
  onPick: (p: Place) => void;
  onVisibleIdsChange: (ids: Set<string> | null) => void;
};

function FixLeafletIcons() {
  useEffect(() => {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);
  return null;
}

// ✅ Important for production: when map mounts after hydration (ClientOnly),
// Leaflet can compute wrong size -> broken pan/zoom. invalidateSize fixes it.
function InvalidateSizeOnMount() {
  const map = useMap();
  useEffect(() => {
    const t1 = setTimeout(() => map.invalidateSize(), 0);
    const t2 = setTimeout(() => map.invalidateSize(), 250);
    const t3 = setTimeout(() => map.invalidateSize(), 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [map]);
  return null;
}

function BoundsWatcher({
  places,
  onVisibleIdsChange,
}: {
  places: Place[];
  onVisibleIdsChange: (ids: Set<string> | null) => void;
}) {
  const map = useMapEvents({
    moveend: () => update(),
    zoomend: () => update(),
  });

  const update = () => {
    const z = map.getZoom();

    // Zoom país o más abierto -> sidebar muestra TODO
    if (z <= 6) {
      onVisibleIdsChange(null);
      return;
    }

    const b = map.getBounds();
    const ids = new Set<string>();
    for (const p of places) {
      if (p.lat == null || p.lng == null) continue;
      if (b.contains([p.lat, p.lng])) ids.add(p.id);
    }
    onVisibleIdsChange(ids);
  };

  useEffect(() => update(), [places.length]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

export default function MapView({ places, onPick, onVisibleIdsChange }: Props) {
  const center: [number, number] = [13.7563, 100.5018]; // Bangkok

  // Filtramos por seguridad (lat/lng null rompe markers)
  const markers = useMemo(
    () => places.filter((p) => typeof p.lat === "number" && typeof p.lng === "number"),
    [places]
  );

  return (
    <MapContainer
      center={center}
      zoom={6}
      className="h-full w-full"
      // ✅ Make interactions explicit
      scrollWheelZoom={true}
      doubleClickZoom={true}
      dragging={true}
      touchZoom={true}
      zoomControl={true}
    >
      <FixLeafletIcons />
      <InvalidateSizeOnMount />
      <BoundsWatcher places={markers} onVisibleIdsChange={onVisibleIdsChange} />

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markers.map((p) => (
        <Marker
          key={p.id}
          position={[p.lat as number, p.lng as number]}
          eventHandlers={{
            click: () => onPick(p), // Click -> abre Drawer
          }}
        />
      ))}
    </MapContainer>
  );
}
TSX

echo "==> Overwrite src/components/PlaceDrawer.tsx (z-index + image fallback)"
cat <<'TSX' > src/components/PlaceDrawer.tsx
"use client";

import { useEffect, useState } from "react";
import type { Place } from "./MapPage";

export default function PlaceDrawer({
  place,
  onClose,
}: {
  place: Place | null;
  onClose: () => void;
}) {
  const [imgSrc, setImgSrc] = useState<string>("/placeholder.svg");

  useEffect(() => {
    if (!place) return;
    setImgSrc(place.image || "/placeholder.svg");
  }, [place]);

  if (!place) return null;

  return (
    <div className="absolute right-4 top-4 bottom-4 w-[460px] bg-white shadow-xl rounded-xl overflow-hidden border z-[1000]">
      <div className="flex items-start justify-between px-4 py-3 border-b gap-3 bg-white">
        <div>
          <div className="font-semibold leading-tight">{place.name}</div>
          <div className="text-sm opacity-70">
            {place.city} • {place.category} • {place.duration}
          </div>
          <div className="text-xs opacity-60 mt-1">Tip: click en otro punto para cambiar de detalle</div>
        </div>

        <button
          onClick={onClose}
          className="text-sm px-3 py-1 rounded-md border hover:bg-gray-50"
        >
          Cerrar
        </button>
      </div>

      <div className="h-52 bg-gray-100">
        <img
          src={imgSrc}
          alt={place.name}
          className="h-52 w-full object-cover"
          loading="lazy"
          onError={() => setImgSrc("/placeholder.svg")}
        />
      </div>

      <div className="p-4 overflow-auto h-[calc(100%-13rem)]">
        <div className="text-sm font-medium">Resumen</div>
        <div className="text-sm mt-1">{place.short || "—"}</div>

        <div className="text-sm font-medium mt-4">Detalle</div>
        <div className="text-sm mt-1 whitespace-pre-line">{place.long || "—"}</div>

        {place.lat != null && place.lng != null && (
          <div className="text-xs opacity-60 mt-4">
            Coordenadas: {place.lat.toFixed(5)}, {place.lng.toFixed(5)}
          </div>
        )}
      </div>
    </div>
  );
}
TSX

echo "==> Overwrite src/components/Sidebar.tsx (z-index + UX hint)"
cat <<'TSX' > src/components/Sidebar.tsx
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
    <aside className="w-[380px] border-r bg-white h-full flex flex-col z-[900]">
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
TSX

echo "✅ Done. Now run:"
echo "   npm run dev"
echo "Then commit/push:"
echo "   git add public/placeholder.svg src/components/MapView.tsx src/components/PlaceDrawer.tsx src/components/Sidebar.tsx"
echo "   git commit -m \"Fix prod map interactions + drawer + image fallback\""
echo "   git push"
