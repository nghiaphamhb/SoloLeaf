import reducer, {
  addItem,
  removeItem,
  incQty,
  decQty,
  clearCart,
  setPromoCode,
  clearPromoCode,
} from "./cartSlice.js";

const initialState = {
  items: [],
  promoCode: "",
};

describe("cartSlice", () => {
  test("should return initial state for unknown action", () => {
    expect(reducer(undefined, { type: "cart/unknown" })).toEqual(initialState);
  });

  test("addItem: should add a new item with qty=1 and normalize price", () => {
    const action = addItem({
      id: 1,
      title: "Burger",
      price: "120.5",
      image: "img.png",
      restId: 6,
      restName: "Yakitoriya",
    });

    const state = reducer(initialState, action);

    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual({
      id: 1,
      title: "Burger",
      price: 120.5,
      image: "img.png",
      qty: 1,
      restId: 6,
      restName: "Yakitoriya",
    });
    expect(state.promoCode).toBe("");
  });

  test("addItem: should increment qty when same id + same restId (string/number restId match)", () => {
    const start = {
      items: [
        { id: 1, title: "Burger", price: 100, image: "x", qty: 1, restId: 6, restName: "R1" },
      ],
      promoCode: "",
    };

    const state = reducer(
      start,
      addItem({
        id: 1,
        title: "Burger",
        price: 100,
        image: "x",
        restId: "6", // string
        restName: "R1",
      })
    );

    expect(state.items).toHaveLength(1);
    expect(state.items[0].qty).toBe(2);
  });

  test("addItem: should add separate line when same id but different restId", () => {
    const start = {
      items: [
        { id: 1, title: "Burger", price: 100, image: "x", qty: 1, restId: 6, restName: "R1" },
      ],
      promoCode: "",
    };

    const state = reducer(
      start,
      addItem({
        id: 1,
        title: "Burger",
        price: 100,
        image: "x",
        restId: 7,
        restName: "R2",
      })
    );

    expect(state.items).toHaveLength(2);
    expect(state.items.map((x) => x.restId).sort()).toEqual([6, 7]);
  });

  test("addItem: should set price=0 when invalid", () => {
    const state = reducer(
      initialState,
      addItem({ id: 2, title: "Tea", price: "abc", image: "", restId: 1, restName: "BK" })
    );
    expect(state.items[0].price).toBe(0);
  });

  test("removeItem: should remove all items with matching id (note: ignores restId)", () => {
    const start = {
      items: [
        { id: 1, title: "Burger", price: 100, image: "x", qty: 1, restId: 6, restName: "R1" },
        { id: 1, title: "Burger", price: 100, image: "x", qty: 1, restId: 7, restName: "R2" },
        { id: 2, title: "Tea", price: 50, image: "y", qty: 1, restId: 6, restName: "R1" },
      ],
      promoCode: "",
    };

    const state = reducer(start, removeItem(1));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe(2);
  });

  test("incQty: should increment qty for matching id (first match)", () => {
    const start = {
      items: [
        { id: 1, title: "Burger", price: 100, image: "x", qty: 1, restId: 6, restName: "R1" },
      ],
      promoCode: "",
    };

    const state = reducer(start, incQty(1));
    expect(state.items[0].qty).toBe(2);
  });

  test("incQty: should do nothing if id not found", () => {
    const start = {
      items: [
        { id: 1, title: "Burger", price: 100, image: "x", qty: 1, restId: 6, restName: "R1" },
      ],
      promoCode: "",
    };

    const state = reducer(start, incQty(999));
    expect(state).toEqual(start);
  });

  test("decQty: should decrement qty and keep item if qty stays > 0", () => {
    const start = {
      items: [
        { id: 1, title: "Burger", price: 100, image: "x", qty: 2, restId: 6, restName: "R1" },
      ],
      promoCode: "",
    };

    const state = reducer(start, decQty(1));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].qty).toBe(1);
  });

  test("decQty: should remove item when qty becomes 0", () => {
    const start = {
      items: [
        { id: 1, title: "Burger", price: 100, image: "x", qty: 1, restId: 6, restName: "R1" },
      ],
      promoCode: "",
    };

    const state = reducer(start, decQty(1));
    expect(state.items).toHaveLength(0);
  });

  test("decQty: should do nothing if id not found", () => {
    const start = {
      items: [
        { id: 1, title: "Burger", price: 100, image: "x", qty: 1, restId: 6, restName: "R1" },
      ],
      promoCode: "",
    };

    const state = reducer(start, decQty(999));
    expect(state).toEqual(start);
  });

  test("clearCart: should clear items but keep promoCode unchanged", () => {
    const start = {
      items: [
        { id: 1, title: "Burger", price: 100, image: "x", qty: 1, restId: 6, restName: "R1" },
      ],
      promoCode: "SL-TEST",
    };

    const state = reducer(start, clearCart());
    expect(state.items).toEqual([]);
    expect(state.promoCode).toBe("SL-TEST");
  });

  test("setPromoCode: should trim and set promoCode", () => {
    const state = reducer(initialState, setPromoCode("  SL-ABC  "));
    expect(state.promoCode).toBe("SL-ABC");
  });

  test("setPromoCode: should convert null/undefined to empty string", () => {
    expect(reducer(initialState, setPromoCode(null)).promoCode).toBe("");
    expect(reducer(initialState, setPromoCode(undefined)).promoCode).toBe("");
  });

  test("clearPromoCode: should clear promoCode", () => {
    const start = { items: [], promoCode: "SL-ABC" };
    const state = reducer(start, clearPromoCode());
    expect(state.promoCode).toBe("");
  });
});
