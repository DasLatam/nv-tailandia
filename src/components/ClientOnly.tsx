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
