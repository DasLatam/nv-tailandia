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
