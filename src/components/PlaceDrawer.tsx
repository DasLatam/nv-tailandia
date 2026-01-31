"use client";

import { useEffect, useState } from "react";
import type { Place } from "./MapPage";

export default function PlaceDrawer({
  place,
  onClose,
}: {
  place: (Place & any) | null;
  onClose: () => void;
}) {
  const [imgSrc, setImgSrc] = useState<string>("/placeholder.svg");

  useEffect(() => {
    if (!place) return;
    setImgSrc(place.image || place.thumb || "/placeholder.svg");
  }, [place]);

  if (!place) return null;

  const source = place.imageSource ? `Fuente: ${place.imageSource}` : null;

  return (
    <div className="absolute right-4 top-4 bottom-4 w-[520px] bg-white shadow-xl rounded-xl overflow-hidden border z-[1000]">
      <div className="flex items-start justify-between px-4 py-3 border-b gap-3 bg-white">
        <div className="min-w-0">
          <div className="font-semibold leading-tight text-lg truncate">{place.name}</div>
          <div className="text-sm opacity-70">
            {place.city} • {place.category} • {place.duration}
          </div>
          {source && <div className="text-xs opacity-60 mt-1">{source}</div>}
        </div>

        <button
          onClick={onClose}
          className="text-sm px-3 py-1 rounded-md border hover:bg-gray-50"
        >
          Cerrar
        </button>
      </div>

      <div className="h-56 bg-gray-100">
        <img
          src={imgSrc}
          alt={place.name}
          className="h-56 w-full object-cover"
          loading="lazy"
          onError={() => setImgSrc("/placeholder.svg")}
        />
      </div>

      <div className="p-4 overflow-auto h-[calc(100%-14rem)]">
        <div className="text-sm font-semibold">Nombre de Actividad</div>
        <div className="text-sm mt-1">{place.name || "—"}</div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <div className="text-sm font-semibold">Ciudad</div>
            <div className="text-sm mt-1">{place.city || "—"}</div>
          </div>
          <div>
            <div className="text-sm font-semibold">Categoría</div>
            <div className="text-sm mt-1">{place.category || "—"}</div>
          </div>
          <div>
            <div className="text-sm font-semibold">Tiempo estimado</div>
            <div className="text-sm mt-1">{place.duration || "—"}</div>
          </div>
          <div>
            <div className="text-sm font-semibold">Coordenadas</div>
            <div className="text-sm mt-1">
              {place.lat != null && place.lng != null ? `${place.lat.toFixed(5)}, ${place.lng.toFixed(5)}` : "—"}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="text-sm font-semibold">Descripción</div>
          <div className="text-sm mt-1 whitespace-pre-line">{place.short || "—"}</div>
        </div>

        <div className="mt-5">
          <div className="text-sm font-semibold">Descripción amplia</div>
          <div className="text-sm mt-1 whitespace-pre-line">{place.long || "—"}</div>
        </div>
      </div>
    </div>
  );
}
