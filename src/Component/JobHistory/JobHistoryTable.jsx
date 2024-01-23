import React, { useEffect, useState } from "react";
import { RiShareBoxFill } from "react-icons/ri";
import { Link, useLocation, useParams } from "react-router-dom";
import Loader from "../Loader";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setJobHistory } from "../../Store/slice/JobSlice";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";

function JobList(props) {
	const { name } = useParams();
	const dispatch = useDispatch();
	const jobData = props.jobData;
	const [loading, setLoading] = useState(false);
	const stateJobData = useSelector((state) => state.job.jobHistory);
	const gotoTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};
	useEffect(() => {
		dispatch(setJobHistory(jobData));
	}, [props]);

	return (
		<>
			{loading ? <Loader /> : ""}
			<h2>{name}</h2>
			<div className="JobListContainer">
				<table>
					<thead>
						<th>S.N</th>
						<th>Job Id</th>
						<th>Location</th>
						<th>Multidrop</th>
						<th>POD</th>
						<th>Invoice</th>
						<th>Invoice Status</th>
						<th>Date</th>
						<th>Job Status</th>
						<th>Vehicle</th>
						<th>View Details</th>
					</thead>
					<tbody>
						<>
							{stateJobData === undefined || stateJobData?.length === 0 ? (
								<>
									<Alert variant="outlined" severity="error">
										No Such Record Found!
									</Alert>
								</>
							) : (
								<>
									{stateJobData === undefined ||
										stateJobData.toReversed().map((item, index) => {
											const jobLocation = JSON.parse(item.job_location_data);
											return (
												<tr key={index} style={{ cursor: "context-menu" }}>
													<td>{index + 1}</td>
													<td>{item?.job_id}</td>
													<td className="location">
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
													<td>{item?.multidrop === 1 ? "Yes" : "No"}</td>
													<td>
														{item?.pod === null ? (
															<Tooltip title="Unable to Download" arrow>
																<img
																	src="/Images/download-icon.svg"
																	className="download-icon"
																	alt=""
																/>
															</Tooltip>
														) : (
															<Tooltip title="Download POD" arrow>
																<Link
																	to={
																		"https://dashboard-backend.petrocomlogistics.co.uk" +
																		item?.pod
																	}
																>
																	<img
																		src="/Images/download-icon.svg"
																		className="download-icon"
																		alt=""
																	/>
																</Link>
															</Tooltip>
														)}
													</td>
													<td>
														{item?.invoice === null ? (
															<Tooltip title="Unable to Download" arrow>
																<img
																	src="/Images/download-icon.svg"
																	className="download-icon"
																	alt=""
																/>
															</Tooltip>
														) : (
															<Tooltip title="Download Invoice" arrow>
																<Link
																	to={
																		"https://dashboard-backend.petrocomlogistics.co.uk" +
																		item?.invoice
																	}
																>
																	<img
																		src="/Images/download-icon.svg"
																		className="download-icon"
																		alt=""
																	/>
																</Link>
															</Tooltip>
														)}
													</td>

													<td>
														<span>{item?.invoice_status}</span>
													</td>
													<td>{item?.created_at.slice(0,10)}</td>
													<td>
														<span className={item?.status}>{item?.status}</span>
													</td>
													<td>{item?.vehicle}</td>
													<Tooltip title="View Details" arrow>
														<Link
															to={"/jobhistory/jobdetails/" + item?.job_id}
															onClick={gotoTop}
														>
															<td>
																<RiShareBoxFill className="view-icon" />
															</td>
														</Link>
													</Tooltip>
												</tr>
											);
										})}
								</>
							)}
						</>
					</tbody>
				</table>
			</div>
		</>
	);
}

export default JobList;
