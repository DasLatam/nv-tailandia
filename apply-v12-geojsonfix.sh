#!/usr/bin/env bash
set -euo pipefail

FILE="components/MapView.tsx"

if [ ! -f "$FILE" ]; then
  echo "ERROR: No encuentro $FILE. Ejecutá esto desde la raíz del repo (donde está package.json)."
  exit 1
fi

before=$(grep -o "user-accuracy" "$FILE" | wc -l | tr -d ' ')
if [ "${before:-0}" -eq 0 ]; then
  echo "ERROR: No encontré 'user-accuracy' dentro de $FILE (el archivo cambió)."
  exit 1
fi

# Fix TS/Vercel: MapLibre types requieren GeoJSON.FeatureCollection literal.
# Cast a any para destrabar el type-check en build.
perl -pi -e "s/\bdata\s*:\s*polyData\b/data: (polyData as any)/g" "$FILE"

echo "OK: aplicado fix TS para user-accuracy (data: (polyData as any))."
