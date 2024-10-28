import React, { useState, useEffect } from "react";
import LeftBar from "../Component/LeftBar";
import JobHistoryTable from "../Component/JobHistory/JobHistoryTable";
import JobHistoryTopBar from "../Component/JobHistory/JobHistoryTopBar";
import { useLocation, useNavigate, useParams } from "react-router";
import axios from "axios";
import Loader from "../Component/Loader";
import { useSelector } from "react-redux";

function JobHistory() {
	const { id } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const userData = useSelector((state) => state.user);
	const fetchJob = () => {
		if (location.pathname === "/jobhistory") {
			setLoading(true);
			axios
				.get("/api/job/getJobListDashboard", {
					headers: {
						Accept: "application/json",
						Authorization: "Bearer " + localStorage.getItem("auth_token"),
					},
				})
				.then((res) => {
					setData(res.data.data.toReversed());
					setLoading(false);
				})
				.catch((err) => {
					console.log(err);
					setLoading(false);
				});
		} else {
			axios
				.get("api/job/getJobListByID/" + id, {
					headers: {
						Accept: "application/json",
						Authorization: "Bearer " + localStorage.getItem("auth_token"),
					},
				})
				.then((res) => {
					setData(res.data.data);
					setLoading(false);
				})
				.catch((err) => {
					console.log(err);
					setLoading(false);
				});
		}
	};

	useEffect(() => {
		fetchJob();
		if (localStorage.getItem("type") === "3") {
			navigate("/jobhistory/" + localStorage.getItem("client_id"));
		}
	}, [location.pathname]);
	return (
		<>
			{loading ? <Loader /> : ""}
			<div className="PageContainer">
				<div className="Page-left">
					<LeftBar />
				</div>
				<div className="page-right">
					<JobHistoryTopBar clientId={id} />
					<JobHistoryTable jobData={data} />
				</div>
			</div>
		</>
	);
}

export default JobHistory;
