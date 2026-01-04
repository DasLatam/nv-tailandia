import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, initializeDatabase, resetDatabase } from './db/database';
import { initialPlaces } from './data/initialPlaces';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [mapBounds, setMapBounds] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [mapZoom, setMapZoom] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Inicializar base de datos
  useEffect(() => {
    initializeDatabase(initialPlaces);
  }, []);

  // Obtener lugares de la base de datos
  const allPlaces = useLiveQuery(() => db.places.toArray()) || [];

  // Filtrar lugares por búsqueda y bounds del mapa
  const filteredPlaces = allPlaces.filter(place => {
    // Filtro por texto de búsqueda
    const matchesSearch = searchTerm === '' || 
      place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por bounds del mapa (sincronización inteligente)
    const matchesBounds = !mapBounds || mapBounds.contains([place.lat, place.lng]);

    return matchesSearch && matchesBounds;
  });

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleLocationFound = (location) => {
    setMapCenter([location.lat, location.lng]);
    setMapZoom(14);
  };

  const handleReset = async () => {
    if (window.confirm('¿Estás seguro de que quieres restaurar todos los lugares originales?')) {
      await resetDatabase(initialPlaces);
      setSearchTerm('');
      alert('¡Viaje restaurado a los 36 puntos originales!');
    }
  };

  const handleDelete = async (id) => {
    await db.places.delete(id);
  };

  const handleBoundsChange = (bounds) => {
    setMapBounds(bounds);
  };

  const handlePlaceClick = (place) => {
    setSelectedPlace(place);
  };

  return (
    <div className="app">
      <Sidebar
        places={filteredPlaces}
        onSearch={handleSearch}
        onLocationFound={handleLocationFound}
        onReset={handleReset}
        onDelete={handleDelete}
        onPlaceClick={handlePlaceClick}
      />
      <Map
        places={filteredPlaces}
        onBoundsChange={handleBoundsChange}
        center={mapCenter}
        zoom={mapZoom}
        selectedPlace={selectedPlace}
      />
    </div>
  );
}

export default App;