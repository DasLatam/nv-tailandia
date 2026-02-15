set -euo pipefail

ZIP_NOTE="Este script asume que ya descomprimiste el ZIP encima del repo (unzip -o)."

# Elegir package manager
if command -v pnpm >/dev/null 2>&1; then
  PM=pnpm
elif command -v yarn >/dev/null 2>&1; then
  PM=yarn
else
  PM=npm
fi

echo "==> $ZIP_NOTE"
echo "==> Instalando dependencias con: $PM"

if [ "$PM" = "pnpm" ]; then
  pnpm install
elif [ "$PM" = "yarn" ]; then
  yarn install
else
  npm install
fi

# Descarga de imágenes (para offline real)
if [ "${NV_SKIP_IMAGES:-0}" = "1" ]; then
  echo "==> NV_SKIP_IMAGES=1 -> saltando descarga de imágenes"
else
  echo "==> Descargando imágenes de actividades a public/img/activities (puede tardar)"
  npm run images:download || true
fi

echo "==> Build"
if [ "$PM" = "pnpm" ]; then
  pnpm run build
elif [ "$PM" = "yarn" ]; then
  yarn build
else
  npm run build
fi

echo "==> Commit + push (si estás en un repo git)"
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git add -A
  git commit -m "v13h: offline robusto + imágenes locales + SEO" || true
  git push || true
else
  echo "(no es un repo git; omitiendo commit/push)"
fi

echo "==> Listo"
