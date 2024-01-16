import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/UserSlice";
import JobSlice from "./slice/JobSlice";
import DashboardSlice from "./slice/DashboardSlice";
const store = configureStore({
  reducer: {
    user: userSlice,
    job: JobSlice,
    dashboard : DashboardSlice,
  }
})
export default store;