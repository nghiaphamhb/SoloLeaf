// get global state from the store by useSelector()
export const selectCartItems = (state) => state.cart.items;

export const selectCartCount = (state) =>
    state.cart.items.reduce((sum, it) => sum + it.qty, 0);

export const selectCartInitialPrice = (state) =>
    state.cart.items.reduce((sum, it) => sum + it.price * it.qty, 0);

// because also dont have discount: total = initial
export const selectCartTotalPrice = selectCartInitialPrice;
