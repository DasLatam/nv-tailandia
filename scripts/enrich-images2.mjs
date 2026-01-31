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
