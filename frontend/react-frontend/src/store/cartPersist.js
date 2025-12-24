const KEY = "sololeaf_cart_v1";

export function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    // expected shape: { items: [...] }
    if (!parsed || !Array.isArray(parsed.items)) return undefined;
    return parsed;
  } catch {
    return undefined;
  }
}

export function saveCartToStorage(cartState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(cartState));
  } catch {
    // ignore quota / privacy mode errors
  }
}

export function clearCartStorage() {
  try {
    localStorage.removeItem(KEY);
  } catch (e) {
    console.error(e);
  }
}
