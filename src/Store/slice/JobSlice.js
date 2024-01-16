import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
	jobHistory: [],
};
const JobSlice = createSlice({
	name: "jobHistory",
	initialState,
	reducers: {
		setJobHistory(state, action) {
			state.jobHistory = action.payload;
		},
		filterJobHistory(state, action) {
			state.jobHistory = action.payload
		},
	}
});
export default JobSlice.reducer;
export const { filterJobHistory, setJobHistory } = JobSlice.actions;
