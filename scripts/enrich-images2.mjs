// scripts/enrich-images2.mjs
// Enrich public/places.json adding `image_url` when missing.
// Sources: Wikimedia Commons search (simple) + Openverse (optional if you already use it)
// Safety:
// - Skip non-images (pdf/svg)
// - Skip dangerous keywords (crash/accident/wreck/...)
// - For flights/airports: force safe real airport images (BKK/CNX/HKT) if we can infer, else placeholder.

import fs from "node:fs";
import path from "node:path";

const PLACES_PATH = path.join(process.cwd(), "public", "places.json");

// Safe, real airports (direct file URLs via Wikimedia Special:FilePath)
const SAFE_AIRPORT_IMAGES = {
  BKK: "https://commons.wikimedia.org/wiki/Special:FilePath/Suvarnabhumi%20Airport%20Terminal%20E%20interior%20at%20dusk.jpg",
  CNX: "https://commons.wikimedia.org/wiki/Special:FilePath/Chiang%20Mai%20Intl%20Airport.jpg",
  HKT: "https://commons.wikimedia.org/wiki/Special:FilePath/Phuket%20International%20Airport3.jpg",
};

const DANGER_KEYWORDS = [
  "crash",
  "accident",
  "wreck",
  "disaster",
  "emergency",
  "incident",
  "fatal",
  "dead",
  "death",
  "injury",
  "bomb",
  "terror",
  "explosion",
  "fire",
];

const BAD_EXTENSIONS = [".pdf", ".svg"];

function isBadUrl(url) {
  const u = String(url || "").toLowerCase();
  if (!u) return true;
  if (BAD_EXTENSIONS.some((ext) => u.includes(ext))) return true;
  if (DANGER_KEYWORDS.some((k) => u.includes(k))) return true;
  return false;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Try to ensure URL is an actual image via HEAD content-type (best effort)
async function isImageUrl(url) {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    if (!res.ok) return false;
    const ct = res.headers.get("content-type") || "";
    return ct.startsWith("image/");
  } catch {
    // If HEAD fails (some hosts block it), fallback to extension check only
    return !isBadUrl(url);
  }
}

function guessAirportCode(place) {
  const hay = `${place.name} ${place.city} ${place.category} ${place.notes || ""} ${place.raw?.Notas || ""} ${place.raw?.Notes || ""}`
    .toLowerCase();

  // Common hints
  if (hay.includes("bkk") || hay.includes("suvarnabhumi")) return "BKK";
  if (hay.includes("cnx") || hay.includes("chiang mai international airport") || hay.includes("chiang mai intl")) return "CNX";
  if (hay.includes("hkt") || hay.includes("phuket international airport") || hay.includes("phuket intl")) return "HKT";

  // City-based fallback when category is flights
  const city = (place.city || "").toLowerCase();
  if (city.includes("bangkok")) return "BKK";
  if (city.includes("chiang mai") || city.includes("chiangmai")) return "CNX";
  if (city.includes("phuket")) return "HKT";

  return null;
}

function isFlight(place) {
  const c = (place.category || "").toLowerCase();
  return c === "vuelos" || c.includes("vuelo") || c.includes("flight") || c.includes("airport") || c.includes("aeropuerto");
}

// Wikimedia Commons: use REST search for media? We'll do a very simple query to Wikipedia API for images.
// This is intentionally conservative: if uncertain, we leave blank (or use safe airport image for flights).
async function searchCommonsImage(query) {
  const q = query.trim();
  if (!q) return null;

  // Use MediaWiki API to search pages/files; then try Special:FilePath
  const api = new URL("https://commons.wikimedia.org/w/api.php");
  api.searchParams.set("action", "query");
  api.searchParams.set("format", "json");
  api.searchParams.set("origin", "*");
  api.searchParams.set("list", "search");
  api.searchParams.set("srsearch", `file:${q}`);
  api.searchParams.set("srlimit", "5");

  try {
    const res = await fetch(api.toString());
    if (!res.ok) return null;
    const data = await res.json();
    const hits = data?.query?.search || [];
    for (const h of hits) {
      const title = h?.title; // "File:....jpg"
      if (!title || !title.toLowerCase().startsWith("file:")) continue;

      // Convert title to Special:FilePath/<filename>
      const filename = title.slice(5);
      const filePath = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}`;

      if (isBadUrl(filePath)) continue;
      if (await isImageUrl(filePath)) return filePath;
      await sleep(150);
    }
  } catch {
    return null;
  }

  return null;
}

function buildQuery(place) {
  // Keep it simple and “real-world”: name + city
  // Prefer dropping symbols like % in queries
  const name = (place.name || "").replace(/%/g, "").trim();
  const city = (place.city || "").trim();
  if (name && city) return `${name} ${city}`;
  return name || city;
}

const places = JSON.parse(fs.readFileSync(PLACES_PATH, "utf8"));

let changed = 0;

for (let i = 0; i < places.length; i++) {
  const p = places[i];

  if (p.image_url && !isBadUrl(p.image_url)) {
    // Already has something; optionally validate
    continue;
  }

  // Flights: force safe airport images
  if (isFlight(p)) {
    const code = guessAirportCode(p);
    if (code && SAFE_AIRPORT_IMAGES[code]) {
      p.image_url = SAFE_AIRPORT_IMAGES[code];
      changed++;
      continue;
    }
    // If we can't infer, do NOT fetch random flight photos. Leave placeholder.
    p.image_url = "";
    continue;
  }

  const q = buildQuery(p);

  // Commons attempt (safe)
  const commonsUrl = await searchCommonsImage(q);
  if (commonsUrl && !isBadUrl(commonsUrl)) {
    p.image_url = commonsUrl;
    changed++;
    await sleep(250);
    continue;
  }

  // If nothing found, keep blank (UI should show placeholder)
  p.image_url = "";
  await sleep(150);
}

fs.writeFileSync(PLACES_PATH, JSON.stringify(places, null, 2), "utf8");
console.log(`✅ enrich-images2: updated image_url for ${changed} places (others left blank/placeholder)`);
