// Tests for Redux Toolkit cart slice reducer/actions

import cartReducer, { addItem, removeItem, incQty, decQty, clearCart } from "./cartSlice";

describe("cartSlice reducer", () => {
  test("should return initial state when passed an unknown action", () => {
    const state = cartReducer(undefined, { type: "UNKNOWN" });
    expect(state).toEqual({ items: [] });
  });

  test("addItem should push new item with qty=1 and normalized price", () => {
    const initial = { items: [] };

    const next = cartReducer(
      initial,
      addItem({
        id: 1,
        title: "Cheeseburger",
        price: "200", // string -> should become number
        image: "/uploads/x.png",
        restId: 10,
        restName: "KFC",
      })
    );

    expect(next.items).toHaveLength(1);
    expect(next.items[0]).toEqual({
      id: 1,
      title: "Cheeseburger",
      price: 200,
      image: "/uploads/x.png",
      qty: 1,
      restId: 10,
      restName: "KFC",
    });
  });

  test("addItem should increment qty if same id and same restId", () => {
    const initial = {
      items: [
        {
          id: 1,
          title: "Cheeseburger",
          price: 200,
          image: "/uploads/x.png",
          qty: 1,
          restId: 10,
          restName: "KFC",
        },
      ],
    };

    const next = cartReducer(
      initial,
      addItem({
        id: 1,
        title: "Cheeseburger",
        price: 200,
        image: "/uploads/x.png",
        restId: 10,
        restName: "KFC",
      })
    );

    expect(next.items).toHaveLength(1);
    expect(next.items[0].qty).toBe(2);
  });

  test("addItem should NOT merge if same id but different restId (must create new line)", () => {
    const initial = {
      items: [
        {
          id: 1,
          title: "Cheeseburger",
          price: 200,
          image: "/uploads/x.png",
          qty: 1,
          restId: 10,
          restName: "KFC",
        },
      ],
    };

    const next = cartReducer(
      initial,
      addItem({
        id: 1,
        title: "Cheeseburger",
        price: 200,
        image: "/uploads/x.png",
        restId: 11,
        restName: "McD",
      })
    );

    expect(next.items).toHaveLength(2);
    expect(next.items.find((x) => x.restId === 10)?.qty).toBe(1);
    expect(next.items.find((x) => x.restId === 11)?.qty).toBe(1);
  });

  test("incQty should increment qty for matching id", () => {
    const initial = {
      items: [{ id: 1, title: "A", price: 100, image: "", qty: 1, restId: 10, restName: "R" }],
    };

    const next = cartReducer(initial, incQty(1));
    expect(next.items[0].qty).toBe(2);
  });

  test("incQty should do nothing if id not found", () => {
    const initial = {
      items: [{ id: 1, title: "A", price: 100, image: "", qty: 1, restId: 10, restName: "R" }],
    };

    const next = cartReducer(initial, incQty(999));
    expect(next.items[0].qty).toBe(1);
  });

  test("decQty should decrement qty (but keep item if qty > 0)", () => {
    const initial = {
      items: [{ id: 1, title: "A", price: 100, image: "", qty: 2, restId: 10, restName: "R" }],
    };

    const next = cartReducer(initial, decQty(1));
    expect(next.items).toHaveLength(1);
    expect(next.items[0].qty).toBe(1);
  });

  test("decQty should remove item when qty becomes 0", () => {
    const initial = {
      items: [{ id: 1, title: "A", price: 100, image: "", qty: 1, restId: 10, restName: "R" }],
    };

    const next = cartReducer(initial, decQty(1));
    expect(next.items).toHaveLength(0);
  });

  test("decQty should do nothing if id not found", () => {
    const initial = {
      items: [{ id: 1, title: "A", price: 100, image: "", qty: 1, restId: 10, restName: "R" }],
    };

    const next = cartReducer(initial, decQty(999));
    expect(next.items).toHaveLength(1);
    expect(next.items[0].qty).toBe(1);
  });

  test("removeItem should remove all items with matching id (current implementation ignores restId)", () => {
    const initial = {
      items: [
        { id: 1, title: "A", price: 100, image: "", qty: 1, restId: 10, restName: "R1" },
        { id: 1, title: "A", price: 100, image: "", qty: 1, restId: 11, restName: "R2" },
        { id: 2, title: "B", price: 200, image: "", qty: 1, restId: 10, restName: "R1" },
      ],
    };

    const next = cartReducer(initial, removeItem(1));
    expect(next.items).toHaveLength(1);
    expect(next.items[0].id).toBe(2);
  });

  test("clearCart should remove all items", () => {
    const initial = {
      items: [
        { id: 1, title: "A", price: 100, image: "", qty: 1, restId: 10, restName: "R" },
        { id: 2, title: "B", price: 200, image: "", qty: 3, restId: 10, restName: "R" },
      ],
    };

    const next = cartReducer(initial, clearCart());
    expect(next.items).toEqual([]);
  });
});
