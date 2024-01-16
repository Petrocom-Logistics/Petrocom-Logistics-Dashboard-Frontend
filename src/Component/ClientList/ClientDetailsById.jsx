import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Loader from "../../Component/Loader";
import { useParams } from "react-router-dom";

function ClientDetailsById() {
	const { id } = useParams();
	const [loading, setLoading] = useState(false);
	const [img, setImg] = useState();
	const [fetchImg, setFetchImg] = useState();
	const [showAccBox, setShowAccBox] = useState(false);
	const [allowEdit, setAllowEdit] = useState(null);
	const [clientData, setClientData] = useState([]);

	const showAccountCreate = () => {
		setShowAccBox(true);
	};
	const editHandler = (i) => {
		setAllowEdit(i);
	};
	const photoHandler = (e) => {
		setImg(e.target.files[0]);
		setFetchTrue(false);

		if (e.target.files[0] !== undefined) {
			const MIN_FILE_SIZE = 100;
			const MAX_FILE_SIZE = 1024;
			const fileSizeInKb = e.target.files[0].size / 1024;
			if (fileSizeInKb > MAX_FILE_SIZE) {
				alert("File Size Not More than 1MB");
				setImg("");
			} else if (fileSizeInKb < MIN_FILE_SIZE) {
				alert("File Size not less than 100KB");
				setImg("");
			}
		} else {
			console.log("err in file");
		}
	};

	const logoRef = useRef(null);
	const handleLogoClick = () => {
		logoRef.current.click();
	};
	// update client
	const updateHandler = (e) => {
		e.preventDefault();
		setLoading(true);
		let formData = new FormData();
		formData.append("client_id", id);
		formData.append("company_name", companyName);
		formData.append("client_name", clientName);
		formData.append("primary_email", primaryEmail);
		formData.append("phone", primaryNo);
		formData.append("sec_email", secEmail);
		formData.append("sec_phone", secNo);
		formData.append("photo", img);
		axios
			.post("/api/client/updateClientData", formData, {
				headers: {
					Accept: "application/json",
					"Content-Type": "multipart/form-data",
					Authorization: "Bearer " + localStorage.getItem("auth_token"),
				},
			})
			.then((res) => {
				alert(res.data.message);
				if (res.data.status === 1) {
					fetchClientById();
				}
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	};
	//create client account with respect to already registered client id
	const createClientAccount = (e) => {
		e.preventDefault();
		setLoading(true);
		axios
			.post(
				"/api/client/createClientAccount",
				{
					client_id: id,
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
				setLoading(false);
				alert(res.data.message);
				if (res.data.status === 1) {
					fetchClientById();
				}
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	};

	//fetch Client by Id
	const [companyName, setCompanyName] = useState("");
	const [clientName, setClientName] = useState("");
	const [primaryEmail, setPrimaryEmail] = useState("");
	const [secEmail, setSecEmail] = useState("");
	const [primaryNo, setPrimaryNo] = useState("");
	const [secNo, setSecNo] = useState("");
	const [fetchTrue, setFetchTrue] = useState(false);
	const fetchClientById = () => {
		setLoading(true);
		axios
			.get("/api/client/getClientDetailsById/" + id, {
				headers: {
					Accept: "application/json",
					Authorization: "Bearer " + localStorage.getItem("auth_token"),
				},
			})
			.then((res) => {
				setCompanyName(res.data.data.company_name);
				setClientName(res.data.data.client_name);
				setPrimaryEmail(res.data.data.primary_email);
				setSecEmail(res.data.data.sec_email);
				setPrimaryNo(res.data.data.phone);
				setSecNo(res.data.data.sec_phone);
				setFetchImg(res.data.data.photo);
				setClientData(res.data.data);
				setLoading(false);
				setFetchTrue(true);
			})
			.catch((err) => {
				setLoading(false);
				console.log(err);
			});
	};

	// update client account
	const updateClientHandler = (e, id) => {
		e.preventDefault();
		setLoading(true);
		axios
			.post(
				"/api/client/updateClientAccount",
				{
					user_id: id,
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
				setLoading(false);
				if (res.data.status === 1) {
					fetchClientById();
				}
			})
			.catch((err) => {
				setLoading(false);
				console.log(err);
			});
	};

	useEffect(() => {
		fetchClientById();
	}, []);
	return (
		<>
			{loading ? <Loader /> : ""}

			<div id="Job-details">
				<form onSubmit={updateHandler}>
					<div className="details">
						{/* <h3>Job Details</h3> */}
						<div className="row">
							<div className="box" style={{ alignItems: "center" }}>
								{clientData !== undefined ? (
									<div className="photo-box" onClick={handleLogoClick}>
										<div style={{ position: "absolute" }}>
											{fetchTrue === true ? (
												<img
													src={
														`https://petrocom.techiesgateway.com/` + fetchImg
													}
													alt="#"
													className="preview-img"
												/>
											) : (
												<>
													{img ? (
														<img
															src={URL.createObjectURL(img)}
															alt=""
															className="preview-img"
														/>
													) : (
														<img src="" alt="" />
													)}
												</>
											)}
										</div>
										<img
											className="camera-img"
											src="/Images/camera.svg"
											alt=""
										/>
									</div>
								) : (
									<div className="photo-box" onClick={handleLogoClick}>
										<div style={{ position: "absolute" }}>
											{img ? (
												<img
													src={URL.createObjectURL(img)}
													alt=""
													className="preview-img"
												/>
											) : (
												<img src="" alt="" />
											)}
										</div>
										<img
											className="camera-img"
											src="/Images/camera.svg"
											alt=""
										/>
									</div>
								)}
								<h3 className="upload-logo">Upload Logo </h3>

								<input
									type="file"
									name="photo"
									ref={logoRef}
									onChange={photoHandler}
									style={{ display: "none" }}
								/>
							</div>
						</div>
						<div className="row">
							<div className="box">
								<label htmlFor="j-id">Company Name</label>
								<span className="input-box">
									<input
										type="text"
										name="companyName"
										id="j-id"
										value={companyName}
										onChange={(e) => {
											setCompanyName(e.target.value);
										}}
									/>
								</span>
							</div>
							<div className="box">
								<label htmlFor="name">Client Name</label>
								<span className="input-box">
									<input
										type="text"
										name="clientName"
										value={clientName}
										onChange={(e) => {
											setClientName(e.target.value);
										}}
									/>
								</span>
							</div>
							<div className="box">
								<label htmlFor="email">Primary Email</label>
								<span className="input-box">
									<input
										type="email"
										name="primaryEmail"
										value={primaryEmail}
										onChange={(e) => {
											setPrimaryEmail(e.target.value);
										}}
									/>
								</span>
							</div>
						</div>
						<div className="row">
							<div className="box">
								<label htmlFor="number">Phone Number</label>
								<span className="input-box">
									<input
										type="text"
										name="primaryNo"
										id="number"
										pattern="\d*"
										maxLength={10}
										value={primaryNo}
										onChange={(e) => {
											setPrimaryNo(e.target.value);
										}}
									/>
								</span>
							</div>
							<div className="box">
								<label htmlFor="s-email">Secondary Email</label>
								<span className="input-box">
									<input
										type="email"
										name="secondaryEmail"
										value={secEmail == "null" ? "" : secEmail}
										onChange={(e) => {
											setSecEmail(e.target.value);
										}}
									/>
								</span>
							</div>
							<div className="box">
								<label htmlFor="number2">Phone No.2</label>
								<span className="input-box">
									<input
										type="text"
										name="secondaryNo"
										pattern="\d*"
										maxLength={10}
										value={secNo == "null" ? "" : secNo}
										onChange={(e) => {
											setSecNo(e.target.value);
										}}
									/>
								</span>
							</div>
						</div>
						<div style={{ display: "flex", justifyContent: "center" }}>
							{clientData === undefined ? (
								<button className="send-load">Create </button>
							) : (
								<button className="send-load">Update </button>
							)}
						</div>
					</div>

					{/* Job Details Status  */}
				</form>

				<div>
					<h3>Account</h3>
					<br />
					<button className="send-load" onClick={showAccountCreate}>
						Create Account
					</button>
				</div>
				{showAccBox ? (
					<div id="Job-details" className="create-client-acc">
						<form onSubmit={createClientAccount}>
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
				) : (
					""
				)}
				<div id="Job-details" className="admin-list">
					{clientData?.user?.map((item, index) => {
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
										updateClientHandler(e, item.id);
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
															// value={}
															// onChange={(e) => { setClientEmail(e.target.value) }}
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
			</div>
		</>
	);
}

export default ClientDetailsById;
