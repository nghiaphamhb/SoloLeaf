const store = new Map();

export function cacheGet(key) {
    const hit = store.get(key);
    if (!hit) return null;
    if (hit.expireAt < Date.now()) {
        store.delete(key);
        return null;
    }
    return hit.value;
}

export function cacheSet(key, value, ttlMs) {
    store.set(key, { value, expireAt: Date.now() + ttlMs });
}
