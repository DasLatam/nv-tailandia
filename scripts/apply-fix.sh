#!/usr/bin/env bash
set -euo pipefail

echo "==> Overwrite scripts/build-places.mjs"
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
  return {
    lat: Number(data[0].lat),
    lng: Number(data[0].lon),
    label: data[0].display_name,
  };
}

function pick(r, key) {
  // soporta variantes de headers si cambian levemente
  return (r[key] ?? "").toString().trim();
}

(async () => {
  if (!fs.existsSync(inCsv)) {
    console.error("❌ No encuentro el CSV:", inCsv);
    process.exit(1);
  }

  const csvText = fs.readFileSync(inCsv, "utf8");
  const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });

  if (parsed.errors?.length) {
    console.warn("⚠️ CSV parse warnings:", parsed.errors.slice(0, 5));
  }

  const rows = (parsed.data || []).filter((r) => pick(r, "Nombre de Actividad").length);

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

    // Si se repite, agregamos sufijo -2, -3, etc.
    const id = count === 1 ? baseId : `${baseId}-${count}`;

    // Imagen MVP sin keys (se puede reemplazar luego por URLs curadas)
    const image = `https://source.unsplash.com/featured/?${encodeURIComponent(
      `${name} ${city} thailand`
    )}`;

    const query = `${name}, ${city}, Thailand`;

    const geo = await geocode(query);
    await sleep(1100); // ~1 req/s para ser amable con Nominatim

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
      geocodeLabel: geo?.label ?? null,
    });

    const status = geo ? "OK" : "NO RESULT";
    console.log(`[${i + 1}/${rows.length}] ${status} -> ${id}`);
  }

  fs.mkdirSync(path.dirname(outJson), { recursive: true });
  fs.writeFileSync(outJson, JSON.stringify(out, null, 2), "utf8");
  console.log("✅ Wrote:", outJson);

  // Check duplicates (should be none)
  const dupes = [];
  const seen = new Set();
  for (const p of out) {
    if (seen.has(p.id)) dupes.push(p.id);
    seen.add(p.id);
  }
  if (dupes.length) {
    console.log("❌ Duplicate IDs still exist:", dupes.slice(0, 20));
    process.exit(2);
  } else {
    console.log("✅ Duplicate ID check: OK (0 duplicates)");
  }
})();
JS

echo "==> Overwrite src/components/MapView.tsx"
mkdir -p src/components
cat <<'TSX' > src/components/MapView.tsx
"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useEffect } from "react";
import type { Place } from "./MapPage";

type Props = {
  places: Place[];
  onPick: (p: Place) => void;
  onVisibleIdsChange: (ids: Set<string> | null) => void;
};

function FixLeafletIcons() {
  useEffect(() => {
    // Fix default marker icons in Next bundlers
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

    // Zoom país o más abierto -> mostrar TODOS en sidebar
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

  useEffect(() => {
    update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places.length]);

  return null;
}

export default function MapView({ places, onPick, onVisibleIdsChange }: Props) {
  // Centro general en Tailandia (Bangkok)
  const center: [number, number] = [13.7563, 100.5018];

  return (
    <MapContainer center={center} zoom={6} className="h-full w-full">
      <FixLeafletIcons />
      <BoundsWatcher places={places} onVisibleIdsChange={onVisibleIdsChange} />

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {places.map((p) => (
        <Marker
          key={p.id}
          position={[p.lat as number, p.lng as number]}
          eventHandlers={{
            click: () => onPick(p), // Click -> abre el Drawer (detalle)
          }}
        />
      ))}
    </MapContainer>
  );
}
TSX

echo "==> Regenerate public/places.json"
node scripts/build-places.mjs

echo "==> Quick duplicate check"
node -e "const p=require('./public/places.json'); const m=new Map(); for(const x of p){m.set(x.id,(m.get(x.id)||0)+1)} const d=[...m.entries()].filter(([,c])=>c>1); console.log('dupes:', d.length); if(d.length) console.log(d.slice(0,20));"

echo "✅ Done. Now restart dev server: npm run dev"
