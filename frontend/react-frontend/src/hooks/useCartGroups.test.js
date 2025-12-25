// Unit tests for useCartGroups hook by mocking react-redux useSelector

import { renderHook } from "@testing-library/react";
import { useCartGroups } from "./useCartGroups";
import { selectCartItems, selectCartInitialPrice } from "../store/cartSelector";

// Mock react-redux useSelector
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

import { useSelector } from "react-redux";

describe("useCartGroups", () => {
  beforeEach(() => {
    useSelector.mockReset();
  });

  test("returns empty state correctly", () => {
    // useCartGroups calls useSelector twice: items, total
    useSelector.mockImplementation((selectorFn) => {
      if (selectorFn === selectCartItems) return [];
      if (selectorFn === selectCartInitialPrice) return 0;
      return undefined;
    });

    const { result } = renderHook(() => useCartGroups());

    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.groups).toEqual({});
    expect(result.current.restIds).toEqual([]);
    expect(result.current.isEmpty).toBe(true);
    expect(result.current.firstRestId).toBe(null);
  });

  test("groups items by restId and builds restIds list", () => {
    const items = [
      { id: 1, title: "A", qty: 1, price: 100, restId: 10, restName: "KFC" },
      { id: 2, title: "B", qty: 2, price: 200, restId: 10, restName: "KFC" },
      { id: 3, title: "C", qty: 1, price: 50, restId: 11, restName: "McD" },
    ];

    useSelector.mockImplementation((selectorFn) => {
      if (selectorFn === selectCartItems) return items;
      if (selectorFn === selectCartInitialPrice) return 550; // 100 + 400 + 50
      return undefined;
    });

    const { result } = renderHook(() => useCartGroups());

    expect(result.current.items).toHaveLength(3);
    expect(result.current.total).toBe(550);

    // Groups
    expect(Object.keys(result.current.groups).sort()).toEqual(["10", "11"]);
    expect(result.current.groups["10"].name).toBe("KFC");
    expect(result.current.groups["10"].items).toHaveLength(2);
    expect(result.current.groups["11"].name).toBe("McD");
    expect(result.current.groups["11"].items).toHaveLength(1);

    // restIds is Object.keys(groups) (order not guaranteed) -> compare as sets
    expect(result.current.restIds.sort()).toEqual(["10", "11"]);

    expect(result.current.isEmpty).toBe(false);
    expect(result.current.firstRestId).toBe(10);
  });

  test("handles missing restId/restName using UNKNOWN", () => {
    const items = [
      { id: 1, title: "A", qty: 1, price: 100 }, // no restId/restName
      { id: 2, title: "B", qty: 1, price: 100, restId: null, restName: null },
    ];

    useSelector.mockImplementation((selectorFn) => {
      if (selectorFn === selectCartItems) return items;
      if (selectorFn === selectCartInitialPrice) return 200;
      return undefined;
    });

    const { result } = renderHook(() => useCartGroups());

    expect(result.current.restIds).toEqual(["UNKNOWN"]);
    expect(result.current.groups["UNKNOWN"].name).toBe("UNKNOWN");
    expect(result.current.groups["UNKNOWN"].items).toHaveLength(2);
    expect(result.current.firstRestId).toBe(null);
  });
});
