# PATCH v13d2 – Offline “sin botón” + mapa/puntos/imágenes más robustos

## Objetivo
Que el modo avión sea “zero-click”: si abrís el sitio una vez con internet, **/datos** queda disponible offline de forma consistente,
y la home (mapa/lista) no se rompe si el SW tarda o si hay recursos externos.

## Cambios
- Service Worker:
  - Cachea /datos automáticamente en install (no depende de botón)
  - Cache-first para /_next/** (chunks App Router)
  - Manejo de requests App Router con `?_rsc=` (normaliza para cache hit)
  - Cache de **imágenes cross-origin** (fotos de actividades, tiles) oportunista
  - Fallback para imágenes: `/thumbs/actividad.svg` (en vez de offline.html)
- /datos:
  - `AutoOfflineWarmup` se ejecuta solo (pide precache al SW + router.prefetch de rutas /datos)
  - badge compacto no intrusivo
- Home (mapa/lista):
  - `activities.json` con fallback a localStorage (`nv.activities.v1`) si estás offline
  - Mapa: si estás offline o el estilo remoto falla, cae a raster/estilo local para que **los puntos se vean igual**

## Archivos tocados
- public/sw.js
- components/pwa/AutoOfflineWarmup.tsx (nuevo)
- app/datos/layout.tsx
- app/datos/vuelo/page.tsx
- app/page.tsx
- components/MapView.tsx
- components/ActivityModal.tsx

## Nota práctica (iOS/Android)
Para “instalar” como app y que el SW tenga oportunidad de cachear:
1) Abrí el sitio con WiFi/4G.
2) Entrá a /datos/vuelo una vez (o /datos).
3) Volvé a abrir desde el ícono del escritorio.
