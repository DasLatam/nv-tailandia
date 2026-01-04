export default function PlaceCard({ place, onDelete, compact = false }) {
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`¿Eliminar "${place.name}" de tu viaje?`)) {
      onDelete(place.id);
    }
  };

  const getDaysBadge = () => {
    if (place.daysOpen === 'weekend') {
      return <span className="badge badge-warning">⚠️ Solo fines de semana</span>;
    }
    return <span className="badge badge-success">✓ Todos los días</span>;
  };

  const getScheduleBadge = () => {
    const schedules = {
      'morning': { icon: '🌅', text: 'Mañana', class: 'badge-morning' },
      'evening': { icon: '🌆', text: 'Tarde', class: 'badge-evening' },
      'night': { icon: '🌙', text: 'Noche', class: 'badge-night' },
      'all-day': { icon: '⏰', text: 'Todo el día', class: 'badge-allday' }
    };
    const schedule = schedules[place.schedule];
    if (!schedule) return null;
    return <span className={`badge ${schedule.class}`}>{schedule.icon} {schedule.text}</span>;
  };

  const getDurationBadge = () => {
    const durations = {
      'hours': { icon: '⚡', text: 'Visita corta', class: 'badge-short' },
      'half-day': { icon: '🕐', text: 'Medio día', class: 'badge-medium' },
      'full-day': { icon: '📅', text: 'Día completo', class: 'badge-long' },
      'accommodation': null
    };
    const duration = durations[place.visitDuration];
    if (!duration) return null;
    return <span className={`badge ${duration.class}`}>{duration.icon} {duration.text}</span>;
  };

  const getPlaceIcon = (type) => {
    const icons = {
      temple: '⛩️',
      bar: '🍺',
      restaurant: '🍽️',
      viewpoint: '👁️',
      museum: '🖼️',
      reserve: '🦋',
      waterfall: '💧',
      market: '🏪',
      hotel: '🛏️',
      spa: '🧖',
      beach: '🏖️',
      neighborhood: '🚶',
      experience: '✨'
    };
    return icons[type] || '📍';
  };

  return (
    <div className={`place-card ${compact ? 'compact' : ''}`}>
      <div className="card-image">
        <img 
          src={place.imageUrl}
          alt={place.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop';
          }}
        />
        <div className="card-icon">{getPlaceIcon(place.type)}</div>
        <button className="delete-btn" onClick={handleDelete} title="Eliminar">
          🗑️
        </button>
      </div>
      
      <div className="card-content">
        <h3>{place.name}</h3>
        
        <div className="card-badges">
          {getDaysBadge()}
          {getScheduleBadge()}
          {getDurationBadge()}
        </div>
        
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