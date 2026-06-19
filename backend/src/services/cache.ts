interface CacheEntry<T> {
  data: T;
  expiry: number;
}

const store = new Map<string, CacheEntry<unknown>>();
const pending = new Map<string, Promise<unknown>>();

export function getCache<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    store.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCache<T>(key: string, data: T, ttlMs: number): void {
  store.set(key, { data, expiry: Date.now() + ttlMs });
}

export function getPending<T>(key: string): Promise<T> | null {
  return (pending.get(key) as Promise<T>) ?? null;
}

export function setPending<T>(key: string, promise: Promise<T>): void {
  pending.set(key, promise);
  promise.then(() => pending.delete(key), () => pending.delete(key));
}
