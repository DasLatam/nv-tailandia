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

// Toma el primer header existente entre varias opciones
function pickAny(row, keys) {
  for (const k of keys) {
    const v = row?.[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return String(v).trim();
  }
  // Si existe pero vacío, devolvemos vacío (no null)
  for (const k of keys) {
    const v = row?.[k];
    if (v !== undefined && v !== null) return String(v).trim();
  }
  return "";
}

// Detecta la fila colada de títulos
function isHeaderLikeRow(row) {
  const name = pickAny(row, ["Nombre de Actividad", "Nombre Actividad", "Nombre"]).toLowerCase();
  const city = pickAny(row, ["Ciudad"]).toLowerCase();
  const cat = pickAny(row, ["Categoría", "Categoria"]).toLowerCase();

  return (
    name.includes("nombre") &&
    name.includes("actividad") &&
    city === "ciudad" &&
    (cat.includes("categor") || cat === "categoria")
  );
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
    .filter((r) => pickAny(r, ["Nombre de Actividad", "Nombre Actividad", "Nombre"]).length)
    .filter((r) => !isHeaderLikeRow(r));

  const out = [];
  const idCounts = new Map();

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];

    const name = pickAny(r, ["Nombre de Actividad", "Nombre Actividad", "Nombre"]);
    const city = pickAny(r, ["Ciudad"]);
    const category = pickAny(r, ["Categoría", "Categoria"]);

    // 👇 IMPORTANT: soporta variantes
    const duration = pickAny(r, ["Tiempo Estimado", "Tiempo estimado", "Tiempo", "Duración", "Duracion"]);
    const short = pickAny(r, ["Descripción", "Descripcion", "Descripción corta", "Descripcion corta"]);
    const long = pickAny(r, ["Descripción Amplia", "Descripción amplia", "Descripcion Amplia", "Descripcion amplia", "Detalle", "Detalles"]);

    const baseId = `${slugify(city)}__${slugify(name)}`;
    const count = (idCounts.get(baseId) || 0) + 1;
    idCounts.set(baseId, count);
    const id = count === 1 ? baseId : `${baseId}-${count}`;

    // placeholders (luego enrich reemplaza)
    const image = "/placeholder.svg";
    const thumb = "/placeholder.svg";

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
      thumb,
      lat: geo?.lat ?? null,
      lng: geo?.lng ?? null,
    });
  }

  fs.mkdirSync(path.dirname(outJson), { recursive: true });
  fs.writeFileSync(outJson, JSON.stringify(out, null, 2), "utf8");
  console.log("✅ places.json generado:", outJson, "items:", out.length);
})();
