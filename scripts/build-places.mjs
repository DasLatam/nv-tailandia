// scripts/build-places.mjs
// Build public/places.json from data/Hoja8.csv
// - Filters out header/"ghost row"
// - Normalizes basic fields
// - Stable id per row
// - Outputs sorted by name (base order)

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const CSV_PATH = path.join(process.cwd(), "data", "Hoja8.csv");
const OUT_PATH = path.join(process.cwd(), "public", "places.json");

function parseCsv(text) {
  // Minimal CSV parser with quote support (no deps)
  // Handles: commas, quotes, newlines inside quotes.
  const rows = [];
  let row = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }

    if (ch === ",") {
      row.push(cur);
      cur = "";
      continue;
    }

    if (ch === "\n") {
      row.push(cur);
      cur = "";
      rows.push(row);
      row = [];
      continue;
    }

    if (ch === "\r") continue;

    cur += ch;
  }

  // last cell
  if (cur.length > 0 || row.length > 0) {
    row.push(cur);
    rows.push(row);
  }

  // Trim all cells
  return rows.map((r) => r.map((c) => (c ?? "").trim()));
}

function sha1(str) {
  return crypto.createHash("sha1").update(str).digest("hex");
}

function toNumber(v) {
  if (v == null) return null;
  const s = String(v).trim().replace(",", ".");
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function normStr(v) {
  return String(v ?? "").trim();
}

function looksLikeHeaderRow(obj) {
  // Detect the "ghost row" that is actually headers repeated as data.
  // Strategy:
  // 1) If lat/lng are non-numeric AND multiple fields match known header words, drop.
  // 2) If name/city/category are literally header-like, drop.

  const values = Object.values(obj)
    .map((v) => String(v ?? "").trim().toLowerCase())
    .filter(Boolean);

  const headerTokens = [
    "nombre",
    "name",
    "ciudad",
    "city",
    "categoría",
    "categoria",
    "category",
    "tiempo",
    "duración",
    "duracion",
    "estimado",
    "lat",
    "latitud",
    "lng",
    "longitud",
    "longitude",
    "latitude",
    "zona",
    "barrio",
    "dirección",
    "direccion",
    "notas",
    "notes",
    "google",
    "maps",
    "link",
    "url",
  ];

  const hitCount = values.reduce((acc, v) => {
    const isHit = headerTokens.some((t) => v === t || v.includes(`${t} `) || v.includes(` ${t}`));
    return acc + (isHit ? 1 : 0);
  }, 0);

  const name = String(obj.name ?? "").trim().toLowerCase();
  const city = String(obj.city ?? "").trim().toLowerCase();
  const category = String(obj.category ?? "").trim().toLowerCase();

  const nameHeaderish =
    headerTokens.includes(name) || name.includes("nombre") || name.includes("name");
  const cityHeaderish = headerTokens.includes(city) || city.includes("ciudad") || city.includes("city");
  const catHeaderish =
    headerTokens.includes(category) || category.includes("categor") || category.includes("category");

  const lat = toNumber(obj.lat);
  const lng = toNumber(obj.lng);

  const coordsMissingOrBad = lat == null || lng == null;

  // If coords are bad AND we have multiple header hits, it's almost certainly the ghost row.
  if (coordsMissingOrBad && hitCount >= 3) return true;

  // If obvious header strings in main fields, drop.
  if ((nameHeaderish && cityHeaderish) || (nameHeaderish && catHeaderish)) return true;

  return false;
}

function normalizeCategory(raw) {
  const s = normStr(raw).toLowerCase();
  if (!s) return "";
  if (s.includes("hotel")) return "hotel";
  if (s.includes("vuelo") || s.includes("flight") || s.includes("aeropuerto") || s.includes("airport"))
    return "vuelos";
  if (s.includes("comida") || s.includes("food") || s.includes("restaurant") || s.includes("bar") || s.includes("rooftop"))
    return "gastronomía";
  if (s.includes("templo") || s.includes("wat") || s.includes("temple"))
    return "templos";
  if (s.includes("mercad") || s.includes("market") || s.includes("shopping") || s.includes("mall") || s.includes("compras"))
    return "compras";
  return raw ? normStr(raw) : "";
}

function stableIdFromRow(rowObj) {
  // Use key info; coords first, then name/city as fallback.
  const key = [
    normStr(rowObj.name).toLowerCase(),
    normStr(rowObj.city).toLowerCase(),
    String(rowObj.lat ?? ""),
    String(rowObj.lng ?? ""),
  ].join("|");
  return sha1(key).slice(0, 12);
}

const csvText = fs.readFileSync(CSV_PATH, "utf8");
const rows = parseCsv(csvText);
if (rows.length < 2) {
  console.error("CSV seems empty:", CSV_PATH);
  process.exit(1);
}

const header = rows[0].map((h) => h.trim());
const dataRows = rows.slice(1);

function pick(obj, keys) {
  for (const k of keys) {
    if (obj[k] != null && String(obj[k]).trim() !== "") return obj[k];
  }
  return "";
}

const rawObjects = dataRows.map((r) => {
  const o = {};
  for (let i = 0; i < header.length; i++) {
    o[header[i]] = r[i] ?? "";
  }
  return o;
});

// Map CSV columns to canonical keys (tolerant to different header names)
const mapped = rawObjects.map((o) => {
  const name = pick(o, ["Nombre", "Name", "nombre", "name", "Actividad", "Lugar"]);
  const city = pick(o, ["Ciudad", "City", "ciudad", "city"]);
  const category = pick(o, ["Categoría", "Categoria", "Category", "categoría", "categoria", "category"]);
  const lat = pick(o, ["Lat", "LAT", "Latitude", "Latitud", "lat", "latitude", "latitud"]);
  const lng = pick(o, ["Lng", "LNG", "Longitude", "Longitud", "lon", "lng", "longitude", "longitud"]);
  const time = pick(o, ["Tiempo estimado", "Duración", "Duracion", "Tiempo", "duration", "time"]);
  const address = pick(o, ["Dirección", "Direccion", "Address", "address"]);
  const notes = pick(o, ["Notas", "Notes", "notas", "notes"]);
  const url = pick(o, ["URL", "Url", "Link", "Maps", "Google Maps", "google maps", "url", "link"]);
  // Keep everything raw too for the drawer:
  const raw = { ...o };

  return {
    name: normStr(name),
    city: normStr(city),
    category: normalizeCategory(category),
    lat: toNumber(lat),
    lng: toNumber(lng),
    time: normStr(time),
    address: normStr(address),
    notes: normStr(notes),
    url: normStr(url),
    raw,
  };
});

// Filter ghost/header row + invalid points
const cleaned = mapped
  .filter((p) => !looksLikeHeaderRow(p))
  .filter((p) => p.name && p.lat != null && p.lng != null);

// Assign ids
const withIds = cleaned.map((p) => ({
  id: stableIdFromRow(p),
  ...p,
}));

// Stable base order by name (so UI can reuse this if it wants)
withIds.sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, JSON.stringify(withIds, null, 2), "utf8");

console.log(`✅ Generated ${path.relative(process.cwd(), OUT_PATH)} with ${withIds.length} places`);
