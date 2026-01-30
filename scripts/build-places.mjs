import fs from "fs";
import path from "path";
import Papa from "papaparse";

const inCsv = path.join(process.cwd(), "data", "Hoja8.csv");
const outJson = path.join(process.cwd(), "public", "places.json");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function slugify(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function geocode(q) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "nv-tailandia/1.0 (contact: ariel@baudry.com.ar)"
    }
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data?.length) return null;
  return { lat: Number(data[0].lat), lng: Number(data[0].lon) };
}

(async () => {
  const csvText = fs.readFileSync(inCsv, "utf8");
  const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });

  const rows = parsed.data.filter(r => r["Nombre de Actividad"]);

  const out = [];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const name = r["Nombre de Actividad"];
    const city = r["Ciudad"];
    const q = `${name}, ${city}, Thailand`;

    const image = `https://source.unsplash.com/featured/?${encodeURIComponent(name + " " + city + " thailand")}`;

    const geo = await geocode(q);
    await sleep(1100);

    out.push({
      id: `${slugify(city)}__${slugify(name)}`,
      name,
      city,
      category: r["Categoría"],
      duration: r["Tiempo Estimado"],
      short: r["Descripción"],
      long: r["Descripción Amplia"],
      image,
      lat: geo?.lat ?? null,
      lng: geo?.lng ?? null,
    });

    console.log(`[${i + 1}/${rows.length}] ${name}`);
  }

  fs.writeFileSync(outJson, JSON.stringify(out, null, 2));
  console.log("✅ places.json generado");
})();

