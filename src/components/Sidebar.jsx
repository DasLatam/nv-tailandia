import SearchBar from './SearchBar';
import PlaceCard from './PlaceCard';

export default function Sidebar({ places, onSearch, onLocationFound, onReset, onDelete, onPlaceClick }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>🇹🇭 NVT</h1>
        <p>Nuestro Viaje a Tailandia</p>
        <a 
          href="https://bahtcalc.vercel.app/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="baht-calculator-btn"
        >
          💱 Calculadora de Baht
        </a>
      </div>
      
      <SearchBar 
        onSearch={onSearch}
        onLocationFound={onLocationFound}
        onReset={onReset}
      />
      
      <div className="places-list">
        <div className="places-count">
          {places.length} lugares encontrados
        </div>
        
        {places.map(place => (
          <div 
            key={place.id} 
            onClick={() => onPlaceClick(place)}
            style={{ cursor: 'pointer' }}
          >
            <PlaceCard 
              place={place} 
              onDelete={onDelete}
            />
          </div>
        ))}
        
        {places.length === 0 && (
          <div className="empty-state">
            <p>😔 No se encontraron lugares</p>
            <p>Intenta con otro término de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
}