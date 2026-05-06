const cache = new Map();
const CACHE_TTL = 15 * 60 * 1000;

export function getCache(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

export function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}
