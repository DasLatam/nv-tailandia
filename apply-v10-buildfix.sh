#!/usr/bin/env bash
set -euo pipefail

FILE="components/MapView.tsx"
if [[ ! -f "$FILE" ]]; then
  echo "ERROR: No encuentro $FILE (corré esto desde la raíz del repo nv-tailandia)."
  exit 1
fi

node <<'NODE'
const fs = require('fs');

const file = 'components/MapView.tsx';
let s = fs.readFileSync(file, 'utf8');
const orig = s;

// 1) Fix específico: addSource('user-accuracy', { type: 'geojson', data: polyData })
s = s.replace(
  /(addSource\(\s*['"]user-accuracy['"]\s*,\s*\{\s*type\s*:\s*['"]geojson['"]\s*,\s*data\s*:\s*)polyData(\s*\}\s*\))/m,
  '$1(polyData as any)$2'
);

// 2) Fallback: si el formato varía (igual queremos castear polyData)
if (s === orig) {
  s = s.replace(
    /(addSource\(\s*['"]user-accuracy['"][\s\S]*?data\s*:\s*)polyData(\s*[\}\)])/m,
    '$1(polyData as any)$2'
  );
}

if (s === orig) {
  console.error('ERROR: no pude aplicar el parche (no encontré el patrón de user-accuracy).');
  process.exit(2);
}

fs.writeFileSync(file, s, 'utf8');
console.log('OK: parche aplicado ->', file);
NODE

echo "Siguiente: git add components/MapView.tsx && git commit -m "Fix TS GeoJSON type" && git push"
