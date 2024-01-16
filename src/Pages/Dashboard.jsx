import React, { useEffect, useState } from "react";
import { RiShareBoxFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import Loader from "../Component/Loader";
import axios from "axios";
import LeftBar from "../Component/LeftBar";
import DropLocation from "../Component/Dashboard/DropLocation";
import ArrivalTime from "../Component/Dashboard/ArrivalTime";
import { useLocation, useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from "../Store/slice/DashboardSlice";
import { Tooltip } from "@mui/material";
import Alert from "@mui/material/Alert";

function Dashboard() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const [currentJob, setCurrentJob] = useState();
	const location = useLocation();
	const dispatch = useDispatch();
	const userData = useSelector((state) => state.user);
	const gotoTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};
	const fetchJob = () => {
		document.querySelector("#header").style.display = "flex";
		setLoading(true);
		if (location.pathname === "/") {
			axios
				.get("/api/job/getJobListDashboard", {
					headers: {
						Accept: "application/json",
						Authorization: "Bearer " + localStorage.getItem("auth_token"),
					},
				})
				.then((res) => {
					setData(res.data.data);
					console.log(res)
					if (res.data.status === 1) {
						dispatch(fetchDashboardData(res.data.data.toReversed()));
					}
					setLoading(false);
				})
				.catch((err) => {
					console.log(err);
					setLoading(false);
				});
		} else {
			axios
				.get("/api/job/getJobListByID/" + id, {
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
		}
	};
	const handleJob = (i) => {
		setCurrentJob(data[i]);
	};
	useEffect(() => {
		fetchJob();
		if (localStorage.getItem("type") === "3") {
			fetchJob();
			// const userId = userData[userData.length - 1]?.client_details.id;
			const clientId = localStorage.getItem("client_id");
			if (clientId) {
				navigate("/dashboard/" + clientId);
			} else {
				console.error("Client ID is null or undefined.");
			}
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
					{currentJob ? (
						<div className="dashboard-top">
							<DropLocation data={currentJob} />
							<ArrivalTime data={currentJob} />
						</div>
					) : (
						<div className="dashboard-top">
							<DropLocation data={data?.[0]} />
							<ArrivalTime data={data?.[0]} />
						</div>
					)}

					<div className="dashboard-bottom">
						<div className="JobListContainer">
							<table>
								<thead>
									<th>S.N</th>
									<th>Job Id</th>
									<th>Location</th>
									<th>Multidrop</th>
									<th>Date</th>
									<th>Job Status</th>
									<th>Vehicle</th>
									<th>View Details</th>
								</thead>
								<tbody>
									{data !== undefined && data.length !== 0 ? (
										<>
											{data === undefined ||
												data.map((item, index) => {
													const jobLocation = JSON.parse(
														item.job_location_data
													);
													// if (index < 3) {
														return (
															<tr key={index}>
																<td>{index + 1}</td>
																<td
																	onClick={() => {
																		gotoTop();
																		handleJob(index);
																	}}
																>
																	{item.job_id}
																</td>
																<td
																	className="location"
																	onClick={() => {
																		gotoTop();
																		handleJob(index);
																	}}
																>
																	{jobLocation === undefined ||
																		jobLocation.map((location) => {
																			return (
																				<div>
																					<p>{location?.from}</p>
																					<p>{location?.to}</p>
																				</div>
																			);
																		})}
																</td>
																<td
																	onClick={() => {
																		gotoTop();
																		handleJob(index);
																	}}
																>
																	{item.multidrop === 1 ? "Yes" : "No"}
																</td>
																<td
																	onClick={() => {
																		gotoTop();
																		handleJob(index);
																	}}
																>
																	{item.created_at.slice(0,10)}
																</td>
																<td
																	onClick={() => {
																		gotoTop();
																		handleJob(index);
																	}}
																>
																	<span className={item.status}>
																		{item.status}
																	</span>
																</td>
																<td
																	onClick={() => {
																		gotoTop();
																		handleJob(index);
																	}}
																>
																	{item.vehicle}
																</td>
																<Tooltip title="View Details" arrow>
																	<Link
																		to={"/jobhistory/jobdetails/" + item.job_id}
																		onClick={gotoTop}
																	>
																		<td>
																			<RiShareBoxFill className="view-icon" />
																		</td>
																	</Link>
																</Tooltip>
															</tr>
														);
													// }
												})}
										</>
									) : (
										<>
											<Alert variant="outlined" severity="error">
											No Such Record Found
											</Alert>
										</>
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Dashboard;
