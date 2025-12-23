// the slice create a cart reducer (name, initial state, actions logic)
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],  // each: { id, title, price, qty, image }
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        // click the button "add" in the restaurant page
        addItem: (state, action) => {
            const p = action.payload; // { id, title, price, image, restId, restName }
            const existing = state.items.find((x) => x.id === p.id && String(x.restId) === String(p.restId));

            if (existing) {
                existing.qty += 1;
            } else {
                state.items.push({
                    id: p.id,
                    title: p.title,
                    price: Number(p.price) || 0,
                    image: p.image,
                    qty: 1,
                    restId: p.restId,
                    restName: p.restName,
                });
            }
        },

        removeItem: (state, action) => {
            const id = action.payload;
            state.items = state.items.filter((x) => x.id !== id);
        },

        // in the cart panel
        incQty: (state, action) => {
            const id = action.payload;
            const found = state.items.find((x) => x.id === id);
            if(found) found.qty += 1;
        },

        decQty: (state, action) => {
            const id = action.payload;

            const it = state.items.find((x) => x.id === id);
            if (!it) return;

            it.qty -= 1;

            // remove when qty <= 0
            if (it.qty <= 0) {
                state.items = state.items.filter((x) => x.id !== id);
            }
        },

        clearCart: (state) => {
            state.items = [];
        }
    }
});

export const { addItem, removeItem, incQty, decQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;