const { createSlice } = require('@reduxjs/toolkit');

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        final_price: 0,
        original_price: 0
    },
    reducers: {
        saveCartToLocalStorage: (state, action) => {
            const lsCart = localStorage.getItem('cart');
            if (lsCart) {
                const parsedCart = JSON.parse(lsCart);
                state.items = parsedCart.items || [];
                state.final_price = parsedCart.final_price || 0;
                state.original_price = parsedCart.original_price || 0;
            }
        },
        addItem: (state, action) => {
            const { productId, final_price, original_price } = action.payload;
            const existingItem = state.items.find(item => item.productId === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ productId: productId, quantity: 1, });
            }
            state.final_price += final_price;
            state.original_price += original_price;
            localStorage.setItem('cart', JSON.stringify(state));
        },
        removeItem: (state, action) => {
            const { id, final_price, original_price } = action.payload;
            const existingItem = state.items.find(item => item.productId === id);
            if (existingItem) {
                const existingItemQuantity = existingItem.quantity;
                state.items = state.items.filter(item => item.productId !== id);
                state.final_price -= Number(final_price * existingItemQuantity);
                state.original_price -= Number(original_price * existingItemQuantity)
            }
            localStorage.setItem('cart', JSON.stringify(state));
        },
        updateQuantity: (state, action) => {
            const { productId, flag, final_price, original_price } = action.payload;
            const existingItem = state.items.find(item => item.productId === productId);
            if (existingItem) {
                if (flag === 1) {
                    existingItem.quantity++;
                    state.final_price += final_price;
                    state.original_price += original_price;
                } else {
                    if (existingItem.quantity == 1) return;
                    existingItem.quantity--;
                    state.final_price -= final_price;
                    state.original_price -= original_price;
                }
                localStorage.setItem('cart', JSON.stringify(state));
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.final_price = 0;
            state.original_price = 0;
            localStorage.removeItem("cart")
        }
    }
});

export default cartSlice.reducer;
export const { addItem, removeItem, clearCart, saveCartToLocalStorage, updateQuantity } = cartSlice.actions;
