"use client";

import { useEffect, useMemo, useState } from "react";
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
  lat: number | null;
  lng: number | null;
};

export default function MapPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [visibleIds, setVisibleIds] = useState<Set<string> | null>(null);
  const [selected, setSelected] = useState<Place | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/places.json")
      .then((r) => r.json())
      .then((data: Place[]) => setPlaces(data))
      .catch(() => setPlaces([]));
  }, []);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    let base = places;

    // visibleIds null => mostrar todo (zoom país)
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

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-white">
      <Sidebar
        total={places.length}
        shown={shown.length}
        query={query}
        setQuery={setQuery}
        items={shown}
        onPick={(p) => setSelected(p)}
      />

      <div className="flex-1 relative">
        <MapView
          places={mappable}
          onPick={(p) => setSelected(p)}
          onVisibleIdsChange={(ids) => setVisibleIds(ids)}
        />
        <PlaceDrawer place={selected} onClose={() => setSelected(null)} />
      </div>
    </div>
  );
}
