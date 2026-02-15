#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(pwd)"
REPO_NAME="$(basename "$REPO_ROOT")"
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT_DIR="_handoff_${REPO_NAME}_${STAMP}"
HANDOFF_ZIP="${REPO_NAME}-handoff.zip"
SRC_ZIP="${REPO_NAME}-src.zip"

have() { command -v "$1" >/dev/null 2>&1; }

safe_copy() {
  local src="$1" dest="$2"
  if [[ -f "$src" ]]; then
    mkdir -p "$(dirname "$dest")"
    cp -f "$src" "$dest"
  fi
}

copy_dir() {
  local src="$1" dest="$2"
  if [[ -d "$src" ]]; then
    mkdir -p "$dest"
    if have rsync; then
      rsync -a \
        --exclude "node_modules" \
        --exclude ".next" \
        --exclude ".git" \
        --exclude ".vercel" \
        --exclude "dist" \
        --exclude "build" \
        --exclude "out" \
        "$src/" "$dest/"
    else
      (cd "$src" && tar -cf - .) | (cd "$dest" && tar -xf -)
    fi
  fi
}

if ! have git; then
  echo "ERROR: git no está disponible."
  exit 1
fi

mkdir -p "$OUT_DIR/meta" "$OUT_DIR/files"

# --- Env / versions ---
{
  echo "date: $(date -Iseconds)"
  echo "pwd: $REPO_ROOT"
  echo "branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)"
  echo "head: $(git rev-parse HEAD 2>/dev/null || true)"
  echo
  echo "node: $(node -v 2>/dev/null || echo 'N/A')"
  echo "npm:  $(npm -v 2>/dev/null || echo 'N/A')"
  echo "pnpm: $(pnpm -v 2>/dev/null || echo 'N/A')"
  echo "yarn: $(yarn -v 2>/dev/null || echo 'N/A')"
} > "$OUT_DIR/meta/env.txt" || true

# --- Git meta ---
git status --porcelain=v1 > "$OUT_DIR/meta/git_status_porcelain.txt" || true
git status > "$OUT_DIR/meta/git_status.txt" || true
git remote -v > "$OUT_DIR/meta/git_remote.txt" || true
git log -n 30 --oneline > "$OUT_DIR/meta/git_log_30.txt" || true
git diff > "$OUT_DIR/meta/git_diff_worktree.patch" || true
git diff --staged > "$OUT_DIR/meta/git_diff_staged.patch" || true

# --- Tree / file inventory ---
if have tree; then
  tree -a -L 6 -I "node_modules|.next|.git|.vercel|dist|build|out" > "$OUT_DIR/meta/tree_L6.txt" || true
else
  find . -maxdepth 6 \
    -not -path "./node_modules/*" \
    -not -path "./.next/*" \
    -not -path "./.git/*" \
    -not -path "./.vercel/*" \
    -not -path "./dist/*" \
    -not -path "./build/*" \
    -not -path "./out/*" \
    -print > "$OUT_DIR/meta/find_maxdepth6.txt" || true
fi

# --- Route inventory ---
if [[ -d "app" ]]; then
  find app -type f \( -name "page.*" -o -name "layout.*" -o -name "route.*" -o -name "loading.*" -o -name "error.*" -o -name "not-found.*" \) \
    | sed 's#^\./##' | sort > "$OUT_DIR/meta/app_router_files.txt" || true
fi
if [[ -d "app/datos" ]]; then
  find app/datos -type f | sed 's#^\./##' | sort > "$OUT_DIR/meta/datos_files.txt" || true
fi

# --- Key config files ---
safe_copy "package.json" "$OUT_DIR/files/package.json"
safe_copy "next.config.js" "$OUT_DIR/files/next.config.js"
safe_copy "next.config.mjs" "$OUT_DIR/files/next.config.mjs"
safe_copy "next.config.ts" "$OUT_DIR/files/next.config.ts"
safe_copy "tsconfig.json" "$OUT_DIR/files/tsconfig.json"
safe_copy "vercel.json" "$OUT_DIR/files/vercel.json"
safe_copy "README.md" "$OUT_DIR/files/README.md"
safe_copy "pnpm-lock.yaml" "$OUT_DIR/files/pnpm-lock.yaml"
safe_copy "package-lock.json" "$OUT_DIR/files/package-lock.json"
safe_copy "yarn.lock" "$OUT_DIR/files/yarn.lock"

# --- Copy relevant source dirs ---
copy_dir "app" "$OUT_DIR/files/app"
copy_dir "components" "$OUT_DIR/files/components"
copy_dir "lib" "$OUT_DIR/files/lib"
copy_dir "styles" "$OUT_DIR/files/styles"
copy_dir "scripts" "$OUT_DIR/files/scripts"
copy_dir "content" "$OUT_DIR/files/content"
copy_dir "data" "$OUT_DIR/files/data"

# --- Public: copy files <= 4MB + full inventory ---
if [[ -d "public" ]]; then
  mkdir -p "$OUT_DIR/files/public"
  while IFS= read -r f; do
    d="$OUT_DIR/files/$f"
    mkdir -p "$(dirname "$d")"
    cp -f "$f" "$d"
  done < <(find public -type f -size -4M | sed 's#^\./##')
  find public -type f -print | sed 's#^\./##' | sort > "$OUT_DIR/meta/public_all_files.txt" || true
  find public -type f -size +4M -print | sed 's#^\./##' | sort > "$OUT_DIR/meta/public_big_files_over_4MB.txt" || true
fi

# --- Activities artifacts presence ---
{
  echo "== activities sources =="
  [[ -f "data/activities.csv" ]] && echo "OK: data/activities.csv" || echo "MISS: data/activities.csv"
  [[ -f "public/data/activities.json" ]] && echo "OK: public/data/activities.json" || echo "MISS: public/data/activities.json"
  [[ -f "scripts/build-data.mjs" ]] && echo "OK: scripts/build-data.mjs" || echo "MISS: scripts/build-data.mjs"
} > "$OUT_DIR/meta/activities_artifacts.txt"

# --- Create source zip from git ---
echo "==> Creating $SRC_ZIP from git archive (HEAD)…"
git archive --format=zip -o "$SRC_ZIP" HEAD

# --- Create handoff zip ---
echo "==> Creating $HANDOFF_ZIP …"
if have zip; then
  (cd "$OUT_DIR" && zip -qr "../$HANDOFF_ZIP" .)
else
  python3 - <<'PY'
import os, zipfile
out_dir = os.environ["OUT_DIR"]
zip_name = os.environ["HANDOFF_ZIP"]
with zipfile.ZipFile(zip_name, "w", compression=zipfile.ZIP_DEFLATED) as z:
    for root, _, files in os.walk(out_dir):
        for fn in files:
            p = os.path.join(root, fn)
            arc = os.path.relpath(p, out_dir)
            z.write(p, arc)
PY
fi

echo "DONE."
echo "1) $SRC_ZIP"
echo "2) $HANDOFF_ZIP"
