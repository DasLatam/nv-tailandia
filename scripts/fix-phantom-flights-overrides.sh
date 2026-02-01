#!/usr/bin/env bash
set -euo pipefail

echo "==> 1) build-places.mjs (filtra cualquier fila tipo títulos: Nombre/Ciudad/Categoría/Tiempo...)"
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

function pickAny(row, keys) {
  for (const k of keys) {
    const v = row?.[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return String(v).trim();
  }
  for (const k of keys) {
    const v = row?.[k];
    if (v !== undefined && v !== null) return String(v).trim();
  }
  return "";
}

function norm(s) {
  return (s || "").toString().trim().toLowerCase();
}

// Detecta filas “títulos” aunque vengan como:
// Nombre / Ciudad / Categoría / Tiempo Estimado / Descripción / Descripción Amplia
function isHeaderLikeRow(row) {
  const name = norm(pickAny(row, ["Nombre de Actividad", "Nombre Actividad", "Nombre"]));
  const city = norm(pickAny(row, ["Ciudad"]));
  const cat  = norm(pickAny(row, ["Categoría", "Categoria"]));
  const dur  = norm(pickAny(row, ["Tiempo Estimado", "Tiempo estimado", "Tiempo", "Duración", "Duracion"]));
  const sh   = norm(pickAny(row, ["Descripción", "Descripcion"]));
  const lo   = norm(pickAny(row, ["Descripción Amplia", "Descripción amplia", "Descripcion Amplia", "Descripcion amplia"]));

  const looks =
    (name === "nombre" || name.includes("nombre de actividad") || (name.includes("nombre") && name.includes("actividad"))) &&
    city === "ciudad" &&
    (cat === "categoria" || cat.includes("categor")) &&
    (dur === "" || dur.includes("tiempo")) &&
    (sh === "" || sh.includes("descrip")) &&
    (lo === "" || lo.includes("amplia"));

  return looks;
}

async function geocode(q) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "nv-tailandia/1.0 (contact: ariel@baudry.com.ar)" },
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

    const duration = pickAny(r, ["Tiempo Estimado", "Tiempo estimado", "Tiempo", "Duración", "Duracion"]);
    const short = pickAny(r, ["Descripción", "Descripcion", "Descripción corta", "Descripcion corta"]);
    const long = pickAny(r, ["Descripción Amplia", "Descripción amplia", "Descripcion Amplia", "Descripcion amplia", "Detalle", "Detalles"]);

    const baseId = `${slugify(city)}__${slugify(name)}`;
    const count = (idCounts.get(baseId) || 0) + 1;
    idCounts.set(baseId, count);
    const id = count === 1 ? baseId : `${baseId}-${count}`;

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
      image: "/placeholder.svg",
      thumb: "/placeholder.svg",
      lat: geo?.lat ?? null,
      lng: geo?.lng ?? null,
    });
  }

  fs.mkdirSync(path.dirname(outJson), { recursive: true });
  fs.writeFileSync(outJson, JSON.stringify(out, null, 2), "utf8");
  console.log("✅ places.json generado:", outJson, "items:", out.length);
})();
JS

echo "==> 2) enrich-images2.mjs (solo imágenes, NO pdf/svg; regla segura para vuelos)"
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
  return !u.includes("placeholder");
}

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

// ✅ solo aceptamos extensiones de imagen
function isImageFile(titleOrUrl = "") {
  const s = titleOrUrl.toLowerCase();
  return (
    s.endsWith(".jpg") ||
    s.endsWith(".jpeg") ||
    s.endsWith(".png") ||
    s.endsWith(".webp")
  );
}

async function commonsSearchImage(query) {
  const api = "https://commons.wikimedia.org/w/api.php";
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    generator: "search",
    gsrsearch: query,
    gsrlimit: "8",
    gsrnamespace: "6", // File:
    prop: "imageinfo",
    iiprop: "url",
    iiurlwidth: "420",
    iiurlheight: "420",
  });

  const url = `${api}?${params.toString()}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "nv-tailandia/1.0 (contact: ariel@baudry.com.ar)" },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const pages = data?.query?.pages;
  if (!pages) return null;

  for (const k of Object.keys(pages)) {
    const page = pages[k];
    const title = page?.title || "";
    const info = page?.imageinfo?.[0];
    const img = info?.url || "";
    const thumb = info?.thumburl || "";

    // Filtrado fuerte: nada de PDFs/SVG, nada “bad”
    if (!info) continue;
    if (looksBad(title) || looksBad(img) || looksBad(thumb)) continue;
    if (!isImageFile(title)) continue;
    if (!isImageFile(img) && img) continue;

    return {
      image: img || null,
      thumb: thumb || null,
      source: `commons:${title}`,
    };
  }

  return null;
}

async function openverseSearch(query) {
  const url = `https://api.openverse.org/v1/images?q=${encodeURIComponent(query)}&page_size=5`;
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

function isFlight(p) {
  const t = `${p.category || ""} ${p.name || ""}`.toLowerCase();
  return t.includes("vuelo") || t.includes("flight") || t.includes("aeropuerto");
}

// ✅ reglas seguras para vuelos: buscamos aeropuertos concretos (nada aleatorio)
async function flightImage(p) {
  const name = (p.name || "").toLowerCase();
  // detectamos destino por texto
  if (name.includes("bangkok") || name.includes("bkk")) {
    return await commonsSearchImage("Suvarnabhumi Airport terminal Bangkok");
  }
  if (name.includes("phuket") || name.includes("hkt")) {
    return await commonsSearchImage("Phuket International Airport terminal");
  }
  if (name.includes("chiang") || name.includes("cnx")) {
    return await commonsSearchImage("Chiang Mai International Airport terminal");
  }
  // fallback genérico seguro
  return await commonsSearchImage("airport terminal Thailand");
}

