const { createSlice } = require("@reduxjs/toolkit");

const userSlice = createSlice({
    name: "user",
    initialState: {
        data: null,
        loginAt: null,
        token: null
    }, reducers: {
        saveUserToLocalStorage: (state, action) => {
            const lsUser = localStorage.getItem("user");
            if (lsUser) {
                const data = JSON.parse(lsUser)
                state.data = data.user;
                state.token = data.token;
                state.loginAt = data.loginAt
            }
        },
        setUser: (state, action) => {
            state.data = action.payload.data;
            state.loginAt = action.payload.loginAt;
            state.token = action.payload.token;
        },
        removeUser: (state) => {
            state.data = null;
            state.loginAt = null;
            state.token = null;
            localStorage.removeItem("user");
        }
    }
})
export const { setUser, removeUser, saveUserToLocalStorage } = userSlice.actions;
export default userSlice.reducer;