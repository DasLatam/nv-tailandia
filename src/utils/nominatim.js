export const searchLocation = async (query) => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)},Thailand&format=json&limit=1`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'NVT-Tailandia-App'
      }
    });
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name
      };
    }
    return null;
  } catch (error) {
    console.error('Error searching location:', error);
    return null;
  }
};