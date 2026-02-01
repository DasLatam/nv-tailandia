// scripts/detect-duplicates.mjs
// Detect likely duplicates in public/places.json and output data/duplicates.csv

import fs from "node:fs";
import path from "node:path";

const PLACES_PATH = path.join(process.cwd(), "public", "places.json");
const OUT_CSV = path.join(process.cwd(), "data", "duplicates.csv");

function normName(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // accents
    .replace(/%/g, "")
    .replace(/\b(bangkok|chiang mai|phuket)\b/g, "")
    .replace(/\b(empire tower|tower)\b/g, "empire")
    .replace(/\barabica\b/g, "arabica")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normCity(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function csvEscape(v) {
  const s = String(v ?? "");
  if (/[,"\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const places = JSON.parse(fs.readFileSync(PLACES_PATH, "utf8"));

const buckets = new Map();
// key = normCity|normName
for (const p of places) {
  const key = `${normCity(p.city)}|${normName(p.name)}`;
  if (!buckets.has(key)) buckets.set(key, []);
  buckets.get(key).push(p);
}

const duplicates = [];
for (const [key, arr] of buckets.entries()) {
  if (arr.length <= 1) continue;
  const [city, n] = key.split("|");
  duplicates.push({ key, city, normalized_name: n, items: arr });
}

// Write CSV
fs.mkdirSync(path.dirname(OUT_CSV), { recursive: true });

const lines = [];
lines.push(
  [
    "group_key",
    "city_norm",
    "name_norm",
    "count",
    "id",
    "name",
    "city",
    "category",
    "lat",
    "lng",
    "url",
  ].join(",")
);

for (const g of duplicates) {
  for (const p of g.items) {
    lines.push(
      [
        csvEscape(g.key),
        csvEscape(g.city),
        csvEscape(g.normalized_name),
        csvEscape(g.items.length),
        csvEscape(p.id),
        csvEscape(p.name),
        csvEscape(p.city),
        csvEscape(p.category),
        csvEscape(p.lat),
        csvEscape(p.lng),
        csvEscape(p.url || ""),
      ].join(",")
    );
  }
}

fs.writeFileSync(OUT_CSV, lines.join("\n"), "utf8");

console.log(
  `✅ detect-duplicates: wrote ${path.relative(process.cwd(), OUT_CSV)} with ${duplicates.length} duplicate groups`
);
