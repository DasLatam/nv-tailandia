#!/usr/bin/env bash
set -euo pipefail

echo "==> 1) Favicon 🧳 (Next App Router icon.svg)"
cat <<'SVG' > src/app/icon.svg
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="#111827"/>
  <text x="50%" y="56%" text-anchor="middle" dominant-baseline="middle" font-size="34">🧳</text>
</svg>
SVG

echo "==> 2) MapPage: map instance + click sidebar => flyTo + open drawer"
cat <<'TSX' > src/components/MapPage.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import MapView from "./MapView";
import Sidebar from "./Sidebar";
import PlaceDrawer from "./PlaceDrawer";

export type Place = {
  id: string;
  name: string;
  city: string;
  category: string;
  duration: string;
  short: string;
  long: string;
  image: string;
  thumb?: string;
  imageSource?: string;
  lat: number | null;
  lng: number | null;
};

export default function MapPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [visibleIds, setVisibleIds] = useState<Set<string> | null>(null);
  const [selected, setSelected] = useState<Place | null>(null);
  const [query, setQuery] = useState("");

  // Leaflet map instance (client only)
  const mapRef = useRef<any>(null);

  useEffect(() => {
    fetch("/places.json")
      .then((r) => r.json())
      .then((data: Place[]) => setPlaces(data))
      .catch(() => setPlaces([]));
  }, []);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    let base = places;

    // visibleIds null => mostrar todo (zoom out)
    if (visibleIds) base = base.filter((p) => visibleIds.has(p.id));
    if (!q) return base;

    return base.filter((p) => {
      const hay = `${p.name} ${p.city} ${p.category} ${p.short}`.toLowerCase();
      return hay.includes(q);
    });
  }, [places, visibleIds, query]);

  const mappable = useMemo(
    () => places.filter((p) => typeof p.lat === "number" && typeof p.lng === "number"),
    [places]
  );

  function openDetail(p: Place, opts?: { fly?: boolean }) {
    setSelected(p);

    if (opts?.fly && mapRef.current && typeof p.lat === "number" && typeof p.lng === "number") {
      const targetZoom = Math.max(mapRef.current.getZoom?.() ?? 6, 12);
      mapRef.current.flyTo([p.lat, p.lng], targetZoom, { animate: true, duration: 0.8 });
    }
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-white">
      <Sidebar
        total={places.length}
        shown={shown.length}
        query={query}
        setQuery={setQuery}
        items={shown as any}
        onPick={(p) => openDetail(p, { fly: true })}
      />

      <div className="flex-1 relative">
        <MapView
          places={mappable as any}
          onVisibleIdsChange={(ids) => setVisibleIds(ids)}
          onMapReady={(map) => (mapRef.current = map)}
          onOpenDetail={(p) => openDetail(p, { fly: false })}
        />

        <PlaceDrawer place={selected as any} onClose={() => setSelected(null)} />
      </div>
    </div>
  );
}
TSX

echo "==> 3) MapView: hover tooltip + click popup + link to open drawer + map ready + invalidateSize"
cat <<'TSX' > src/components/MapView.tsx
"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useMemo } from "react";
import type { Place } from "./MapPage";

