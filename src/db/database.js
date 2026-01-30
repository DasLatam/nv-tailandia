import Dexie from 'dexie';

export const db = new Dexie('NVTDatabase');

db.version(1).stores({
  places: '++id, name, lat, lng, category, type'
});

export const initializeDatabase = async (initialPlaces) => {
  const count = await db.places.count();
  if (count === 0) {
    await db.places.bulkAdd(initialPlaces);
  }
};

export const resetDatabase = async (initialPlaces) => {
  await db.places.clear();
  await db.places.bulkAdd(initialPlaces);
};