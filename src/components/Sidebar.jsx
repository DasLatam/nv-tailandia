import { useState } from 'react';
import SearchBar from './SearchBar';
import PlaceCard from './PlaceCard';

export default function Sidebar({ places, onSearch, onLocationFound, onReset, onDelete, onPlaceClick }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
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
      
      <button 
        className="mobile-toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? "Mostrar lista" : "Ocultar lista"}
      >
        {isCollapsed ? '👆 Mostrar Lista' : '👇 Ocultar Lista'}
      </button>
      
      <div className="sidebar-content">
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
    </div>
  );
}