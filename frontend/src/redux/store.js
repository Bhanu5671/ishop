const { configureStore } = require("@reduxjs/toolkit");
import adminReducer from "./features/adminSlice";
import cartReducer from "./features/cartSlice";
import userReducer from "./features/userSlice";
import wishlistReducer from "./features/wishlistSlice";

const store = configureStore({
    reducer: {
        admin: adminReducer,
        cart: cartReducer,
        user: userReducer,
        wishlist: wishlistReducer
    }
})

export default store;