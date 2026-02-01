#!/usr/bin/env node
// scripts/image-pipeline.mjs
// Genera/actualiza dataset de lugares con imágenes seguras.
// Fuentes: Wikimedia (Wikipedia summary + Commons search), Openverse (fallback).
// Valida: cada entrada tiene image y thumb; ninguna imagen de tragedias/accidentes/desastres.
// Fallback seguro por categoría/ciudad si no hay resultado válido.

import fs from "node:fs";
import path from "node:path";

const PLACES_PATH = path.join(process.cwd(), "public", "places.json");
const OVERRIDES_PATH = path.join(process.cwd(), "data", "image_overrides.json");

const DANGER_KEYWORDS = [
  "tsunami", "accident", "crash", "wreck", "disaster", "emergency", "rescue",
  "incident", "fatal", "dead", "death", "injury", "bomb", "terror", "explosion",
  "fire", "flood", "earthquake", "plane crash", "air crash", "derailment",
  "collision", "victim", "mourning", "destruction", "war", "attack",
];

const BAD_EXTENSIONS = [".pdf", ".svg"];

// Fallbacks seguros por categoría/ciudad (URLs Commons reales y representativas)
const FALLBACK_IMAGES = {
  "bangkok_skyline": {
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Bangkok_skyline_at_night.jpg",
    thumb: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Bangkok_skyline_at_night.jpg/500px-Bangkok_skyline_at_night.jpg",
    source: "fallback:bangkok_skyline",
  },
  "bangkok_rooftop": {
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e2/%E3%80%90%E6%B3%B0%E5%9C%8B%E3%80%91%E8%A1%8C%E7%A8%8B%E8%A6%8F%E7%95%AB_%2830889734041%29.jpg",
    thumb: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/%E3%80%90%E6%B3%B0%E5%9C%8B%E3%80%91%E8%A1%8C%E7%A8%8B%E8%A6%8F%E7%95%AB_%2830889734041%29.jpg/500px-%E3%80%90%E6%B3%B0%E5%9C%8B%E3%80%91%E8%A1%8C%E7%A8%8B%E8%A6%8F%E7%95%AB_%2830889734041%29.jpg",
    source: "fallback:bangkok_rooftop",
  },
  "chiang_mai": {
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Bangkok_skyline_at_night.jpg",
    thumb: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Bangkok_skyline_at_night.jpg/500px-Bangkok_skyline_at_night.jpg",
    source: "fallback:chiang_mai",
  },
  "chiang_rai_temple": {
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Wat_Rong_Khun_in_Chiang_Rai%2C_Thailand.jpg",
    thumb: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Wat_Rong_Khun_in_Chiang_Rai%2C_Thailand.jpg/500px-Wat_Rong_Khun_in_Chiang_Rai%2C_Thailand.jpg",
    source: "fallback:chiang_rai_temple",
  },
  "thai_food": {
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Khao_soi_Chiang_Mai.jpg",
    thumb: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Khao_soi_Chiang_Mai.jpg/500px-Khao_soi_Chiang_Mai.jpg",
    source: "fallback:thai_food",
  },
  "thai_temple": {
    image: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Wat_Phra_Kaew_by_Ninara_TSP_edit_crop.jpg",
    thumb: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Wat_Phra_Kaew_by_Ninara_TSP_edit_crop.jpg/500px-Wat_Phra_Kaew_by_Ninara_TSP_edit_crop.jpg",
    source: "fallback:thai_temple",
  },
  "thailand_market": {
    image: "https://upload.wikimedia.org/wikipedia/commons/a/af/Night_Bazaar_ChiangMai.jpg",
    thumb: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Night_Bazaar_ChiangMai.jpg/500px-Night_Bazaar_ChiangMai.jpg",
    source: "fallback:thailand_market",
  },
  "thailand_nature": {
    image: "https://upload.wikimedia.org/wikipedia/commons/3/35/Elefante_y_cuidador_en_santuario_de_Tailandia.jpg",
    thumb: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Elefante_y_cuidador_en_santuario_de_Tailandia.jpg/500px-Elefante_y_cuidador_en_santuario_de_Tailandia.jpg",
    source: "fallback:thailand_nature",
  },
  "phuket_beach": {
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Ayutthaya_Thailand_2004.jpg",
    thumb: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Ayutthaya_Thailand_2004.jpg/500px-Ayutthaya_Thailand_2004.jpg",
    source: "fallback:phuket_beach",
  },
  "ayutthaya": {
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Ayutthaya_Thailand_2004.jpg",
    thumb: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Ayutthaya_Thailand_2004.jpg/500px-Ayutthaya_Thailand_2004.jpg",
    source: "fallback:ayutthaya",
  },
  "thailand_hotel": {
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Bangkok_skyline_at_night.jpg",
    thumb: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Bangkok_skyline_at_night.jpg/500px-Bangkok_skyline_at_night.jpg",
    source: "fallback:thailand_hotel",
  },
  "thailand_nightlife": {
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Bangkok_skyline_at_night.jpg",
    thumb: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Bangkok_skyline_at_night.jpg/500px-Bangkok_skyline_at_night.jpg",
    source: "fallback:thailand_nightlife",
  },
  "thailand_culture": {
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Wat_Rong_Khun_in_Chiang_Rai%2C_Thailand.jpg",
    thumb: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Wat_Rong_Khun_in_Chiang_Rai%2C_Thailand.jpg/500px-Wat_Rong_Khun_in_Chiang_Rai%2C_Thailand.jpg",
    source: "fallback:thailand_culture",
  },
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function norm(s) {
  return (s || "").toString().toLowerCase();
}

function isUnsafeUrl(url) {
  const u = norm(url);
  if (!u) return true;
  if (BAD_EXTENSIONS.some((ext) => u.includes(ext))) return true;
  if (DANGER_KEYWORDS.some((k) => u.includes(k))) return true;
  return false;
}

function isUnsafeTitle(title) {
  const t = norm(title || "");
  return DANGER_KEYWORDS.some((k) => t.includes(k));
}

function needsImage(place) {
  const img = place.image;
  const thumb = place.thumb;
  if (!img || !thumb) return true;
  if (img.includes("placeholder") || thumb.includes("placeholder")) return true;
  if (isUnsafeUrl(img) || isUnsafeUrl(thumb)) return true;
  return false;
}

function applyOverrides(places) {
  if (!fs.existsSync(OVERRIDES_PATH)) return 0;
  const overrides = JSON.parse(fs.readFileSync(OVERRIDES_PATH, "utf8"));
  let applied = 0;
  for (const p of places) {
    for (const rule of overrides.rules || []) {
      const inc = rule.match?.name_includes || [];
      const cityInc = rule.match?.city_includes || [];
      const okName = inc.length === 0 || inc.every((t) => norm(p.name).includes(norm(t)));
      const okCity = cityInc.length === 0 || (cityInc.length > 0 && cityInc.some((t) => norm(p.city).includes(norm(t))));
      if (okName && okCity) {
        p.thumb = rule.thumb || p.thumb;
        p.image = rule.image || p.image;
        p.imageSource = rule.source || "manual";
        applied++;
        break;
      }
    }
  }
  return applied;
}

function pickFallback(place) {
  const city = norm(place.city);
  const cat = norm(place.category || "");

  if (cat.includes("rooftop") || (cat.includes("mirador") && city.includes("bangkok")))
    return FALLBACK_IMAGES.bangkok_rooftop;
  if (city.includes("bangkok")) return FALLBACK_IMAGES.bangkok_skyline;
  if (city.includes("chiang mai")) return FALLBACK_IMAGES.chiang_mai;
  if (city.includes("chiang rai") && (cat.includes("templo") || cat.includes("cultura")))
    return FALLBACK_IMAGES.chiang_rai_temple;
  if (city.includes("chiang rai")) return FALLBACK_IMAGES.chiang_rai_temple;
  if (city.includes("phuket") || city.includes("krabi")) return FALLBACK_IMAGES.phuket_beach;
  if (city.includes("ayutthaya")) return FALLBACK_IMAGES.ayutthaya;
  if (cat.includes("gastronomía") || cat.includes("gastronomia") || cat.includes("comida"))
    return FALLBACK_IMAGES.thai_food;
  if (cat.includes("templo") || cat.includes("histórico")) return FALLBACK_IMAGES.thai_temple;
  if (cat.includes("mercado") || cat.includes("market")) return FALLBACK_IMAGES.thailand_market;
  if (cat.includes("naturaleza") || cat.includes("parque")) return FALLBACK_IMAGES.thailand_nature;
  if (cat.includes("alojamiento") || cat.includes("hotel")) return FALLBACK_IMAGES.thailand_hotel;
  if (cat.includes("nocturna") || cat.includes("noche")) return FALLBACK_IMAGES.thailand_nightlife;
  if (cat.includes("cultura") || cat.includes("experiencia")) return FALLBACK_IMAGES.thailand_culture;

  return FALLBACK_IMAGES.thai_temple;
}

async function wikipediaSummary(name, city) {
  const q = `${name} ${city} Thailand`.trim();
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&limit=1&namespace=0&format=json&origin=*&search=${encodeURIComponent(q)}`;
  try {
    const res = await fetch(searchUrl);
    if (!res.ok) return null;
    const data = await res.json();
    const title = data?.[1]?.[0];
    if (!title) return null;
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const sumRes = await fetch(summaryUrl, { headers: { Accept: "application/json" } });
    if (!sumRes.ok) return null;
    const summary = await sumRes.json();
    const thumb = summary?.thumbnail?.source || null;
    const image = summary?.originalimage?.source || thumb || null;
    if (!image && !thumb) return null;
    const titleForSafety = summary?.title || title;
    if (isUnsafeTitle(titleForSafety)) return null;
    const imgUrl = (image || thumb || "").toLowerCase();
    if (isUnsafeUrl(imgUrl)) return null;
    return { thumb: thumb || image, image: image || thumb, source: `wikipedia:${title}` };
  } catch {
    return null;
  }
}

async function commonsSearch(query, limit = 5) {
  const q = query.trim().replace(/%/g, "").trim();
  if (!q) return null;
  const searchUrl = new URL("https://commons.wikimedia.org/w/api.php");
  searchUrl.searchParams.set("action", "query");
  searchUrl.searchParams.set("format", "json");
  searchUrl.searchParams.set("origin", "*");
  searchUrl.searchParams.set("list", "search");
  searchUrl.searchParams.set("srsearch", `file:${q} Thailand`);
  searchUrl.searchParams.set("srlimit", String(limit));
  try {
    const res = await fetch(searchUrl.toString());
    if (!res.ok) return null;
    const data = await res.json();
    const hits = data?.query?.search || [];
    for (const h of hits) {
      const title = h?.title;
      if (!title || !title.toLowerCase().startsWith("file:")) continue;
      const fileTitle = title.slice(5);
      if (isUnsafeTitle(fileTitle)) continue;
      const infoUrl = new URL("https://commons.wikimedia.org/w/api.php");
      infoUrl.searchParams.set("action", "query");
      infoUrl.searchParams.set("format", "json");
      infoUrl.searchParams.set("origin", "*");
      infoUrl.searchParams.set("titles", title);
      infoUrl.searchParams.set("prop", "imageinfo");
      infoUrl.searchParams.set("iiprop", "url");
      infoUrl.searchParams.set("iiurlwidth", "500");
      const infoRes = await fetch(infoUrl.toString());
      if (!infoRes.ok) continue;
      const infoData = await infoRes.json();
      const pages = infoData?.query?.pages || {};
      const page = Object.values(pages)[0];
      const ii = page?.imageinfo?.[0];
      if (!ii) continue;
      const imageUrl = ii.url || ii.thumburl;
      const thumbUrl = ii.thumburl || ii.url;
      if (!imageUrl || isUnsafeUrl(imageUrl)) continue;
      await sleep(100);
      return { thumb: thumbUrl || imageUrl, image: imageUrl, source: `commons:File:${fileTitle}` };
    }
  } catch {
    return null;
  }
  return null;
}

function commonsThumbFromImage(imageUrl) {
  if (!imageUrl || !imageUrl.includes("wikimedia.org")) return imageUrl;
  if (imageUrl.includes("/thumb/")) return imageUrl;
  const m = imageUrl.match(/\/commons\/(?:thumb\/)?(.+)/);
  if (!m) return imageUrl;
  const pathPart = m[1].replace(/^thumb\/[^/]+\/[^/]+\//, "");
  const filename = pathPart.split("/").pop() || "image.jpg";
  const prefix = pathPart.includes("/") ? pathPart.split("/").slice(0, -1).join("/") + "/" : "";
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${prefix}${filename}/500px-${filename}`;
}

async function openverseSearch(query) {
  const q = query.trim();
  if (!q) return null;
  const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(q + " Thailand")}&license_type=commercial,modification&page_size=3`;
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const data = await res.json();
    const results = data?.results || [];
    for (const r of results) {
      const imgUrl = r?.url || r?.detail_url;
      if (!imgUrl || isUnsafeUrl(imgUrl)) continue;
      const thumb = r?.thumbnail || imgUrl;
      return { thumb, image: imgUrl, source: `openverse:${r?.id || "search"}` };
    }
  } catch {
    return null;
  }
  return null;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const fallbacksOnly = process.argv.includes("--fallbacks-only");
  const places = JSON.parse(fs.readFileSync(PLACES_PATH, "utf8"));

  let overridesApplied = applyOverrides(places);
  if (dryRun) {
    console.log("Dry run: would apply overrides to", overridesApplied, "places");
  }

  const toFix = places.filter(needsImage);
  console.log(`Places needing image: ${toFix.length} (overrides applied: ${overridesApplied})`);

  if (fallbacksOnly) {
    for (let i = 0; i < toFix.length; i++) {
      const p = toFix[i];
      const fallback = pickFallback(p);
      p.image = fallback.image;
      p.thumb = fallback.thumb;
      p.imageSource = fallback.source;
      console.log(`  [${i + 1}/${toFix.length}] ${p.name}: fallback (${fallback.source})`);
    }
  } else {
    for (let i = 0; i < toFix.length; i++) {
      const p = toFix[i];
      if (!needsImage(p)) continue;
      const name = (p.name || "").trim();
      const city = (p.city || "").trim();
      const query = [name, city].filter(Boolean).join(" ");

      let result = await wikipediaSummary(name, city);
      if (result) {
        p.thumb = result.thumb;
        p.image = result.image;
        p.imageSource = result.source;
        if (!p.thumb?.includes("/thumb/") && p.image?.includes("wikimedia")) {
          p.thumb = commonsThumbFromImage(p.image) || p.thumb;
        }
        console.log(`  [${i + 1}/${toFix.length}] ${name}: wikipedia`);
        await sleep(180);
        continue;
      }
      await sleep(150);

      result = await commonsSearch(query);
      if (result) {
        p.thumb = result.thumb;
        p.image = result.image;
        p.imageSource = result.source;
        console.log(`  [${i + 1}/${toFix.length}] ${name}: commons`);
        await sleep(200);
        continue;
      }
      await sleep(150);

      result = await openverseSearch(query);
      if (result) {
        p.thumb = result.thumb;
        p.image = result.image;
        p.imageSource = result.source;
        console.log(`  [${i + 1}/${toFix.length}] ${name}: openverse`);
        await sleep(200);
        continue;
      }

      const fallback = pickFallback(p);
      p.image = fallback.image;
      p.thumb = fallback.thumb;
      p.imageSource = fallback.source;
      console.log(`  [${i + 1}/${toFix.length}] ${name}: fallback (${fallback.source})`);
    }
  }

  for (const p of places) {
    if (!p.thumb && p.image) p.thumb = p.image;
    if (!p.image && p.thumb) p.image = p.thumb;
    if (!p.image || !p.thumb) {
      const fb = pickFallback(p);
      p.image = p.image || fb.image;
      p.thumb = p.thumb || fb.thumb;
      if (!p.imageSource) p.imageSource = fb.source;
    }
  }

  if (!dryRun) {
    fs.writeFileSync(PLACES_PATH, JSON.stringify(places, null, 2), "utf8");
    console.log("✅ Wrote", PLACES_PATH);
  } else {
    console.log("Dry run: no file written.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
