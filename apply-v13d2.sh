#!/usr/bin/env bash
set -euo pipefail

# Apply nv-tailandia patch v13d2 on top of an existing repo.
# Usage:
#   bash apply-v13d2.sh /path/to/nv-tailandia-v13d2-offline-no-button.zip
# If no arg is provided, it defaults to ~/Downloads/nv-tailandia-v13d2-offline-no-button.zip

ZIP_PATH="${1:-$HOME/Downloads/nv-tailandia-v13d2-offline-no-button.zip}"

if [[ ! -f "$ZIP_PATH" ]]; then
  echo "ZIP not found: $ZIP_PATH" >&2
  exit 1
fi

echo "Applying: $ZIP_PATH"
unzip -o "$ZIP_PATH"

echo
echo "Suggested git commands:"
echo "  git add public/sw.js components/pwa/AutoOfflineWarmup.tsx app/datos/layout.tsx app/datos/vuelo/page.tsx app/page.tsx components/MapView.tsx components/ActivityModal.tsx PATCH_NOTES_v13d2.md"
echo "  git commit -m "pwa: offline sin botón + cache imágenes + fallback mapa/datos""
echo "  git push"
