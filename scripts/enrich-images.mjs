import fs from "fs";
import path from "path";

const file = path.join(process.cwd(), "public", "places.json");
const outFile = path.join(process.cwd(), "public", "places.json");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function openSearch(query) {
  const url =
    "https://en.wikipedia.org/w/api.php?action=opensearch&limit=1&namespace=0&format=json&origin=*&search=" +
    encodeURIComponent(query);
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const title = data?.[1]?.[0];
  return title || null;
}

async function pageSummary(title) {
  const url =
    "https://en.wikipedia.org/api/rest_v1/page/summary/" +
    encodeURIComponent(title);
  const res = await fetch(url, {
    headers: { "accept": "application/json" },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data || null;
}

function isLikelyBusiness(category = "") {
  const c = category.toLowerCase();
  return (
    c.includes("rooftop") ||
    c.includes("bar") ||
    c.includes("hotel") ||
    c.includes("spa") ||
    c.includes("masaje") ||
    c.includes("cocina") ||
    c.includes("shopping")
  );
}

(async () => {
  const places = JSON.parse(fs.readFileSync(file, "utf8"));

  let updated = 0;
  let noImage = 0;

  for (let i = 0; i < places.length; i++) {
    const p = places[i];

    // Si ya tiene thumb “real” (no placeholder/unsplash), lo dejamos
    const hasRealThumb =
      p.thumb &&
      typeof p.thumb === "string" &&
      !p.thumb.includes("placeholder") &&
      !p.thumb.includes("unsplash.com");

    if (hasRealThumb) continue;

    const name = (p.name || "").trim();
    const city = (p.city || "").trim();

    // Para negocios, Wikipedia suele fallar: intentamos igual pero con menos expectativa
    const q1 = `${name} ${city} Thailand`;
    const q2 = `${name} Thailand`;
    const q3 = name;

    let title =
      (await openSearch(q1)) ||
      (await openSearch(q2)) ||
      (await openSearch(q3));

    if (!title) {
      noImage++;
      await sleep(120);
      continue;
    }

    const summary = await pageSummary(title);
    const thumb = summary?.thumbnail?.source || null;
    const image = summary?.originalimage?.source || thumb || null;

    if (thumb || image) {
      p.thumb = thumb || image;
      p.image = image || thumb;
      p.imageSource = `wikipedia:${title}`;
      updated++;
    } else {
      noImage++;
    }

    // Rate limit friendly
    await sleep(isLikelyBusiness(p.category) ? 200 : 140);
  }

  fs.writeFileSync(outFile, JSON.stringify(places, null, 2), "utf8");
  console.log("✅ Updated:", updated);
  console.log("⚠️ No image:", noImage);
  console.log("Wrote:", outFile);
})();
