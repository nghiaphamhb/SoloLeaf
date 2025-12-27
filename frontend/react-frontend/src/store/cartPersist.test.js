// Unit tests for localStorage cart persistence helpers

import { loadCartFromStorage, saveCartToStorage, clearCartStorage } from "./cartPersist.js";

describe("cartPersist", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  test("loadCartFromStorage returns undefined when nothing stored", () => {
    expect(loadCartFromStorage()).toBeUndefined();
  });

  test("loadCartFromStorage returns parsed cart when shape is valid", () => {
    localStorage.setItem("sololeaf_cart_v1", JSON.stringify({ items: [{ id: 1, qty: 2 }] }));
    expect(loadCartFromStorage()).toEqual({ items: [{ id: 1, qty: 2 }] });
  });

  test("loadCartFromStorage returns undefined when JSON is invalid", () => {
    localStorage.setItem("sololeaf_cart_v1", "{not-json");
    expect(loadCartFromStorage()).toBeUndefined();
  });

  test("loadCartFromStorage returns undefined when parsed shape is invalid", () => {
    localStorage.setItem("sololeaf_cart_v1", JSON.stringify({ items: "not-array" }));
    expect(loadCartFromStorage()).toBeUndefined();

    localStorage.setItem("sololeaf_cart_v1", JSON.stringify({}));
    expect(loadCartFromStorage()).toBeUndefined();
  });

  test("saveCartToStorage stores JSON string", () => {
    saveCartToStorage({ items: [{ id: 1, qty: 1 }] });
    const raw = localStorage.getItem("sololeaf_cart_v1");
    expect(raw).toBe(JSON.stringify({ items: [{ id: 1, qty: 1 }] }));
  });

  test("saveCartToStorage ignores localStorage errors", () => {
    const spy = jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Quota exceeded");
    });

    expect(() => saveCartToStorage({ items: [] })).not.toThrow();
    expect(spy).toHaveBeenCalled();
  });

  test("clearCartStorage removes key", () => {
    localStorage.setItem("sololeaf_cart_v1", JSON.stringify({ items: [{ id: 1 }] }));
    clearCartStorage();
    expect(localStorage.getItem("sololeaf_cart_v1")).toBeNull();
  });

  test("clearCartStorage catches remove errors and logs", () => {
    const logSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("remove failed");
    });

    expect(() => clearCartStorage()).not.toThrow();
    expect(logSpy).toHaveBeenCalled();
  });
});
