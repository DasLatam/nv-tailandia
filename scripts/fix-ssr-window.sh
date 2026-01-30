#!/usr/bin/env bash
set -euo pipefail

echo "==> 1) page.tsx as Server Component (no window usage here)"
cat <<'TSX' > src/app/page.tsx
import ClientOnly from "@/components/ClientOnly";
import MapPage from "@/components/MapPage";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <ClientOnly>
      <MapPage />
    </ClientOnly>
  );
}
TSX

echo "==> 2) Add ClientOnly wrapper that disables SSR for children"
mkdir -p src/components
cat <<'TSX' > src/components/ClientOnly.tsx
"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

// Render children only on client; on server render null.
const NoSSR = dynamic(async () => {
  return function NoSSRWrapper({ children }: { children: ReactNode }) {
    return <>{children}</>;
  };
}, { ssr: false });

export default function ClientOnly({ children }: { children: ReactNode }) {
  return <NoSSR>{children}</NoSSR>;
}
TSX

echo "==> 3) Ensure MapPage remains client component (required for leaflet)"
# If your MapPage.tsx already has "use client"; keep it. This just enforces it.
if ! head -n 1 src/components/MapPage.tsx | grep -q 'use client'; then
  tmpfile="$(mktemp)"
  echo '"use client";' > "$tmpfile"
  cat src/components/MapPage.tsx >> "$tmpfile"
  mv "$tmpfile" src/components/MapPage.tsx
fi

echo "✅ Done. Commit & push:"
echo "   git add src/app/page.tsx src/components/ClientOnly.tsx"
echo "   git commit -m \"Fix SSR window error (client-only map)\""
echo "   git push"
