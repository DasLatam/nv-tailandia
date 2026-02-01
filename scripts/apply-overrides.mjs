import fs from "fs";
import path from "path";

const placesFile = path.join(process.cwd(), "public", "places.json");
const overridesFile = path.join(process.cwd(), "data", "image_overrides.json");

function norm(s) {
  return (s || "").toString().toLowerCase();
}

function matchesRule(place, rule) {
  const name = norm(place.name);
  const city = norm(place.city);

  const inc = rule.match?.name_includes || [];
  const cityInc = rule.match?.city_includes || [];

  const okName = inc.length === 0 || inc.every((t) => name.includes(norm(t)));
  const okCity = cityInc.length === 0 || cityInc.some((t) => city.includes(norm(t)));

  return okName && okCity;
}

(async () => {
  if (!fs.existsSync(placesFile)) throw new Error("Missing public/places.json");
  if (!fs.existsSync(overridesFile)) throw new Error("Missing data/image_overrides.json");

  const places = JSON.parse(fs.readFileSync(placesFile, "utf8"));
  const overrides = JSON.parse(fs.readFileSync(overridesFile, "utf8"));

  let applied = 0;

  for (const p of places) {
    for (const rule of overrides.rules || []) {
      if (matchesRule(p, rule)) {
        p.thumb = rule.thumb || p.thumb;
        p.image = rule.image || p.image;
        p.imageSource = rule.source || "manual";
        applied++;
        break;
      }
    }
  }

  fs.writeFileSync(placesFile, JSON.stringify(places, null, 2), "utf8");
  console.log("✅ Overrides applied:", applied);
})();
