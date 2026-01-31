"use client";

import { useEffect, useMemo, useState } from "react";
import type { Place } from "./MapPage";

type AnyPlace = Place & {
  thumb?: string;
  imageSource?: string;
  imageLicense?: string;
  imageCreator?: string;
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-sm font-semibold">{label}</div>
      <div className="text-sm mt-1 whitespace-pre-line">{value || "—"}</div>
    </div>
  );
}

export default function PlaceDrawer({
  place,
  onClose,
}: {
  place: AnyPlace | null;
  onClose: () => void;
}) {
  const [imgSrc, setImgSrc] = useState<string>("/placeholder.svg");

  useEffect(() => {
    if (!place) return;
    setImgSrc(place.image || place.thumb || "/placeholder.svg");
  }, [place]);

  const meta = useMemo(() => {
    if (!place) return [];
    const items: string[] = [];
    if (place.imageSource && place.imageSource !== "missing") items.push(place.imageSource);
    if (place.imageCreator) items.push(`Autor: ${place.imageCreator}`);
    if (place.imageLicense) items.push(`Licencia: ${place.imageLicense}`);
    return items;
  }, [place]);

  if (!place) return null;

  return (
    <div className="absolute right-4 top-4 bottom-4 w-[560px] bg-white shadow-xl rounded-xl overflow-hidden border z-[1000]">
      <div className="flex items-start justify-between px-4 py-3 border-b gap-3 bg-white">
        <div className="min-w-0">
          <div className="font-semibold leading-tight text-lg truncate">
            {place.name || "—"}
          </div>
          <div className="text-sm opacity-70">
            {place.city || "—"} • {place.category || "—"} • {place.duration || "—"}
          </div>
          {meta.length > 0 && (
            <div className="text-xs opacity-60 mt-1">{meta.join(" • ")}</div>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-sm px-3 py-1 rounded-md border hover:bg-gray-50"
        >
          Cerrar
        </button>
      </div>

      <div className="h-60 bg-gray-100">
        <img
          src={imgSrc}
          alt={place.name}
          className="h-60 w-full object-cover"
          loading="lazy"
          onError={() => setImgSrc("/placeholder.svg")}
        />
      </div>

      <div className="p-4 overflow-auto h-[calc(100%-15rem)]">
        <Field label="Nombre de Actividad" value={place.name || ""} />

        <div className="grid grid-cols-2 gap-4 mt-4">
          <Field label="Ciudad" value={place.city || ""} />
          <Field label="Categoría" value={place.category || ""} />
          <Field label="Tiempo estimado" value={place.duration || ""} />
          <Field
            label="Coordenadas"
            value={
              place.lat != null && place.lng != null
                ? `${place.lat.toFixed(5)}, ${place.lng.toFixed(5)}`
                : ""
            }
          />
        </div>

        <div className="mt-5">
          <Field label="Descripción" value={place.short || ""} />
        </div>

        <div className="mt-5">
          <Field label="Descripción amplia" value={place.long || ""} />
        </div>
      </div>
    </div>
  );
}
