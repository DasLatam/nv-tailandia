#!/usr/bin/env bash
set -euo pipefail

echo "==> 1) Enricher: Wikimedia Commons + Openverse + report faltantes"
cat <<'JS' > scripts/enrich-images2.mjs
import fs from "fs";
import path from "path";

const placesFile = path.join(process.cwd(), "public", "places.json");
const outFile = path.join(process.cwd(), "public", "places.json");
const missingReport = path.join(process.cwd(), "data", "images_missing.csv");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function safe(s) {
  return (s || "").toString().trim();
}

function isGoodExisting(url) {
  if (!url) return false;
  const u = url.toLowerCase();
  if (u.includes("placeholder")) return false;
  if (u.includes("source.unsplash.com")) return false; // lo consideramos NO real
  return true;
}

async function commonsSearchImage(query) {
  const api = "https://commons.wikimedia.org/w/api.php";
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    generator: "search",
    gsrsearch: query,
    gsrlimit: "1",
    gsrnamespace: "6", // File:
    prop: "imageinfo",
    iiprop: "url",
    iiurlwidth: "360",
    iiurlheight: "360",
  });

  const url = `${api}?${params.toString()}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "nv-tailandia/1.0 (contact: ariel@baudry.com.ar)" },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const pages = data?.query?.pages;
  if (!pages) return null;

  const firstKey = Object.keys(pages)[0];
  const page = pages[firstKey];
  const info = page?.imageinfo?.[0];
  if (!info) return null;

  return {
    image: info.url || null,
    thumb: info.thumburl || null,
    source: `commons:${page.title}`,
  };
}

async function openverseSearch(query) {
  // API pública
  const url = `https://api.openverse.org/v1/images?q=${encodeURIComponent(query)}&page_size=1`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const r = data?.results?.[0];
  if (!r) return null;

  const image = r.url || null;
  const thumb = r.thumbnail || r.url || null;

  if (!thumb && !image) return null;

  return {
    image: image,
    thumb: thumb,
    source: `openverse:${r.id || "result"}`,
    license: r.license || null,
    creator: r.creator || null,
  };
}

function buildQueries(p) {
  const name = safe(p.name);
  const city = safe(p.city);
  // combinaciones
  return [
    `${name} ${city} Thailand`,
    `${name} Thailand`,
    `${name} ${city}`,
    `${name}`,
  ];
}

(async () => {
  if (!fs.existsSync(placesFile)) {
    console.error("❌ Missing:", placesFile);
    process.exit(1);
  }

  const places = JSON.parse(fs.readFileSync(placesFile, "utf8"));
  let updated = 0;
  let missing = 0;

  for (let i = 0; i < places.length; i++) {
    const p = places[i];

    // Si ya tiene thumb “real”, no tocamos
    if (isGoodExisting(p.thumb)) continue;

    const queries = buildQueries(p);

    // 1) Commons
    let hit = null;
    for (const q of queries) {
      hit = await commonsSearchImage(q);
      await sleep(120);
      if (hit?.thumb || hit?.image) break;
    }

    // 2) Openverse fallback
    if (!hit?.thumb && !hit?.image) {
      for (const q of queries) {
        hit = await openverseSearch(q);
        await sleep(200);
        if (hit?.thumb || hit?.image) break;
      }
    }

    if (hit?.thumb || hit?.image) {
      p.thumb = hit.thumb || hit.image || "/placeholder.svg";
      p.image = hit.image || hit.thumb || "/placeholder.svg";
      p.imageSource = hit.source;

      if (hit.license) p.imageLicense = hit.license;
      if (hit.creator) p.imageCreator = hit.creator;

      updated++;
    } else {
      missing++;
      // Si no hay imagen, dejamos placeholder (y NO unsplash)
      p.thumb = p.thumb || "/placeholder.svg";
      p.image = p.image || "/placeholder.svg";
      if (!p.imageSource) p.imageSource = "missing";
    }

    if ((i + 1) % 20 === 0) console.log(`Progress: ${i + 1}/${places.length}`);
  }

  fs.writeFileSync(outFile, JSON.stringify(places, null, 2), "utf8");

  // Reporte de faltantes (para curación manual)
  const header = "id,name,city,category\n";
  const rows = places
    .filter((p) => !isGoodExisting(p.thumb))
    .map((p) => `"${p.id}","${(p.name || "").replace(/"/g, '""')}","${(p.city || "").replace(/"/g, '""')}","${(p.category || "").replace(/"/g, '""')}"`)
    .join("\n");

  fs.mkdirSync(path.dirname(missingReport), { recursive: true });
  fs.writeFileSync(missingReport, header + rows + "\n", "utf8");

  console.log("✅ Updated:", updated);
  console.log("⚠️ Missing:", missing);
  console.log("Wrote:", outFile);
  console.log("Missing report:", missingReport);
})();
JS

