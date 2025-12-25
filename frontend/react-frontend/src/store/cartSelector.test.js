// Unit tests for cart selectors

import {
  selectCartItems,
  selectCartCount,
  selectCartInitialPrice,
  selectCartTotalPrice,
} from "./cartSelector";

describe("cartSelector", () => {
  test("selectCartItems returns items array", () => {
    const state = {
      cart: {
        items: [{ id: 1, qty: 2, price: 100 }],
      },
    };

    expect(selectCartItems(state)).toEqual([{ id: 1, qty: 2, price: 100 }]);
  });

  test("selectCartCount sums qty", () => {
    const state = {
      cart: {
        items: [
          { id: 1, qty: 2, price: 100 },
          { id: 2, qty: 3, price: 50 },
        ],
      },
    };

    expect(selectCartCount(state)).toBe(5);
  });

  test("selectCartInitialPrice sums price * qty", () => {
    const state = {
      cart: {
        items: [
          { id: 1, qty: 2, price: 100 }, // 200
          { id: 2, qty: 3, price: 50 },  // 150
        ],
      },
    };

    expect(selectCartInitialPrice(state)).toBe(350);
  });

  test("selectCartTotalPrice is alias of selectCartInitialPrice", () => {
    const state = {
      cart: {
        items: [{ id: 1, qty: 2, price: 100 }],
      },
    };

    expect(selectCartTotalPrice(state)).toBe(selectCartInitialPrice(state));
  });

  test("selectors work with empty cart", () => {
    const state = { cart: { items: [] } };

    expect(selectCartItems(state)).toEqual([]);
    expect(selectCartCount(state)).toBe(0);
    expect(selectCartInitialPrice(state)).toBe(0);
    expect(selectCartTotalPrice(state)).toBe(0);
  });
});
