import React, { useEffect } from "react";
import { useState } from "react";

import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { addDays } from "date-fns";
import axios from "axios";
import { useLocation, useParams } from "react-router";
import { useDispatch } from "react-redux";
import { filterJobHistory } from "../../Store/slice/JobSlice";
import Loader from "../Loader";
import Toast from "../Toast";
function Calendarr() {
	const dispatch = useDispatch();
	const { id } = useParams();
	const [loading, setLoading] = useState(false);
	const [toast, setToast] = useState({ active: false, msg: "", type: "" });

	const [state, setState] = useState([
		{
			startDate: new Date(),
			endDate: addDays(new Date(), 0),
			key: "selection",
		},
	]);
	const fetchByRange = () => {
		setLoading(true);
		axios
			.post(
				"/api/job/getJobByDateRangeByClient",
				{
					from: new Date(state[0].startDate).toLocaleDateString(),
					to: new Date(state[0].endDate).toLocaleDateString(),
					client_id: id,
				},
				{
					headers: {
						Accept: "application/json",
						authorization: "Bearer " + localStorage.getItem("auth_token"),
					},
				}
			)
			.then((res) => {
				setLoading(false);
				if (res.data.status === 1) {
					dispatch(filterJobHistory(res.data.data));
				} else {
					setToast({
						active: true,
						msg: res.data.message,
						type: "error",
					});
				}
			})
			.catch((err) => {
				setLoading(false);
				console.log(err);
			});
	};
	const fetchAllByRange = () => {
		setLoading(true);
		axios
			.post(
				"/api/job/getJobByDateRangeForAll",
				{
					from: new Date(state[0].startDate).toLocaleDateString(),
					to: new Date(state[0].endDate).toLocaleDateString(),
				},
				{
					headers: {
						Accept: "application/json",
						authorization: "Bearer " + localStorage.getItem("auth_token"),
					},
				}
			)
			.then((res) => {
				setLoading(false);
				if (res.data.status === 1) {
					dispatch(filterJobHistory(res.data.data));
				} else {
					setToast({
						active: true,
						msg: res.data.message,
						type: "error",
					});
				}
			})
			.catch((err) => {
				setLoading(false);
				console.log(err);
			});
	};
	useEffect(() => {
		if (id !== undefined) {
			fetchByRange();
		} else {
			fetchAllByRange();
		}
	}, [state]);
	return (
		<>
			<Toast
				open={toast.active}
				msg={toast.msg}
				setToast={setToast}
				type={toast.type}
			/>
			{loading ? <Loader /> : ""}

			<DateRangePicker
				onChange={(item) => setState([item.selection])}
				showSelectionPreview={true}
				moveRangeOnFirstSelection={false}
				months={2}
				ranges={state}
				direction="horizontal"
			/>
		</>
	);
}

export default Calendarr;
