"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useEffect } from "react";
import type { Place } from "./MapPage";

type Props = {
  places: Place[];
  onPick: (p: Place) => void;
  onVisibleIdsChange: (ids: Set<string> | null) => void;
};

function FixLeafletIcons() {
  useEffect(() => {
    // Fix default marker icons in Next bundlers
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);
  return null;
}

function BoundsWatcher({
  places,
  onVisibleIdsChange,
}: {
  places: Place[];
  onVisibleIdsChange: (ids: Set<string> | null) => void;
}) {
  const map = useMapEvents({
    moveend: () => update(),
    zoomend: () => update(),
  });

  const update = () => {
    const z = map.getZoom();

    // Zoom país o más abierto -> mostrar TODOS en sidebar
    if (z <= 6) {
      onVisibleIdsChange(null);
      return;
    }

    const b = map.getBounds();
    const ids = new Set<string>();
    for (const p of places) {
      if (p.lat == null || p.lng == null) continue;
      if (b.contains([p.lat, p.lng])) ids.add(p.id);
    }
    onVisibleIdsChange(ids);
  };

  useEffect(() => {
    update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places.length]);

  return null;
}

export default function MapView({ places, onPick, onVisibleIdsChange }: Props) {
  // Centro general en Tailandia (Bangkok)
  const center: [number, number] = [13.7563, 100.5018];

  return (
    <MapContainer center={center} zoom={6} className="h-full w-full">
      <FixLeafletIcons />
      <BoundsWatcher places={places} onVisibleIdsChange={onVisibleIdsChange} />

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {places.map((p) => (
        <Marker
          key={p.id}
          position={[p.lat as number, p.lng as number]}
          eventHandlers={{
            click: () => onPick(p), // Click -> abre el Drawer (detalle)
          }}
        />
      ))}
    </MapContainer>
  );
}
