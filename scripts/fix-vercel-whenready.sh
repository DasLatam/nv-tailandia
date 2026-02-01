#!/usr/bin/env bash
set -euo pipefail

cat <<'TSX' > src/components/MapView.tsx
"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useMemo, useRef } from "react";
import type { Place } from "./MapPage";

type Props = {
  places: Place[];
  onVisibleIdsChange: (ids: Set<string> | null) => void;
  onOpenDetail: (p: Place) => void;
  onMapReady: (map: any) => void;
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

function MapReady({ onMapReady }: { onMapReady: (map: any) => void }) {
  const map = useMap();
  const did = useRef(false);

  useEffect(() => {
    if (did.current) return;
    did.current = true;
    onMapReady(map);
  }, [map, onMapReady]);

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

export default function MapView({ places, onVisibleIdsChange, onOpenDetail, onMapReady }: Props) {
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
      <MapReady onMapReady={onMapReady} />
      <InvalidateSizeOnMount />
      <BoundsWatcher places={markers} onVisibleIdsChange={onVisibleIdsChange} />

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markers.map((p: any) => {
        const thumb = p.thumb || p.image || "/placeholder.svg";
        return (
          <Marker key={p.id} position={[p.lat as number, p.lng as number]}>
            {/* Hover tooltip */}
            <Tooltip direction="top" opacity={1} offset={[0, -8]} sticky>
              <div style={{ width: 240 }}>
                <div style={{ fontWeight: 700, marginBottom: 2 }}>{p.name}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  {p.city} • {p.category} • {p.duration}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <img
                    src={thumb}
                    alt={p.name}
                    style={{
                      width: 72,
                      height: 48,
                      objectFit: "cover",
                      borderRadius: 8,
                      background: "#f3f4f6",
                    }}
                    loading="lazy"
                    onError={(e) => (((e.currentTarget as HTMLImageElement).src = "/placeholder.svg"))}
                  />
                  <div style={{ fontSize: 12, lineHeight: 1.3, maxHeight: 48, overflow: "hidden" }}>
                    {p.short || "—"}
                  </div>
                </div>
                <div style={{ marginTop: 8, fontSize: 11, opacity: 0.75 }}>
                  Hover: info rápida • Click: resumen + link al detalle
                </div>
              </div>
            </Tooltip>

            {/* Click popup */}
            <Popup>
              <div style={{ width: 300 }}>
                <div style={{ fontWeight: 800 }}>{p.name}</div>
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
                  {p.city} • {p.category} • {p.duration}
                </div>

                <img
                  src={thumb}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: 130,
                    objectFit: "cover",
                    borderRadius: 10,
                    marginTop: 10,
                    background: "#f3f4f6",
                  }}
                  loading="lazy"
                  onError={(e) => (((e.currentTarget as HTMLImageElement).src = "/placeholder.svg"))}
                />

                <div style={{ marginTop: 10, fontSize: 13 }}>
                  <div style={{ fontWeight: 700 }}>Descripción</div>
                  <div style={{ marginTop: 3 }}>{p.short || "—"}</div>
                </div>

                <button
                  style={{
                    marginTop: 12,
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid #e5e7eb",
                    background: "white",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  onClick={() => onOpenDetail(p)}
                >
                  Ver detalle completo
                </button>

                <div style={{ marginTop: 8, fontSize: 11, opacity: 0.7 }}>
                  Incluye descripción amplia + todo el CSV.
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
TSX

echo "✅ MapView.tsx fixed (no whenReady)."
echo "Now:"
echo "  npm run build"
echo "  git add src/components/MapView.tsx"
echo "  git commit -m \"Fix MapContainer map-ready typing for Vercel\""
echo "  git push"
