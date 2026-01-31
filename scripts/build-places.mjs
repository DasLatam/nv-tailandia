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

function pick(r, key) {
  return (r[key] ?? "").toString().trim();
}

// Detecta la fila que se coló como “títulos”
function isHeaderLikeRow(r) {
  const name = pick(r, "Nombre de Actividad").toLowerCase();
  const city = pick(r, "Ciudad").toLowerCase();
  const cat = pick(r, "Categoría").toLowerCase();

  const looksLikeHeader =
    name.includes("nombre") && name.includes("actividad") &&
    city === "ciudad" &&
    (cat.includes("categor") || cat === "categoria");

  return looksLikeHeader;
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
    .filter((r) => pick(r, "Nombre de Actividad").length)
    .filter((r) => !isHeaderLikeRow(r));

  const out = [];
  const idCounts = new Map();

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];

    const name = pick(r, "Nombre de Actividad");
    const city = pick(r, "Ciudad");
    const category = pick(r, "Categoría");
    const duration = pick(r, "Tiempo Estimado");
    const short = pick(r, "Descripción");
    const long = pick(r, "Descripción Amplia");

    const baseId = `${slugify(city)}__${slugify(name)}`;
    const count = (idCounts.get(baseId) || 0) + 1;
    idCounts.set(baseId, count);
    const id = count === 1 ? baseId : `${baseId}-${count}`;

    // Mantener lo que haya (si luego enriquecés imágenes se reemplaza)
    const image = `https://source.unsplash.com/featured/?${encodeURIComponent(`${name} ${city} thailand`)}`;

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
      lat: geo?.lat ?? null,
      lng: geo?.lng ?? null,
    });

    console.log(`[${i + 1}/${rows.length}] ${id}`);
  }

  fs.mkdirSync(path.dirname(outJson), { recursive: true });
  fs.writeFileSync(outJson, JSON.stringify(out, null, 2), "utf8");
  console.log("✅ places.json generado:", outJson);
})();
