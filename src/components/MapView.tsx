"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { useEffect } from "react";
import type { Place } from "./MapPage";

type Props = {
  places: Place[];
  onPick: (p: Place) => void;
  onVisibleIdsChange: (ids: Set<string> | null) => void;
};

function FixLeafletIcons() {
  useEffect(() => {
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

    // zoom país o más abierto => mostrar los 112 items
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

  useEffect(() => update(), [places.length]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

export default function MapView({ places, onPick, onVisibleIdsChange }: Props) {
  const center: [number, number] = [13.7563, 100.5018]; // Bangkok

  return (
    <MapContainer center={center} zoom={6} className="h-full w-full">
      <FixLeafletIcons />
      <BoundsWatcher places={places} onVisibleIdsChange={onVisibleIdsChange} />

      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {places.map((p) => (
        <Marker
          key={p.id}
          position={[p.lat as number, p.lng as number]}
          eventHandlers={{ click: () => onPick(p) }}
        >
          <Popup>
            <div className="w-64">
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm opacity-80">
                {p.city} • {p.category}
              </div>
              <div className="text-sm mt-1">{p.duration}</div>
              <div className="text-sm mt-1">{p.short}</div>
              <div className="text-xs opacity-60 mt-2">Click para ver detalle</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
