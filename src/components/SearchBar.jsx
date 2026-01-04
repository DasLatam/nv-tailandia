import { useState } from 'react';
import { searchLocation } from '../utils/nominatim';

export default function SearchBar({ onSearch, onLocationFound, onReset }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [foundLocation, setFoundLocation] = useState(null);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      setIsSearching(true);
      const location = await searchLocation(searchTerm);
      setIsSearching(false);
      
      if (location) {
        setFoundLocation(location);
        onLocationFound(location);
      } else {
        alert('No se encontró la ubicación. Intenta con otro término.');
      }
    }
  };

  const handleSaveLocation = () => {
    if (foundLocation && searchTerm.trim()) {
      const newPlace = {
        name: searchTerm,
        lat: foundLocation.lat,
        lng: foundLocation.lng,
        category: 'attraction',
        type: 'custom',
        description: 'Lugar personalizado agregado manualmente',
        visitTime: 'A definir',
        transport: 'A definir',
        dressCode: 'Casual',
        price: 'A definir',
        massage: false,
        imageId: 'TrhLCn1abMU'
      };
      
      onReset(); // This will trigger a save in the parent
      setFoundLocation(null);
      setSearchTerm('');
      alert('Ubicación guardada correctamente');
    }
  };

  return (
    <div className="search-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="Buscar lugares o presiona Enter para buscar en el mapa..."
          value={searchTerm}
          onChange={handleSearch}
          onKeyPress={handleKeyPress}
          className="search-input"
        />
        {isSearching && <div className="search-loader">🔍</div>}
      </div>
      
      {foundLocation && (
        <div className="location-found">
          <div className="location-info">
            <strong>📍 Ubicación encontrada:</strong>
            <p>{foundLocation.displayName}</p>
            <small>Lat: {foundLocation.lat.toFixed(4)}, Lng: {foundLocation.lng.toFixed(4)}</small>
          </div>
          <button onClick={handleSaveLocation} className="save-btn">
            💾 Guardar Lugar
          </button>
        </div>
      )}
      
      <button onClick={onReset} className="reset-btn">
        🔄 Reset Trip
      </button>
    </div>
  );
}