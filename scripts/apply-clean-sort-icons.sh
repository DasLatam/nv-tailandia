#!/usr/bin/env bash
set -euo pipefail

echo "==> 1) Overwrite scripts/build-places.mjs (skip header-row + unique ids)"
cat <<'JS' > scripts/build-places.mjs
import fs from "fs";
import path from "path";
import Papa from "papaparse";

const inCsv = path.join(process.cwd(), "data", "Hoja8.csv");
const outJson = path.join(process.cwd(), "public", "places.json");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function slugify(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function pick(r, key) {
  return (r[key] ?? "").toString().trim();
}

// Detecta la fila que se coló como “títulos”
function isHeaderLikeRow(r) {
  const name = pick(r, "Nombre de Actividad").toLowerCase();
  const city = pick(r, "Ciudad").toLowerCase();
  const cat = pick(r, "Categoría").toLowerCase();

  const looksLikeHeader =
    name.includes("nombre") && name.includes("actividad") &&
    city === "ciudad" &&
    (cat.includes("categor") || cat === "categoria");

  return looksLikeHeader;
}

async function geocode(q) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "nv-tailandia/1.0 (contact: ariel@baudry.com.ar)",
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data?.length) return null;
  return { lat: Number(data[0].lat), lng: Number(data[0].lon) };
}

(async () => {
  if (!fs.existsSync(inCsv)) {
    console.error("❌ No encuentro:", inCsv);
    process.exit(1);
  }

  const csvText = fs.readFileSync(inCsv, "utf8");
  const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });

  const rows = (parsed.data || [])
    .filter((r) => pick(r, "Nombre de Actividad").length)
    .filter((r) => !isHeaderLikeRow(r));

  const out = [];
  const idCounts = new Map();

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];

    const name = pick(r, "Nombre de Actividad");
    const city = pick(r, "Ciudad");
    const category = pick(r, "Categoría");
    const duration = pick(r, "Tiempo Estimado");
    const short = pick(r, "Descripción");
    const long = pick(r, "Descripción Amplia");

    const baseId = `${slugify(city)}__${slugify(name)}`;
    const count = (idCounts.get(baseId) || 0) + 1;
    idCounts.set(baseId, count);
    const id = count === 1 ? baseId : `${baseId}-${count}`;

    // Mantener lo que haya (si luego enriquecés imágenes se reemplaza)
    const image = `https://source.unsplash.com/featured/?${encodeURIComponent(`${name} ${city} thailand`)}`;

    const q = `${name}, ${city}, Thailand`;
    const geo = await geocode(q);
    await sleep(1100);

    out.push({
      id,
      name,
      city,
      category,
      duration,
      short,
      long,
      image,
      lat: geo?.lat ?? null,
      lng: geo?.lng ?? null,
    });

    console.log(`[${i + 1}/${rows.length}] ${id}`);
  }

  fs.mkdirSync(path.dirname(outJson), { recursive: true });
  fs.writeFileSync(outJson, JSON.stringify(out, null, 2), "utf8");
  console.log("✅ places.json generado:", outJson);
})();
JS

echo "==> 2) Overwrite src/components/MapPage.tsx (sort by name)"
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

function byName(a: Place, b: Place) {
  return (a.name || "").localeCompare(b.name || "", "es", { sensitivity: "base" });
}

export default function MapPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [visibleIds, setVisibleIds] = useState<Set<string> | null>(null);
  const [selected, setSelected] = useState<Place | null>(null);
  const [query, setQuery] = useState("");

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

    // filtro por visibles
    if (visibleIds) base = base.filter((p) => visibleIds.has(p.id));

    // filtro texto
    if (q) {
      base = base.filter((p) => {
        const hay = `${p.name} ${p.city} ${p.category} ${p.short}`.toLowerCase();
        return hay.includes(q);
      });
    }

    // ✅ orden por nombre
    return [...base].sort(byName);
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

echo "==> 3) Overwrite src/components/MapView.tsx (category icons)"
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
import { useEffect, useMemo, useRef } from "react";
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
    // dejamos default como fallback
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

function MapReady({ onMapReady }: { onMapReady: (map: any) => void }) {
  const map = useMap();
  const did = useRef(false);
  useEffect(() => {
    if (did.current) return;
    did.current = true;
    onMapReady(map);
  }, [map, onMapReady]);
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

// Iconos simples por categoría (sin exagerar)
function iconEmojiFor(place: Place) {
  const t = `${place.category || ""} ${place.name || ""}`.toLowerCase();

  if (t.includes("vuelo") || t.includes("flight") || t.includes("aeropuerto")) return "✈️";
  if (t.includes("hotel") || t.includes("resort") || t.includes("hostel") || t.includes("novotel") || t.includes("column")) return "🏨";
  if (t.includes("templo") || t.includes("wat ") || t.includes("pagoda") || t.includes("buda")) return "🛕";
  if (t.includes("shopping") || t.includes("mercado") || t.includes("mall") || t.includes("compras") || t.includes("market")) return "🛍️";
  if (t.includes("comida") || t.includes("food") || t.includes("café") || t.includes("cafe") || t.includes("restaurant") || t.includes("gastr")) return "🍜";

  return "📍";
}

function makeIcon(emoji: string) {
  // DivIcon simple y legible
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 28px; height: 28px;
        border-radius: 999px;
        background: rgba(255,255,255,0.95);
        border: 1px solid rgba(17,24,39,0.25);
        display:flex; align-items:center; justify-content:center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.18);
        font-size: 16px;
      ">${emoji}</div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -12],
    tooltipAnchor: [0, -12],
  });
}

export default function MapView({ places, onVisibleIdsChange, onOpenDetail, onMapReady }: Props) {
  const center: [number, number] = [13.7563, 100.5018];

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
    >
      <FixLeafletIcons />
      <MapReady onMapReady={onMapReady} />
      <InvalidateSizeOnMount />
      <BoundsWatcher places={markers} onVisibleIdsChange={onVisibleIdsChange} />

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markers.map((p: any) => {
        const thumb = p.thumb || p.image || "/placeholder.svg";
        const icon = makeIcon(iconEmojiFor(p));

        return (
          <Marker key={p.id} position={[p.lat as number, p.lng as number]} icon={icon}>
            {/* Tooltip (hover) */}
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
              </div>
            </Tooltip>

            {/* Popup (click) */}
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
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
TSX

echo "==> 4) Regenerate places.json (removes the header-like item)"
node scripts/build-places.mjs

echo "✅ Done. Now:"
echo "  npm run dev"
echo "Then commit/push:"
echo "  git add scripts/build-places.mjs public/places.json src/components/MapPage.tsx src/components/MapView.tsx"
echo "  git commit -m \"Clean dataset header row, sort sidebar by name, and add category icons\""
echo "  git push"
