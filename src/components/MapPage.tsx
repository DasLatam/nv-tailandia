"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import MapView from "./MapView";
import Sidebar from "./Sidebar";
import PlaceDrawer from "./PlaceDrawer";

export type Place = {
  id: string;
  name: string;
  city: string;
  category: string;
  duration: string;
  short: string;
  long: string;
  image: string;
  thumb?: string;
  imageSource?: string;
  lat: number | null;
  lng: number | null;
};

export default function MapPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [visibleIds, setVisibleIds] = useState<Set<string> | null>(null);
  const [selected, setSelected] = useState<Place | null>(null);
  const [query, setQuery] = useState("");

  // Leaflet map instance (client only)
  const mapRef = useRef<any>(null);

  useEffect(() => {
    fetch("/places.json")
      .then((r) => r.json())
      .then((data: Place[]) => setPlaces(data))
      .catch(() => setPlaces([]));
  }, []);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    let base = places;

    // visibleIds null => mostrar todo (zoom out)
    if (visibleIds) base = base.filter((p) => visibleIds.has(p.id));
    if (!q) return base;

    return base.filter((p) => {
      const hay = `${p.name} ${p.city} ${p.category} ${p.short}`.toLowerCase();
      return hay.includes(q);
    });
  }, [places, visibleIds, query]);

  const mappable = useMemo(
    () => places.filter((p) => typeof p.lat === "number" && typeof p.lng === "number"),
    [places]
  );

  function openDetail(p: Place, opts?: { fly?: boolean }) {
    setSelected(p);

    if (opts?.fly && mapRef.current && typeof p.lat === "number" && typeof p.lng === "number") {
      const targetZoom = Math.max(mapRef.current.getZoom?.() ?? 6, 12);
      mapRef.current.flyTo([p.lat, p.lng], targetZoom, { animate: true, duration: 0.8 });
    }
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-white">
      <Sidebar
        total={places.length}
        shown={shown.length}
        query={query}
        setQuery={setQuery}
        items={shown as any}
        onPick={(p) => openDetail(p, { fly: true })}
      />

      <div className="flex-1 relative">
        <MapView
          places={mappable as any}
          onVisibleIdsChange={(ids) => setVisibleIds(ids)}
          onMapReady={(map) => (mapRef.current = map)}
          onOpenDetail={(p) => openDetail(p, { fly: false })}
        />

        <PlaceDrawer place={selected as any} onClose={() => setSelected(null)} />
      </div>
    </div>
  );
}
