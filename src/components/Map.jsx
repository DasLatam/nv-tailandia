import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Iconos personalizados con emojis específicos
const createCustomIcon = (color, emoji) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 40px;
        height: 40px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="transform: rotate(45deg); font-size: 20px;">${emoji}</span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

const getIconColor = (category) => {
  const colors = {
    hotel: '#3b82f6',
    bar: '#a855f7',
    attraction: '#eab308'
  };
  return colors[category] || '#10b981';
};

export default function Map({ places, onBoundsChange, center, zoom, selectedPlace }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [, setForceUpdate] = useState(0);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Inicializar mapa con tiles de Google Maps
    const map = L.map(mapRef.current, {
      center: center || [13.7563, 100.5018], // Bangkok por defecto
      zoom: zoom || 7,
      zoomControl: true
    });

    // Google Maps tiles
    L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      attribution: '&copy; Google Maps',
      maxZoom: 20
    }).addTo(map);

    mapInstanceRef.current = map;

    // Listener para cambios de bounds
    map.on('moveend', () => {
      const bounds = map.getBounds();
      onBoundsChange(bounds);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Actualizar marcadores cuando cambian los lugares
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Limpiar marcadores existentes
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Agregar nuevos marcadores
    places.forEach(place => {
      const color = getIconColor(place.category);
      const icon = createCustomIcon(color, place.icon || '📍');
      const marker = L.marker([place.lat, place.lng], { icon }).addTo(mapInstanceRef.current);

      // Popup con la misma información que la tarjeta
      const popupContent = `
        <div class="popup-card">
          <img src="${place.imageUrl}" alt="${place.name}" onerror="this.src='https://images.pexels.com/photos/460376/pexels-photo-460376.jpeg?auto=compress&cs=tinysrgb&w=600'" />
          <div class="popup-icon">${place.icon}</div>
          <div class="popup-content">
            <h3>${place.name}</h3>
            <p>${place.description}</p>
            <div class="popup-info-grid">
              <div class="popup-info-item">
                <span>⏱️</span> ${place.visitTime}
              </div>
              <div class="popup-info-item" title="${place.transportInfo}">
                <span>🚇</span> ${place.transport}
              </div>
              <div class="popup-info-item">
                <span>👔</span> ${place.dressCode}
              </div>
              <div class="popup-info-item">
                <span>💰</span> ${place.price}
              </div>
              ${place.massage ? '<div class="popup-info-item massage"><span>🌸</span> Masajes disponibles</div>' : ''}
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 320,
        className: 'custom-popup'
      });

      markersRef.current.push(marker);
    });
  }, [places]);

  // Centrar mapa cuando se encuentra una nueva ubicación
  useEffect(() => {
    if (mapInstanceRef.current && center && zoom) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Abrir popup del lugar seleccionado
  useEffect(() => {
    if (selectedPlace && mapInstanceRef.current) {
      const marker = markersRef.current.find(m => {
        const latlng = m.getLatLng();
        return latlng.lat === selectedPlace.lat && latlng.lng === selectedPlace.lng;
      });
      
      if (marker) {
        mapInstanceRef.current.setView([selectedPlace.lat, selectedPlace.lng], 14);
        marker.openPopup();
      }
    }
  }, [selectedPlace]);

  return (
    <div className="map-container">
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}