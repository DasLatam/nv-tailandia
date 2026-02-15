#!/usr/bin/env bash
set -euo pipefail

ZIP_PATH="${1:-}"
if [[ -z "${ZIP_PATH}" ]]; then
  echo "Uso: bash tools/apply-v13i.sh /ruta/al/nv-tailandia-v13i-fixes.zip"
  exit 1
fi

if [[ ! -f "${ZIP_PATH}" ]]; then
  echo "ERROR: No encuentro el ZIP: ${ZIP_PATH}"
  exit 1
fi

# Detect repo root (directory where this script lives -> repo/tools)
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${REPO_DIR}"

if [[ ! -d .git ]]; then
  echo "ERROR: Este directorio no parece ser un repo git (falta .git): ${REPO_DIR}"
  exit 1
fi

echo "==> Repo: ${REPO_DIR}"
echo "==> Aplicando ZIP: ${ZIP_PATH}"

unzip -o "${ZIP_PATH}" >/dev/null

echo "==> Instalando dependencias"
npm install

echo "==> Build local (rápido)"
npm run build

echo "==> Commit + push"
git add -A
if git diff --cached --quiet; then
  echo "Nada para commitear."
else
  git commit -m "v13i: sitemap host-aware + offline home + datos simplificado"
fi

git push

echo "DONE."
