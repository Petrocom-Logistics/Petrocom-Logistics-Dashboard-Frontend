import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	dashBoardData: [],
};
const DashboardSlice = createSlice({
	name: "dashboardData",
	initialState,
	reducers: {
		fetchDashboardData(state, action) {
			state.dashBoardData.push(action.payload)
		},
	},
});
export default DashboardSlice.reducer;
export const { fetchDashboardData } = DashboardSlice.actions;
