import React, { useEffect, useState } from "react";
import { RiShareBoxFill } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import axios from "axios";
import Loader from "../Loader";
import { Link, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { Modal } from "react-responsive-modal";
import Tooltip from "@mui/material/Tooltip";
import { MdDoubleArrow } from "react-icons/md";
import Alert from "@mui/material/Alert";

function List() {
	const [open, setOpen] = useState(false);
	const [currentId, setCurrentId] = useState();
	const onOpenModal = (id) => {
		setOpen(true);
		setCurrentId(id);
	};
	const onCloseModal = () => setOpen(false);
	const [loading, setLoading] = useState(false);
	const [list, setList] = useState([]);
	const [search, setSearch] = useState("");

	const navigate = useNavigate();
	const fetchList = () => {
		setLoading(true);
		axios
			.get("/api/client/getClientListAdmin/1", {
				headers: {
					Accept: "application/json",
					Authorization: "Bearer " + localStorage.getItem("auth_token"),
				},
			})
			.then((res) => {
				setList(res.data.data);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				console.log(err);
			});
	};
	// delete client
	const deleteClientHandler = () => {
		setLoading(true);
		axios
			.get("/api/client/deleteClient/" + currentId, {
				headers: {
					Accept: "application/json",
					Authorization: "Bearer " + localStorage.getItem("auth_token"),
				},
			})
			.then((res) => {
				alert(res.data.message);
				if (res.data.status === 1) {
					fetchList();
				}
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchList();
	}, []);

	return (
		<>
			{loading ? <Loader /> : ""}
			<div className="client-list-topbar">
				<div className="left">
					<h3>Client List</h3>
				</div>
				<div className="right">
					<div className="search-box">
						<FiSearch size={"20px"} color="#FF5F13" />
						<input
							id="search"
							type="text"
							name="name"
							placeholder="Search By Name"
							onChange={(e) => {
								setSearch(e.target.value);
							}}
						/>
					</div>
				</div>
			</div>

			<div className="JobListContainer">
				<table>
					<thead>
						<th>S.N</th>
						<th>Company Name</th>
						<th> Name</th>
						<th>Dashboard</th>
						<th>History</th>
						<th>Primary Email</th>
						<th>Phone No.</th>
						<th>Secondary Email</th>
						<th>Phone No 2</th>
						{localStorage.getItem("type") === "2" ? "" : <th>Action</th>}
					</thead>

					<tbody>
						{list !== undefined ? (
							<>
								{list === undefined ||
									list
										.filter((item) => {
											return search.toLowerCase() === ""
												? item
												: item?.client_name?.includes(search) ||
														item?.client_name?.toLowerCase().includes(search);
										})
										.toReversed()
										.map((item, index) => {
											return (
												<tr key={index}>
													<td>{index + 1}</td>
													<td>
														<div className="company">
															<img
																src={
																	`https://dashboard-backend.petrocomlogistics.co.uk` +
																	item?.photo
																}
																className="company-logo"
																alt="img"
															/>
															<span>{item?.company_name}</span>
														</div>
													</td>
													<td style={{ color: "#224F9B", fontWeight: "500" }}>
														<span>{item?.client_name}</span>
													</td>
													<td>
														<Tooltip title="Go to Dashboard" arrow>
															<Link
																to={
																	"/clientlist/dashboard/" +
																	item?.id +
																	"/" +
																	item?.client_name
																}
															>
																<RiShareBoxFill className="view-icon" />
															</Link>
														</Tooltip>
													</td>
													<td>
														<Tooltip title="Go to JobHistory" arrow>
															<Link
																to={
																	"/clientlist/jobhistory/" +
																	item?.id +
																	"/" +
																	item?.client_name
																}
															>
																<RiShareBoxFill className="view-icon" />
															</Link>
														</Tooltip>
													</td>

													<td className="email">
														<Tooltip title={item?.primary_email} arrow>
															{item?.primary_email?.slice(0, 10) + "..."}{" "}
														</Tooltip>
													</td>
													<td>{item?.phone}</td>
													<td className="email">
{/* 														{console.log(item)} */}
														<Tooltip title={item?.sec_email} arrow>
{/* 															{console.log(item?.sec_email)} */}
															{item?.sec_email == null ||
															item?.sec_email === "null" ? (
																<>-</>
															) : (
																<>{item?.sec_email?.slice(0, 15) + "..."}</>
															)}{" "}
														</Tooltip>
													</td>
													<td>
														{item?.sec_phone === null ||
														item?.sec_phone === "null" ? (
															<>- </>
														) : (
															<>{item?.sec_phone}</>
														)}{" "}
													</td>
													<td>
														{localStorage.getItem("type") === "1" ? (
															<div style={{ display: "flex", gap: "5px" }}>
																<Tooltip title="More" arrow>
																	<span
																		className="action"
																		onClick={() =>
																			navigate("/clientlist/id/" + item?.id)
																		}
																	>
																		<MdDoubleArrow className="view-icon" />
																	</span>
																</Tooltip>
																<Tooltip title="Delete" arrow>
																	<span
																		className="action"
																		onClick={() => {
																			onOpenModal(item?.id);
																		}}
																	>
																		<MdDelete className="view-icon-delete" />
																	</span>
																</Tooltip>
															</div>
														) : (
															""
														)}
													</td>
													<Modal open={open} onClose={onCloseModal} center>
														<div className="logout-container">
															<h2>Are You Sure Want To Delete Client ?</h2>
															<div className="buttons">
																<button
																	className="cancel border-button"
																	onClick={onCloseModal}
																>
																	No
																</button>
																<button
																	onClick={() => {
																		deleteClientHandler();
																		setOpen(false);
																	}}
																	className="logout send-load"
																>
																	Yes
																</button>
															</div>
														</div>
													</Modal>
												</tr>
											);
										})}
							</>
						) : (
							<>
								<Alert variant="outlined" severity="error">
									No Client Found!
								</Alert>
							</>
						)}
					</tbody>
				</table>
			</div>
		</>
	);
}

export default List;
