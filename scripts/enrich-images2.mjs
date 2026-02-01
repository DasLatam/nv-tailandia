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
