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
    // dejamos default como fallback
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

// Iconos simples por categoría (sin exagerar)
function iconEmojiFor(place: Place) {
  const t = `${place.category || ""} ${place.name || ""}`.toLowerCase();

  if (t.includes("vuelo") || t.includes("flight") || t.includes("aeropuerto")) return "✈️";
  if (t.includes("hotel") || t.includes("resort") || t.includes("hostel") || t.includes("novotel") || t.includes("column")) return "🏨";
  if (t.includes("templo") || t.includes("wat ") || t.includes("pagoda") || t.includes("buda")) return "🛕";
  if (t.includes("shopping") || t.includes("mercado") || t.includes("mall") || t.includes("compras") || t.includes("market")) return "🛍️";
  if (t.includes("comida") || t.includes("food") || t.includes("café") || t.includes("cafe") || t.includes("restaurant") || t.includes("gastr")) return "🍜";

  return "📍";
}

function makeIcon(emoji: string) {
  // DivIcon simple y legible
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 28px; height: 28px;
        border-radius: 999px;
        background: rgba(255,255,255,0.95);
        border: 1px solid rgba(17,24,39,0.25);
        display:flex; align-items:center; justify-content:center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.18);
        font-size: 16px;
      ">${emoji}</div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -12],
    tooltipAnchor: [0, -12],
  });
}

export default function MapView({ places, onVisibleIdsChange, onOpenDetail, onMapReady }: Props) {
  const center: [number, number] = [13.7563, 100.5018];

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
        const icon = makeIcon(iconEmojiFor(p));

        return (
          <Marker key={p.id} position={[p.lat as number, p.lng as number]} icon={icon}>
            {/* Tooltip (hover) */}
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
                    style={{ width: 72, height: 48, objectFit: "cover", borderRadius: 8, background: "#f3f4f6" }}
                    loading="lazy"
                    onError={(e) => (((e.currentTarget as HTMLImageElement).src = "/placeholder.svg"))}
                  />
                  <div style={{ fontSize: 12, lineHeight: 1.3, maxHeight: 48, overflow: "hidden" }}>
                    {p.short || "—"}
                  </div>
                </div>
              </div>
            </Tooltip>

            {/* Popup (click) */}
            <Popup>
              <div style={{ width: 300 }}>
                <div style={{ fontWeight: 800 }}>{p.name}</div>
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
                  {p.city} • {p.category} • {p.duration}
                </div>

                <img
                  src={thumb}
                  alt={p.name}
                  style={{ width: "100%", height: 130, objectFit: "cover", borderRadius: 10, marginTop: 10, background: "#f3f4f6" }}
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
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
