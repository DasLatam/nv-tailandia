#!/usr/bin/env bash
set -euo pipefail

echo "==> 1) layout.tsx: título NV Tailandia"
cat <<'TSX' > src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NV Tailandia",
  description: "Mapa interactivo y guía visual del viaje a Tailandia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
TSX

echo "==> 2) build-places.mjs: tolerante a headers (Tiempo estimado / Descripción amplia) + limpia fila 'Nombre Ciudad Categoría'"
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

// Toma el primer header existente entre varias opciones
function pickAny(row, keys) {
  for (const k of keys) {
    const v = row?.[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return String(v).trim();
  }
  // Si existe pero vacío, devolvemos vacío (no null)
  for (const k of keys) {
    const v = row?.[k];
    if (v !== undefined && v !== null) return String(v).trim();
  }
  return "";
}

// Detecta la fila colada de títulos
function isHeaderLikeRow(row) {
  const name = pickAny(row, ["Nombre de Actividad", "Nombre Actividad", "Nombre"]).toLowerCase();
  const city = pickAny(row, ["Ciudad"]).toLowerCase();
  const cat = pickAny(row, ["Categoría", "Categoria"]).toLowerCase();

  return (
    name.includes("nombre") &&
    name.includes("actividad") &&
    city === "ciudad" &&
    (cat.includes("categor") || cat === "categoria")
  );
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
    .filter((r) => pickAny(r, ["Nombre de Actividad", "Nombre Actividad", "Nombre"]).length)
    .filter((r) => !isHeaderLikeRow(r));

  const out = [];
  const idCounts = new Map();

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];

    const name = pickAny(r, ["Nombre de Actividad", "Nombre Actividad", "Nombre"]);
    const city = pickAny(r, ["Ciudad"]);
    const category = pickAny(r, ["Categoría", "Categoria"]);

    // 👇 IMPORTANT: soporta variantes
    const duration = pickAny(r, ["Tiempo Estimado", "Tiempo estimado", "Tiempo", "Duración", "Duracion"]);
    const short = pickAny(r, ["Descripción", "Descripcion", "Descripción corta", "Descripcion corta"]);
    const long = pickAny(r, ["Descripción Amplia", "Descripción amplia", "Descripcion Amplia", "Descripcion amplia", "Detalle", "Detalles"]);

    const baseId = `${slugify(city)}__${slugify(name)}`;
    const count = (idCounts.get(baseId) || 0) + 1;
    idCounts.set(baseId, count);
    const id = count === 1 ? baseId : `${baseId}-${count}`;

    // placeholders (luego enrich reemplaza)
    const image = "/placeholder.svg";
    const thumb = "/placeholder.svg";

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
      thumb,
      lat: geo?.lat ?? null,
      lng: geo?.lng ?? null,
    });
  }

  fs.mkdirSync(path.dirname(outJson), { recursive: true });
  fs.writeFileSync(outJson, JSON.stringify(out, null, 2), "utf8");
  console.log("✅ places.json generado:", outJson, "items:", out.length);
})();
JS

echo "==> 3) enrich-images2.mjs: Commons + Openverse con filtro 'no accidentes' + overrides seguros para Vuelos"
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
  return true;
}

// 🔒 Filtro anti-accidentes (títulos/urls)
function looksBad(titleOrUrl = "") {
  const s = titleOrUrl.toLowerCase();
  return (
    s.includes("crash") ||
    s.includes("accident") ||
    s.includes("wreck") ||
    s.includes("disaster") ||
    s.includes("incident") ||
    s.includes("fatal") ||
    s.includes("shot down") ||
    s.includes("explosion")
  );
}