function buildQueries(p) {
  const name = safe(p.name);
  const city = safe(p.city);
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

    // 0) Vuelos -> imagen segura
    if (isFlight(p)) {
      const hit = await flightImage(p);
      await sleep(180);
      if (hit?.thumb || hit?.image) {
        p.thumb = hit.thumb || hit.image || "/placeholder.svg";
        p.image = hit.image || hit.thumb || "/placeholder.svg";
        p.imageSource = hit.source;
        updated++;
        continue;
      }
      // si no encontró, dejamos placeholder (pero jamás accidente)
      p.thumb = "/placeholder.svg";
      p.image = "/placeholder.svg";
      p.imageSource = "missing";
      missing++;
      continue;
    }

    // si ya tiene imagen real, no tocamos
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
        await sleep(220);
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
      p.thumb = "/placeholder.svg";
      p.image = "/placeholder.svg";
      p.imageSource = "missing";
      missing++;
    }

    if ((i + 1) % 20 === 0) console.log(`Progress: ${i + 1}/${places.length}`);
  }

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(places, null, 2), "utf8");

  // faltantes
  const header = "id,name,city,category\n";
  const rows = places
    .filter((p) => !isGoodExisting(p.thumb) || p.imageSource === "missing")
    .map((p) => `"${p.id}","${(p.name || "").replace(/"/g, '""')}","${(p.city || "").replace(/"/g, '""')}","${(p.category || "").replace(/"/g, '""')}"`)
    .join("\n");

  fs.mkdirSync(path.dirname(missingReport), { recursive: true });
  fs.writeFileSync(missingReport, header + rows + "\n", "utf8");

  console.log("✅ Updated:", updated);
  console.log("⚠️ Missing:", missing);
  console.log("Missing report:", missingReport);
})();
JS

echo "==> 3) Overrides: crear archivo y script para aplicar tus URLs reales"
mkdir -p data

cat <<'JSON' > data/image_overrides.json
{
  "rules": [
    {
      "match": { "name_includes": ["arabica", "empire tower"] },
      "thumb": "https://cdn.prod.rexby.com/image/45e362ad39844b1e9eab45bc633bd5f7",
      "image": "https://cdn.prod.rexby.com/image/45e362ad39844b1e9eab45bc633bd5f7",
      "source": "manual:rexby"
    },
    {
      "match": { "name_includes": ["jodd fairs"] },
      "thumb": "https://dynamic-media.tacdn.com/media/photo-o/2e/c9/67/d6/caption.jpg",
      "image": "https://dynamic-media.tacdn.com/media/photo-o/2e/c9/67/d6/caption.jpg",
      "source": "manual:tripadvisor"
    },
    {
      "match": { "name_includes": ["sirocco"] },
      "thumb": "https://viajeronomada.com/wp-content/uploads/2012/10/siroccobangkok.jpg",
      "image": "https://viajeronomada.com/wp-content/uploads/2012/10/siroccobangkok.jpg",
      "source": "manual:viajeronomada"
    },
    {
      "match": { "name_includes": ["tichuca"] },
      "thumb": "https://thailandmagazine.com/wp-content/uploads/2025/04/Tichuca-Rooftop-Bar-in-Bangkok-27-1024x682.webp",
      "image": "https://thailandmagazine.com/wp-content/uploads/2025/04/Tichuca-Rooftop-Bar-in-Bangkok-27-1024x682.webp",
      "source": "manual:thailandmagazine"
    }
  ]
}
JSON

cat <<'JS' > scripts/apply-overrides.mjs
import fs from "fs";
import path from "path";

const placesFile = path.join(process.cwd(), "public", "places.json");
const overridesFile = path.join(process.cwd(), "data", "image_overrides.json");

function norm(s) {
  return (s || "").toString().toLowerCase();
}

function matchesRule(place, rule) {
  const name = norm(place.name);
  const city = norm(place.city);

  const inc = rule.match?.name_includes || [];
  const cityInc = rule.match?.city_includes || [];

  const okName = inc.length === 0 || inc.every((t) => name.includes(norm(t)));
  const okCity = cityInc.length === 0 || cityInc.some((t) => city.includes(norm(t)));

  return okName && okCity;
}

(async () => {
  if (!fs.existsSync(placesFile)) throw new Error("Missing public/places.json");
  if (!fs.existsSync(overridesFile)) throw new Error("Missing data/image_overrides.json");

  const places = JSON.parse(fs.readFileSync(placesFile, "utf8"));
  const overrides = JSON.parse(fs.readFileSync(overridesFile, "utf8"));

  let applied = 0;

  for (const p of places) {
    for (const rule of overrides.rules || []) {
      if (matchesRule(p, rule)) {
        p.thumb = rule.thumb || p.thumb;
        p.image = rule.image || p.image;
        p.imageSource = rule.source || "manual";
        applied++;
        break;
      }
    }
  }

  fs.writeFileSync(placesFile, JSON.stringify(places, null, 2), "utf8");
  console.log("✅ Overrides applied:", applied);
})();
JS

echo "==> 4) Run: rebuild places.json + enrich + apply overrides"
node scripts/build-places.mjs
node scripts/enrich-images2.mjs
node scripts/apply-overrides.mjs

echo "✅ Done."
echo "Now commit:"
echo "  git add scripts/build-places.mjs scripts/enrich-images2.mjs scripts/apply-overrides.mjs data/image_overrides.json public/places.json data/images_missing.csv src/app/layout.tsx"
echo "  git commit -m \"Fix phantom row, filter Commons PDFs, safe flight images, and add image overrides\""
echo "  git push"
