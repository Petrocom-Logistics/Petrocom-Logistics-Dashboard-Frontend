import React, { useState, useEffect } from "react";
import Loader from "../Loader";
import axios from "axios";

function CreateAdmin() {
	const [allowEdit, setAllowEdit] = useState(null);
	const [loading, setLoading] = useState(false);
	const [adminData, setAdminData] = useState([]);
	const editHandler = (i) => {
		setAllowEdit(i);
	};
	const createAdminHandler = (e) => {
		e.preventDefault();
		setLoading(true);
		axios
			.post(
				"/api/user/createAdminAccount",
				{
					email: e.target.email.value,
					password: e.target.password.value,
				},
				{
					headers: {
						Accept: "application/json",
						Authorization: "Bearer " + localStorage.getItem("auth_token"),
					},
				}
			)
			.then((res) => {
				alert(res.data.message);
				if (res.data.status === 1) {
					setAllowEdit(null)
					fetchAdminList();
				}
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	};
	const fetchAdminList = () => {
		setLoading(true);
		axios
			.get("/api/user/listAdminAccount", {
				headers: {
					Accept: "application/json",
					Authorization: "Bearer " + localStorage.getItem("auth_token"),
				},
			})
			.then((res) => {
				setAdminData(res.data.data);
				console.log(res.data)
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				console.log(err);
			});
	};
	// update admin account
	const updateAdminHandler = (e, id) => {
		e.preventDefault();
		setLoading(true);
		axios
			.post(
				"/api/user/updateAdminAccount",
				{
					id: id,
					password: e.target.password.value,
					email: e.target.email.value,
				},
				{
					headers: {
						Accept: "application/json",
						Authorization: "Bearer " + localStorage.getItem("auth_token"),
					},
				}
			)
			.then((res) => {
				alert(res.data.message);
				setLoading(false);
				if (res.data.status === 1) {
					fetchAdminList();
				}
			})
			.catch((err) => {
				setLoading(false);
				console.log(err);
			});
	};

	useEffect(() => {
		fetchAdminList();
	}, []);
	return (
		<>
			{loading ? <Loader /> : ""}
			<section className="createAdmin">
				<h3>Accounts</h3>
				<div id="Job-details">
					<form onSubmit={createAdminHandler}>
						<div className="details">
							<div className="row">
								<div className="box">
									<label htmlFor="email">Email Id</label>
									<span className="input-box">
										<input
											type="email"
											name="email"
											id="email"
											placeholder="Enter Email"
											required
										/>
									</span>
								</div>
								<div className="box">
									<label htmlFor="password">Password</label>
									<span className="input-box">
										<input
											type="text"
											name="password"
											placeholder="Enter Password"
											required
										/>
									</span>
								</div>
								<div className="box">
									<button className="send-load" style={{ width: "130px" }}>
										Done
									</button>
								</div>
							</div>
						</div>
					</form>
				</div>
				<div id="Job-details" className="admin-list">
					{adminData?.map((item, index) => {
						return (
							<>
								<div>
									<p className="admin-list-email">
										{index + 1}. {item.email}
									</p>
									<img
										src="/Images/edit-icon.svg"
										alt=""
										onClick={() => {
											editHandler(index);
										}}
									/>
								</div>
								<form
									onSubmit={(e) => {
										updateAdminHandler(e, item.id);
									}}
								>
									<div className="details" style={{ margin: "10px" }}>
										{allowEdit === index ? (
											<div className="row">
												<div className="box">
													<label htmlFor="email">Email Id</label>
													<span className="input-box">
														<input
															type="email"
															name="email"
															id="email"
														
															placeholder="Enter Email"
															required
														/>
													</span>
												</div>
												<div className="box">
													<label htmlFor="password">Password</label>
													<span className="input-box">
														<input
															type="text"
															name="password"
															placeholder="Enter Password"
															required
														/>
													</span>
												</div>
												<div className="box">
													<button
														className="send-load"
														style={{ width: "130px" }}
													>
														Update
													</button>
												</div>
											</div>
										) : (
											""
										)}
									</div>
								</form>
							</>
						);
					})}
				</div>
			</section>
		</>
	);
}

export default CreateAdmin;
