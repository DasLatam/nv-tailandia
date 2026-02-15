# v13g — DATOS: lectura más clara (sin cambiar estructura)

Cambios:
- /datos: arranca con una mini-introducción (“Qué hay acá”) y luego **Capítulos**.
- Se renombra “Modo vuelo” -> **Portada de lectura** (misma ruta /datos/vuelo, solo copy/UI).
- Header: el link dice **Portada** (no “Modo vuelo”) y el badge pasa a:
  - Online: **Sincronizado**
  - Offline: **Sin conexión: OK**
  - Si falta cache: “Sin conexión: sincronizar” (sin banners molestos).
- La sincronización sigue siendo automática; solo se aclara “conectate y recargá” si querés refrescar.

Archivos tocados:
- components/pwa/AutoOfflineWarmup.tsx
- app/datos/layout.tsx
- app/datos/page.tsx
- app/datos/vuelo/page.tsx
