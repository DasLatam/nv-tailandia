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
