import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice.js";

import { loadCartFromStorage, saveCartToStorage } from "./cartPersist.js";

const preloadedCart = loadCartFromStorage();

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState: preloadedCart
    ? {
        ...(preloadedCart ? { cart: preloadedCart } : {}),
      }
    : undefined,
});

let prevCart = store.getState().cart;

store.subscribe(() => {
  const state = store.getState();

  if (state.cart !== prevCart) {
    prevCart = state.cart;
    saveCartToStorage(state.cart);
  }
});
