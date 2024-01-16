import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
  name: "user", 
  initialState: [],
  reducers: {
    showUser(state, action) {
      state.push(action.payload)
    },
    resetUser(state, action) {
      state.pop(action.payload);
    }
  }
})
export default UserSlice.reducer;
export const { showUser , resetUser } = UserSlice.actions;