set -euo pipefail

ZIP="${1:-$HOME/Downloads/nv-tailandia-v13e-offline-metadata.zip}"

if [ ! -f "$ZIP" ]; then
  echo "No encuentro el ZIP en: $ZIP"
  echo "Pasame la ruta correcta como argumento:"
  echo "  bash install_v13e.sh /ruta/al/zip"
  exit 1
fi

echo "Aplicando overlay: $ZIP"
unzip -o "$ZIP" -d .

echo "Probando build local (opcional pero recomendado)..."
npm install
npm run build

echo "Commit + push..."
git add -A
git commit -m "PWA: offline robust + mapa offline + metadata + google verification"
git push

echo "OK."
