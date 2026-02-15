# v13h — Imágenes offline (descarga local) + SW más robusto

## Qué cambia

- Se agrega `scripts/download-activity-images.mjs` para descargar automáticamente las imágenes remotas del CSV a `public/img/activities/`.
- `scripts/build-data.mjs` ahora **prefiere** imágenes locales (`/img/activities/<id>.*`) si existen; si no, usa el link remoto o el icono por tipo.
- `public/sw.js` se actualiza a `v13h1` e intercepta también tiles remotos aunque el request no venga con `destination=image`, evitando errores tipo "Response is null".
- `components/pwa/ServiceWorkerRegister.tsx` ahora recarga la página una vez cuando el SW nuevo toma control (`controllerchange`), para que el usuario quede en la versión nueva sin tener que cerrar/abrir.

## Cómo usar (una sola vez, con internet)

1. Abrí el sitio con internet.
2. Corré: `npm run images:download` (descarga las fotos a `public/img/activities`).
3. Corré: `npm run build` (genera `public/data/activities.json` apuntando a las imágenes locales).

A partir de ahí, las imágenes de actividades funcionan offline (PWA + cache) siempre que estén descargadas.
