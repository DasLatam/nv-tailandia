"use client";

import { useEffect, useState } from "react";
import type { Place } from "./MapPage";

export default function PlaceDrawer({
  place,
  onClose,
}: {
  place: Place | null;
  onClose: () => void;
}) {
  const [imgSrc, setImgSrc] = useState<string>("/placeholder.svg");

  useEffect(() => {
    if (!place) return;
    setImgSrc(place.image || "/placeholder.svg");
  }, [place]);

  if (!place) return null;

  return (
    <div className="absolute right-4 top-4 bottom-4 w-[460px] bg-white shadow-xl rounded-xl overflow-hidden border z-[1000]">
      <div className="flex items-start justify-between px-4 py-3 border-b gap-3 bg-white">
        <div>
          <div className="font-semibold leading-tight">{place.name}</div>
          <div className="text-sm opacity-70">
            {place.city} • {place.category} • {place.duration}
          </div>
          <div className="text-xs opacity-60 mt-1">Tip: click en otro punto para cambiar de detalle</div>
        </div>

        <button
          onClick={onClose}
          className="text-sm px-3 py-1 rounded-md border hover:bg-gray-50"
        >
          Cerrar
        </button>
      </div>

      <div className="h-52 bg-gray-100">
        <img
          src={imgSrc}
          alt={place.name}
          className="h-52 w-full object-cover"
          loading="lazy"
          onError={() => setImgSrc("/placeholder.svg")}
        />
      </div>

      <div className="p-4 overflow-auto h-[calc(100%-13rem)]">
        <div className="text-sm font-medium">Resumen</div>
        <div className="text-sm mt-1">{place.short || "—"}</div>

        <div className="text-sm font-medium mt-4">Detalle</div>
        <div className="text-sm mt-1 whitespace-pre-line">{place.long || "—"}</div>

        {place.lat != null && place.lng != null && (
          <div className="text-xs opacity-60 mt-4">
            Coordenadas: {place.lat.toFixed(5)}, {place.lng.toFixed(5)}
          </div>
        )}
      </div>
    </div>
  );
}
