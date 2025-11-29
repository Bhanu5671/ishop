const { createSlice } = require("@reduxjs/toolkit");

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: {
        user: null,
        product: []
    }, reducers: {
        saveWishlistToLocalStorage: (state) => {
            const lsWishlist = localStorage.getItem('wishlist');
            if (lsWishlist) {
                const parsedWishlist = JSON.parse(lsWishlist);
                state.user = parsedWishlist.user || null;
                state.product = parsedWishlist.product || [];
            }
        },
        setWishlist: (state, action) => {
            const { user, product } = action.payload;
            state.user = user;
            // Check if the product already exists in the wishlist
            const existingProduct = state.product.find(item => item._id === product._id);
            if (!existingProduct) {
                state.product.push(product);
            }
            localStorage.setItem('wishlist', JSON.stringify(state));
        },
        removeWishlist: (state, action) => {
            const { user, product } = action.payload;
            state.product = state.product.filter((item) => item._id !== product._id);
            if (state.product.length === 0) {
                state.user = null;
            }
            localStorage.setItem('wishlist', JSON.stringify(state));
        },
        clearWishlist: (state) => {
            state.user = null;
            state.product = [];
            localStorage.removeItem('wishlist');
        }
    }
})

export const { setWishlist, saveWishlistToLocalStorage, removeWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;