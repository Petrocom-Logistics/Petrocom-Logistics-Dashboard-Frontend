import axios from "axios";
import React, { useRef, useState } from "react";
import Loader from "../../Component/Loader";
import { useNavigate } from "react-router-dom";
function CreateClient() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [img, setImg] = useState();

	const [clientData, setClientData] = useState([]);

	const photoHandler = (e) => {
		setImg(e.target.files[0]);
		if (e.target.files[0] !== undefined) {
			const MIN_FILE_SIZE = 10;
			const MAX_FILE_SIZE = 1024;
			const fileSizeInKb = e.target.files[0].size / 1024;
			if (fileSizeInKb > MAX_FILE_SIZE) {
				alert("File Size Not More than 1MB");
				setImg("");
			} else if (fileSizeInKb < MIN_FILE_SIZE) {
				alert("File Size not less than 10KB");
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

	// create client
	const createClientHandler = (e) => {
		e.preventDefault();
		setLoading(true);
		let formData = new FormData();
		formData.append("company_name", e.target.companyName.value);
		formData.append("client_name", e.target.clientName.value);
		formData.append("primary_email", e.target.primaryEmail.value);
		formData.append("phone", e.target.primaryNo.value);
		formData.append("sec_email", e.target.secondaryEmail.value);
		formData.append("sec_phone", e.target.secondaryNo.value);
		formData.append("photo", e.target.photo.files[0]);
		if (img) {
			axios
				.post("/api/client/createClient", formData, {
					headers: {
						Accept: "application/json",
						Authorization: "Bearer " + localStorage.getItem("auth_token"),
					},
				})
				.then((res) => {
					alert(res.data.message);
					if (res.data.status === 1) {
						navigate("/clientList");
					}
					setLoading(false);
				})
				.catch((err) => {
					console.log(err);
					setLoading(false);
				});
		} else {
			setLoading(false);
			alert("Please Upload Image");
		}
	};

	return (
		<>
			{loading ? <Loader /> : ""}

			<div id="Job-details">
				<form onSubmit={createClientHandler}>
					<div className="details">
						<div className="row">
							<div className="box" style={{ alignItems: "center" }}>
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
									<img className="camera-img" src="/Images/camera.svg" alt="" />
								</div>

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
										value={clientData?.company_name}
										required
									/>
								</span>
							</div>
							<div className="box">
								<label htmlFor="name">Client Name</label>
								<span className="input-box">
									<input
										type="text"
										name="clientName"
										value={clientData?.client_name}
										required
									/>
								</span>
							</div>
							<div className="box">
								<label htmlFor="email">Primary Email</label>
								<span className="input-box">
									<input
										type="email"
										name="primaryEmail"
										value={clientData?.primary_email}
										required
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
									
										value={clientData?.phone}
										required
									/>
								</span>
							</div>
							<div className="box">
								<label htmlFor="s-email">Secondary Email</label>
								<span className="input-box">
									<input
										type="email"
										name="secondaryEmail"
										value={clientData?.sec_email}
										
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
									
										value={clientData?.sec_phone}
										
									/>
								</span>
							</div>
						</div>
						<div style={{ display: "flex", justifyContent: "center" }}>
							<button className="send-load">Create </button>
						</div>
					</div>
				</form>
			</div>
		</>
	);
}

export default CreateClient;