echo "==> 2) Drawer pro: muestra TODO + duration + descripcion amplia siempre"
cat <<'TSX' > src/components/PlaceDrawer.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import type { Place } from "./MapPage";

type AnyPlace = Place & {
  thumb?: string;
  imageSource?: string;
  imageLicense?: string;
  imageCreator?: string;
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-sm font-semibold">{label}</div>
      <div className="text-sm mt-1 whitespace-pre-line">{value || "—"}</div>
    </div>
  );
}

export default function PlaceDrawer({
  place,
  onClose,
}: {
  place: AnyPlace | null;
  onClose: () => void;
}) {
  const [imgSrc, setImgSrc] = useState<string>("/placeholder.svg");

  useEffect(() => {
    if (!place) return;
    setImgSrc(place.image || place.thumb || "/placeholder.svg");
  }, [place]);

  const meta = useMemo(() => {
    if (!place) return [];
    const items: string[] = [];
    if (place.imageSource && place.imageSource !== "missing") items.push(place.imageSource);
    if (place.imageCreator) items.push(`Autor: ${place.imageCreator}`);
    if (place.imageLicense) items.push(`Licencia: ${place.imageLicense}`);
    return items;
  }, [place]);

  if (!place) return null;

  return (
    <div className="absolute right-4 top-4 bottom-4 w-[560px] bg-white shadow-xl rounded-xl overflow-hidden border z-[1000]">
      <div className="flex items-start justify-between px-4 py-3 border-b gap-3 bg-white">
        <div className="min-w-0">
          <div className="font-semibold leading-tight text-lg truncate">
            {place.name || "—"}
          </div>
          <div className="text-sm opacity-70">
            {place.city || "—"} • {place.category || "—"} • {place.duration || "—"}
          </div>
          {meta.length > 0 && (
            <div className="text-xs opacity-60 mt-1">{meta.join(" • ")}</div>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-sm px-3 py-1 rounded-md border hover:bg-gray-50"
        >
          Cerrar
        </button>
      </div>

      <div className="h-60 bg-gray-100">
        <img
          src={imgSrc}
          alt={place.name}
          className="h-60 w-full object-cover"
          loading="lazy"
          onError={() => setImgSrc("/placeholder.svg")}
        />
      </div>

      <div className="p-4 overflow-auto h-[calc(100%-15rem)]">
        <Field label="Nombre de Actividad" value={place.name || ""} />

        <div className="grid grid-cols-2 gap-4 mt-4">
          <Field label="Ciudad" value={place.city || ""} />
          <Field label="Categoría" value={place.category || ""} />
          <Field label="Tiempo estimado" value={place.duration || ""} />
          <Field
            label="Coordenadas"
            value={
              place.lat != null && place.lng != null
                ? `${place.lat.toFixed(5)}, ${place.lng.toFixed(5)}`
                : ""
            }
          />
        </div>

        <div className="mt-5">
          <Field label="Descripción" value={place.short || ""} />
        </div>

        <div className="mt-5">
          <Field label="Descripción amplia" value={place.long || ""} />
        </div>
      </div>
    </div>
  );
}
TSX

echo "==> 3) Run image enrichment now"
node scripts/enrich-images2.mjs

echo "✅ Done. Now:"
echo "  npm run dev   (revisar imágenes)"
echo "  git add scripts/enrich-images2.mjs public/places.json data/images_missing.csv src/components/PlaceDrawer.tsx"
echo "  git commit -m \"Improve images (Commons+Openverse) and enrich detail drawer\""
echo "  git push"