type Props = {
  places: Place[];
  onVisibleIdsChange: (ids: Set<string> | null) => void;
  onOpenDetail: (p: Place) => void;
  onMapReady: (map: any) => void;
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

export default function MapView({ places, onVisibleIdsChange, onOpenDetail, onMapReady }: Props) {
  const center: [number, number] = [13.7563, 100.5018]; // Bangkok

  const markers = useMemo(
    () => places.filter((p) => typeof p.lat === "number" && typeof p.lng === "number"),
    [places]
  );

  return (
    <MapContainer
      center={center}
      zoom={6}
      className="h-full w-full"
      scrollWheelZoom={true}
      doubleClickZoom={true}
      dragging={true}
      touchZoom={true}
      zoomControl={true}
      whenReady={(e) => onMapReady(e.target)}
    >
      <FixLeafletIcons />
      <InvalidateSizeOnMount />
      <BoundsWatcher places={markers} onVisibleIdsChange={onVisibleIdsChange} />

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markers.map((p: any) => {
        const thumb = p.thumb || p.image || "/placeholder.svg";
        return (
          <Marker key={p.id} position={[p.lat as number, p.lng as number]}>
            {/* POPUP CHICO: hover/rollover */}
            <Tooltip direction="top" opacity={1} offset={[0, -8]} sticky>
              <div style={{ width: 240 }}>
                <div style={{ fontWeight: 700, marginBottom: 2 }}>{p.name}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  {p.city} • {p.category} • {p.duration}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <img
                    src={thumb}
                    alt={p.name}
                    style={{ width: 72, height: 48, objectFit: "cover", borderRadius: 8, background: "#f3f4f6" }}
                    loading="lazy"
                    onError={(e) => (((e.currentTarget as HTMLImageElement).src = "/placeholder.svg"))}
                  />
                  <div style={{ fontSize: 12, lineHeight: 1.3, maxHeight: 48, overflow: "hidden" }}>
                    {p.short || "—"}
                  </div>
                </div>
                <div style={{ marginTop: 8, fontSize: 11, opacity: 0.75 }}>
                  Hover: info rápida • Click: ver resumen + detalle
                </div>
              </div>
            </Tooltip>

            {/* POPUP CHICO: click */}
            <Popup>
              <div style={{ width: 300 }}>
                <div style={{ fontWeight: 800 }}>{p.name}</div>
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
                  {p.city} • {p.category} • {p.duration}
                </div>

                <img
                  src={thumb}
                  alt={p.name}
                  style={{ width: "100%", height: 130, objectFit: "cover", borderRadius: 10, marginTop: 10, background: "#f3f4f6" }}
                  loading="lazy"
                  onError={(e) => (((e.currentTarget as HTMLImageElement).src = "/placeholder.svg"))}
                />

                <div style={{ marginTop: 10, fontSize: 13 }}>
                  <div style={{ fontWeight: 700 }}>Descripción</div>
                  <div style={{ marginTop: 3 }}>{p.short || "—"}</div>
                </div>

                <button
                  style={{
                    marginTop: 12,
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid #e5e7eb",
                    background: "white",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  onClick={() => onOpenDetail(p)}
                >
                  Ver detalle completo
                </button>

                <div style={{ marginTop: 8, fontSize: 11, opacity: 0.7 }}>
                  El detalle completo incluye descripción amplia + todo el CSV.
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
TSX

echo "==> 4) Sidebar: miniatura + click abre drawer y centra/zoom (lo maneja MapPage)"
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
TSX

echo "==> 5) Drawer: mostrar TODO el CSV de forma clara + imagen real si existe"
cat <<'TSX' > src/components/PlaceDrawer.tsx
"use client";

import { useEffect, useState } from "react";
import type { Place } from "./MapPage";

export default function PlaceDrawer({
  place,
  onClose,
}: {
  place: (Place & any) | null;
  onClose: () => void;
}) {
  const [imgSrc, setImgSrc] = useState<string>("/placeholder.svg");

  useEffect(() => {
    if (!place) return;
    setImgSrc(place.image || place.thumb || "/placeholder.svg");
  }, [place]);

  if (!place) return null;

  const source = place.imageSource ? `Fuente: ${place.imageSource}` : null;

  return (
    <div className="absolute right-4 top-4 bottom-4 w-[520px] bg-white shadow-xl rounded-xl overflow-hidden border z-[1000]">
      <div className="flex items-start justify-between px-4 py-3 border-b gap-3 bg-white">
        <div className="min-w-0">
          <div className="font-semibold leading-tight text-lg truncate">{place.name}</div>
          <div className="text-sm opacity-70">
            {place.city} • {place.category} • {place.duration}
          </div>
          {source && <div className="text-xs opacity-60 mt-1">{source}</div>}
        </div>

        <button
          onClick={onClose}
          className="text-sm px-3 py-1 rounded-md border hover:bg-gray-50"
        >
          Cerrar
        </button>
      </div>

      <div className="h-56 bg-gray-100">
        <img
          src={imgSrc}
          alt={place.name}
          className="h-56 w-full object-cover"
          loading="lazy"
          onError={() => setImgSrc("/placeholder.svg")}
        />
      </div>

      <div className="p-4 overflow-auto h-[calc(100%-14rem)]">
        <div className="text-sm font-semibold">Nombre de Actividad</div>
        <div className="text-sm mt-1">{place.name || "—"}</div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <div className="text-sm font-semibold">Ciudad</div>
            <div className="text-sm mt-1">{place.city || "—"}</div>
          </div>
          <div>
            <div className="text-sm font-semibold">Categoría</div>
            <div className="text-sm mt-1">{place.category || "—"}</div>
          </div>
          <div>
            <div className="text-sm font-semibold">Tiempo estimado</div>
            <div className="text-sm mt-1">{place.duration || "—"}</div>
          </div>
          <div>
            <div className="text-sm font-semibold">Coordenadas</div>
            <div className="text-sm mt-1">
              {place.lat != null && place.lng != null ? `${place.lat.toFixed(5)}, ${place.lng.toFixed(5)}` : "—"}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="text-sm font-semibold">Descripción</div>
          <div className="text-sm mt-1 whitespace-pre-line">{place.short || "—"}</div>
        </div>

        <div className="mt-5">
          <div className="text-sm font-semibold">Descripción amplia</div>
          <div className="text-sm mt-1 whitespace-pre-line">{place.long || "—"}</div>
        </div>
      </div>
    </div>
  );
}
TSX

echo "✅ UX applied. Now run locally:"
echo "   npm run dev"
echo "Then commit/push:"
echo "   git add src/app/icon.svg src/components/MapPage.tsx src/components/MapView.tsx src/components/Sidebar.tsx src/components/PlaceDrawer.tsx"
echo "   git commit -m \"Improve UX: hover tooltip + click popup link to detail + sidebar flyTo + suitcase favicon\""
echo "   git push"
