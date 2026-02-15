# Mapa de Actividades – Tailandia (CSV → Mapa + Lista)

App web (Next.js + MapLibre) que:

- Renderiza **un punto por cada `Nombre`** (usa `LATLON`; si falta, aplica override o fallback por ciudad).
- Muestra una **lista en columna** (imagen + título + descripción corta).
- La lista se **filtra automáticamente por lo que está dentro del viewport del mapa** (zoom/pan).
- Título de lista: **“Mostrando X de Y referencias”**.
- **Hover** en el punto: tooltip con **título + miniatura**.
- **Click** en punto o item de lista: **popup/modal** con **toda la info del CSV**.

UX:

- Zoom del mapa: **Ctrl + scroll** (para que el scroll normal no “robe” el scroll de la lista).
- Selector de base map: **Vector (mejor calidad)** / **Raster (fallback)**.

---

## 1) Ejecutar local

```bash
npm install
npm run dev
```

Abrí: http://localhost:3000

---

## 2) Actualizar el listado (CSV)

Reemplazá este archivo:

- `data/activities.csv`

Luego:

```bash
npm run data:build
npm run dev
```

> El build genera: `public/data/activities.json` (lo consume la app).

### Imágenes (columna `Image`)

- Si `Image` es una URL pública (empieza con `https://`), se usa como miniatura.
- Si `Image` es un path local servido desde `public` (empieza con `/`), también se usa.
  - Ej: guardá `public/images/wat-arun.jpg` y poné `Image` = `/images/wat-arun.jpg`.
- Si `Image` está vacío o es `Link`, se usa el ícono por `Tipo` (`/thumbs/*.svg`).

> Tip: muchos links de Google Drive/Instagram/Maps **no** son “imagen directa” y no se renderizan en `<img>`. Usá una URL directa a `.jpg/.png` o subí las imágenes a `public/images`.

---

## 3) Publicar en Vercel vía GitHub

### A) Subir a GitHub

Desde la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Mapa actividades Tailandia"
git branch -M main
git remote add origin <TU_REPO_GITHUB_URL>
git push -u origin main
```

### B) Deploy en Vercel

1. Entrá a Vercel → **Add New…** → **Project**
2. Importá el repo
3. Framework: **Next.js** (auto-detect)
4. Build Command: `npm run build` (default)
5. Output: default
6. Deploy

---

## Notas

- Mapa base (default): estilo vector público (OpenFreeMap). Fallback: raster OpenStreetMap.
- Iconos: `public/thumbs/*.svg` (se elige por `Tipo`; fallback a `actividad.svg`).
- Coordenadas faltantes: ver `scripts/build-data.mjs` (`COORD_OVERRIDES_BY_NAME` y `CITY_CENTROIDS`).