// ✅ Imágenes seguras y reales para Vuelos/Aeropuertos (estables)
const FLIGHT_SAFE = [
  {
    match: (p) => (p.name || "").toLowerCase().includes("vuelo") && (p.name || "").toLowerCase().includes("bangkok"),
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Suvarnabhumi_Airport_terminal.jpg/1280px-Suvarnabhumi_Airport_terminal.jpg",
    thumb: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Suvarnabhumi_Airport_terminal.jpg/320px-Suvarnabhumi_Airport_terminal.jpg",
    source: "commons:Suvarnabhumi Airport terminal",
  },
  {
    match: (p) => (p.name || "").toLowerCase().includes("vuelo") && (p.name || "").toLowerCase().includes("phuket"),
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Phuket_International_Airport_terminal.jpg/1280px-Phuket_International_Airport_terminal.jpg",
    thumb: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Phuket_International_Airport_terminal.jpg/320px-Phuket_International_Airport_terminal.jpg",
    source: "commons:Phuket International Airport terminal",
  },
  {
    match: (p) => (p.name || "").toLowerCase().includes("vuelo") && (p.name || "").toLowerCase().includes("chiang"),
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Chiang_Mai_International_Airport.jpg/1280px-Chiang_Mai_International_Airport.jpg",
    thumb: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Chiang_Mai_International_Airport.jpg/320px-Chiang_Mai_International_Airport.jpg",
    source: "commons:Chiang Mai International Airport",
  },
];

// Wikimedia Commons search
async function commonsSearchImage(query) {
  const api = "https://commons.wikimedia.org/w/api.php";
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    generator: "search",
    gsrsearch: query,
    gsrlimit: "3",
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

  // probamos hasta 3 resultados y elegimos uno que no parezca “malo”
  const keys = Object.keys(pages);
  for (const k of keys) {
    const page = pages[k];
    const info = page?.imageinfo?.[0];
    const title = page?.title || "";
    const img = info?.url || "";
    const thumb = info?.thumburl || "";

    if (!info) continue;
    if (looksBad(title) || looksBad(img) || looksBad(thumb)) continue;

    return {
      image: img || null,
      thumb: thumb || null,
      source: `commons:${title}`,
    };
  }

  return null;
}

// Openverse fallback
async function openverseSearch(query) {
  const url = `https://api.openverse.org/v1/images?q=${encodeURIComponent(query)}&page_size=3`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();

  for (const r of data?.results || []) {
    const image = r.url || null;
    const thumb = r.thumbnail || r.url || null;
    const title = r.title || "";
    const landing = r.foreign_landing_url || "";

    if (!image && !thumb) continue;
    if (looksBad(title) || looksBad(image || "") || looksBad(landing || "")) continue;

    return {
      image,
      thumb,
      source: `openverse:${r.id || "result"}`,
      license: r.license || null,
      creator: r.creator || null,
    };
  }

  return null;
}

function buildQueries(p) {
  const name = safe(p.name);
  const city = safe(p.city);

  // Para templos y lugares muy conocidos, esto funciona bastante bien
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

    // 0) Override seguro para vuelos
    const flightOverride = FLIGHT_SAFE.find((o) => o.match(p));
    if (flightOverride) {
      p.image = flightOverride.image;
      p.thumb = flightOverride.thumb;
      p.imageSource = flightOverride.source;
      updated++;
      continue;
    }

    // Si ya tiene imagen real, no tocamos
    if (isGoodExisting(p.thumb) && p.imageSource && p.imageSource !== "missing") continue;

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
      p.thumb = "/placeholder.svg";
      p.image = "/placeholder.svg";
      p.imageSource = "missing";
    }

    if ((i + 1) % 20 === 0) console.log(`Progress: ${i + 1}/${places.length}`);
  }

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(places, null, 2), "utf8");

  // Reporte de faltantes
  const header = "id,name,city,category\n";
  const rows = places
    .filter((p) => !isGoodExisting(p.thumb) || p.imageSource === "missing")
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

echo "==> 4) Rebuild places.json + enrich images"
node scripts/build-places.mjs
node scripts/enrich-images2.mjs

echo "✅ Done. Now:"
echo "  npm run dev"
echo "Then commit/push:"
echo "  git add src/app/layout.tsx scripts/build-places.mjs scripts/enrich-images2.mjs public/places.json data/images_missing.csv"
echo "  git commit -m \"Fix site title, robust CSV parsing, and safer real images (no flight accidents)\""
echo "  git push"
