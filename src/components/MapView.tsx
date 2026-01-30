"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useMemo } from "react";
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

function InvalidateSizeOnMount() {
  const map = useMap();
  useEffect(() => {
    const t1 = setTimeout(() => map.invalidateSize(), 0);
    const t2 = setTimeout(() => map.invalidateSize(), 250);
    const t3 = setTimeout(() => map.invalidateSize(), 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [map]);
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

  const markers = useMemo(
    () => places.filter((p) => typeof p.lat === "number" && typeof p.lng === "number"),
    [places]
  );

  return (
    <MapContainer
      center={center}
      zoom={6}
      className="h-full w-full"
      scrollWheelZoom={true}
      doubleClickZoom={true}
      dragging={true}
      touchZoom={true}
      zoomControl={true}
    >
      <FixLeafletIcons />
      <InvalidateSizeOnMount />
      <BoundsWatcher places={markers} onVisibleIdsChange={onVisibleIdsChange} />

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markers.map((p: any) => {
        const thumb = p.thumb || p.image || "/placeholder.svg";
        return (
          <Marker
            key={p.id}
            position={[p.lat as number, p.lng as number]}
            eventHandlers={{
              click: () => onPick(p), // click abre drawer
            }}
          >
            <Popup>
              <div style={{ width: 280 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  {p.city} • {p.category} • {p.duration}
                </div>

                <img
                  src={thumb}
                  alt={p.name}
                  style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8, marginTop: 8, background: "#f3f4f6" }}
                  loading="lazy"
                  onError={(e) => (((e.currentTarget as HTMLImageElement).src = "/placeholder.svg"))}
                />

                <div style={{ marginTop: 8, fontSize: 13 }}>
                  <div style={{ fontWeight: 600 }}>Resumen</div>
                  <div style={{ marginTop: 2 }}>{p.short || "—"}</div>
                </div>

                <div style={{ marginTop: 8, fontSize: 13 }}>
                  <div style={{ fontWeight: 600 }}>Detalle</div>
                  <div style={{ marginTop: 2, maxHeight: 120, overflow: "auto", whiteSpace: "pre-line" }}>
                    {p.long || "—"}
                  </div>
                </div>

                <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
                  Click en el punto o en la lista para ver el panel completo.
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
