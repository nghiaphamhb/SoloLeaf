import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../store/cartSlice";
import { loadCartFromStorage, saveCartToStorage } from "./cartPersist";

const preloadedCart = loadCartFromStorage();

// the store has the reducer
export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState: preloadedCart ? { cart: preloadedCart } : undefined,
});

// Save whenever cart changes
store.subscribe(() => {
  saveCartToStorage(store.getState().cart);
});
