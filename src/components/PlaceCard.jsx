export default function PlaceCard({ place, onDelete, compact = false }) {
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`¿Eliminar "${place.name}" de tu viaje?`)) {
      onDelete(place.id);
    }
  };

  return (
    <div className={`place-card ${compact ? 'compact' : ''}`}>
      <div className="card-image">
        <img 
          src={place.imageUrl}
          alt={place.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.pexels.com/photos/460376/pexels-photo-460376.jpeg?auto=compress&cs=tinysrgb&w=600';
          }}
        />
        <div className="card-icon">{place.icon}</div>
        <button className="delete-btn" onClick={handleDelete} title="Eliminar">
          🗑️
        </button>
      </div>
      
      <div className="card-content">
        <h3>{place.name}</h3>
        <p className="description">{place.description}</p>
        
        <div className="info-grid">
          <div className="info-item">
            <span className="icon">⏱️</span>
            <span className="text">{place.visitTime}</span>
          </div>
          
          <div className="info-item transport-item" title={place.transportInfo}>
            <span className="icon">🚇</span>
            <span className="text">{place.transport}</span>
            <span className="info-tooltip">ℹ️</span>
          </div>
          
          <div className="info-item">
            <span className="icon">👔</span>
            <span className="text">{place.dressCode}</span>
          </div>
          
          <div className="info-item">
            <span className="icon">💰</span>
            <span className="text">{place.price}</span>
          </div>
          
          {place.massage && (
            <div className="info-item massage">
              <span className="icon">🌸</span>
              <span className="text">Masajes disponibles</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}