const { createSlice } = require("@reduxjs/toolkit");

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        data: null,
        loginAt: null
    }, reducers: {
        setAdmin: (state, action) => {
            state.data = action.payload.data;
            state.loginAt = action.payload.loginAt;
        },
        removeAdmin: (state) => {
            state.data = null;
            state.loginAt = null;
        }
    }
})
export const { setAdmin, removeAdmin } = adminSlice.actions;
export default adminSlice.reducer;