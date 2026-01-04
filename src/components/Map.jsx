import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Función para obtener el icono según el tipo de lugar
const getPlaceIcon = (type) => {
  const icons = {
    temple: '🛕',
    bar: '🍺',
    restaurant: '🍽️',
    viewpoint: '🌄',
    museum: '🏛️',
    reserve: '🐘',
    waterfall: '💧',
    market: '🛍️',
    hotel: '🏨',
    spa: '💆',
    beach: '🏖️',
    neighborhood: '🏙️'
  };
  return icons[type] || '📍';
};

// Iconos personalizados según categoría
const createCustomIcon = (type) => {
  const emoji = getPlaceIcon(type);
  
  // Colores según categoría
  const colorMap = {
    temple: '#FFD700',      // Dorado para templos
    bar: '#9333EA',         // Morado para bares
    restaurant: '#EF4444',  // Rojo para restaurantes
    viewpoint: '#3B82F6',   // Azul para miradores
    museum: '#8B4513',      // Marrón para museos
    reserve: '#10B981',     // Verde para reservas
    waterfall: '#06B6D4',   // Cyan para cascadas
    market: '#F59E0B',      // Naranja para mercados
    hotel: '#6366F1',       // Índigo para hoteles
    spa: '#EC4899',         // Rosa para spas
    beach: '#14B8A6',       // Turquesa para playas
    neighborhood: '#8B5CF6' // Violeta para barrios
  };
  
  const color = colorMap[type] || '#10b981';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 42px;
        height: 42px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="transform: rotate(45deg); font-size: 22px;">${emoji}</span>
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -42]
  });
};

export default function Map({ places, onBoundsChange, center, zoom, selectedPlace }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: center || [13.7563, 100.5018],
      zoom: zoom || 7,
      zoomControl: true
    });

    L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      attribution: '&copy; Google Maps',
      maxZoom: 20
    }).addTo(map);

    mapInstanceRef.current = map;

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

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    places.forEach(place => {
      const icon = createCustomIcon(place.type);
      const marker = L.marker([place.lat, place.lng], { icon }).addTo(mapInstanceRef.current);

      // Badges de disponibilidad
      const getDaysBadge = () => {
        if (place.daysOpen === 'weekend') return '<span class="badge badge-warning">⚠️ Solo fines de semana</span>';
        return '<span class="badge badge-success">✓ Abierto todos los días</span>';
      };

      const getScheduleBadge = () => {
        const schedules = {
          'morning': '<span class="badge badge-morning">🌅 Mañana</span>',
          'evening': '<span class="badge badge-evening">🌆 Tarde</span>',
          'night': '<span class="badge badge-night">🌙 Noche</span>',
          'all-day': '<span class="badge badge-allday">⏰ Todo el día</span>'
        };
        return schedules[place.schedule] || '';
      };

      const getDurationBadge = () => {
        const durations = {
          'hours': '<span class="badge badge-short">⚡ Visita corta (1-3 hrs)</span>',
          'half-day': '<span class="badge badge-medium">🕐 Medio día (3-6 hrs)</span>',
          'full-day': '<span class="badge badge-long">📅 Día completo</span>',
          'accommodation': ''
        };
        return durations[place.visitDuration] || '';
      };

      const popupContent = `
        <div class="popup-card">
          <img src="${place.imageUrl}" alt="${place.name}" onerror="this.src='https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop'" />
          <div class="popup-icon">${getPlaceIcon(place.type)}</div>
          <div class="popup-content">
            <h3>${place.name}</h3>
            <div class="popup-badges">
              ${getDaysBadge()}
              ${getScheduleBadge()}
              ${getDurationBadge()}
            </div>
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
        maxWidth: 340,
        className: 'custom-popup'
      });

      markersRef.current.push(marker);
    });
  }, [places]);

  useEffect(() => {
    if (mapInstanceRef.current && center && zoom) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

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