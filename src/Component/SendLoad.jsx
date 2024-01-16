// import React, { useState } from "react";
// import Button from "@mui/material/Button";
// import { styled } from "@mui/material/styles";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import { BsPlusCircleFill } from "react-icons/bs";
// import { MdCancel } from "react-icons/md";

// import DialogContent from "@mui/material/DialogContent";
// import DialogActions from "@mui/material/DialogActions";
// import Typography from "@mui/material/Typography";
// import Loader from "./Loader";
// import axios from "axios";
// function SendLoad(props) {
// 	const [loading, setLoading] = useState(false);
// 	const [selectedValue, setSelectedValue] = useState("");
// 	const [multidropValue, setMultidropValue] = useState("No");
// 	const [inputList, setInputList] = useState([{ from: "", fromnumber:"",  to: "", tonumber:"" }]);

// 	const BootstrapDialog = styled(Dialog)(({ theme }) => ({
// 		"& .MuiDialogContent-root": {
// 			padding: theme.spacing(2),
// 		},
// 		"& .MuiDialogActions-root": {
// 			padding: theme.spacing(1),
// 		},
// 	}));

// 	const inputHandle = (e, index) => {
// 		const { name, value } = e.target;
// 		const list = [...inputList];
// 		list[index][name] = value;
// 		setInputList(list);
// 	};
// 	const removeLocationBox = (index) => {
// 		const list = [...inputList];
// 		list.splice(index, 1);
// 		setInputList(list);
// 	};

// 	console.log(inputList);
// 	const handleClose = () => {
// 		props.setOpenLoad({ active: false });
// 	};

// 	const multidropHandler = (e) => {
// 		setMultidropValue(e.target.value);
// 	};
// 	const addLocationButton = () => {
// 		setInputList([...inputList, { from: "", to: "" }]);
// 	};
// 	const submitHandler = (e) => {
// 		e.preventDefault();
// 		setLoading(true);
// 		axios
// 			.post(
// 				"/api/mailer/sendLoad",
// 				{
// 					headers: {
// 						"Content-Type": "application/json",
// 					},
// 				},
// 				{
// 					name: e.target.name.value,
// 					email: e.target.email.value,
// 					phone: e.target.number.value,
// 					frieght_type: e.target.frieght.value,
// 					pickup_location: e.target.from.value,
// 					destiation: e.target.to.value,
// 					multidrop: e.target.multidrop.value,
// 					length: e.target.length.value,
// 					breadth: e.target.breadth.value,
// 					height: e.target.height.value,
// 					weight: e.target.weight.value,
// 					message: e.target.msg.value,
// 				}
// 			)
// 			.then((res) => {
// 				setLoading(false);
// 				console.log(res);
// 			})
// 			.catch((error) => {
// 				setLoading(false);
// 				console.error("AxiosError:", error);
// 				if (error.response) {
// 					// The request was made and the server responded with a status code
// 					// that falls out of the range of 2xx
// 					console.error("Response data:", error.response.data);
// 					console.error("Response status:", error.response.status);
// 					console.error("Response headers:", error.response.headers);
// 				} else if (error.request) {
// 					// The request was made but no response was received
// 					console.error("Request data:", error.request);
// 				} else {
// 					// Something happened in setting up the request that triggered an Error
// 					console.error("Error message:", error.message);
// 				}
// 			});
// 	};

// 	// useEffect(()=>)
// 	return (
// 		<>
// 			{loading ? <Loader /> : ""}
// 			<BootstrapDialog
// 				onClose={handleClose}
// 				aria-labelledby="customized-dialog-title"
// 				open={props.open}
// 				id="load"
// 			>
// 				{/* <DialogTitle sx={{ m: 0, p: 1 }} id="customized-dialog-title">
// 					Get A Qote For Free
// 				</DialogTitle> */}

// 				<DialogContent dividers>
// 					<div id="send-load">
// 						<h3> Send New Load</h3>

// 						<form onSubmit={submitHandler} method="post">
// 							<div className="row">
// 								<input
// 									type="text"
// 									name="name"
// 									id="name"
// 									placeholder="Name"
// 									required
// 								/>
// 								<input
// 									type="email"
// 									name="email"
// 									id="email"
// 									placeholder="Email"
// 									required
// 								/>
// 							</div>
// 							<div className="row">
// 								<input
// 									type="number"
// 									name="number"
// 									id="number"
// 									placeholder="Contact Number"
// 								/>
// 								{selectedValue === "Custom" ? (
// 									<input type="text" name="frieght" placeholder="Type Here" />
// 								) : (
// 									<select
// 										name="frieght"
// 										required
// 										onChange={(e) => {
// 											setSelectedValue(e.target.value);
// 										}}
// 									>
// 										<option value="">Frieght Type</option>
// 										<option value="SWB">SWB</option>
// 										<option value="LWB">LWB</option>
// 										<option value="XLWB">XLWB</option>
// 										<option value="Luton">Luton</option>
// 										<option value="7T">7T</option>
// 										<option value="12T">12T</option>
// 										<option value="18T">18T</option>
// 										<option value="Custom">Custom</option>
// 									</select>
// 								)}

// 								<select name="multidrop" required onChange={multidropHandler}>
// 									<option value="">Multidrop</option>
// 									<option value="1">Yes</option>
// 									<option value="0">No</option>
// 								</select>
// 							</div>
// 							<div className="row">
// 								{multidropValue === "1" ? (
// 									<BsPlusCircleFill
// 										className="add-location-icon"
// 										onClick={addLocationButton}
// 									/>
// 								) : (
// 									<></>
// 								)}
// 							</div>
// 							{inputList.map((x, i) => {
// 								return (
// 									<>
// 										<div className="row">
// 											<input
// 												type="text"
// 												name="from"
// 												id="pickup-location"
// 												placeholder={`Pickup Location ${i + 1}`}
// 												onChange={(e) => {
// 													inputHandle(e, i);
// 												}}
// 												required
// 											/>
// 											<input
// 												type="number"
// 												name="fromnumber"
// 												id="phoneno"
// 												placeholder={`Phone Number ${i + 1}`}
// 												onChange={(e) => {
// 													inputHandle(e, i);
// 												}}
// 												required
// 											/>
// 										</div>

// 										<div className="row">
// 											<input
// 												type="text"
// 												name="to"
// 												id="drop-location"
// 												placeholder={`Drop Location ${i + 1}`}
// 												onChange={(e) => {
// 													inputHandle(e, i);
// 												}}
// 												required
// 											/>
// 											<input
// 												type="number"
// 												name="tonumber"
// 												id="phoneno"
// 												placeholder={`Phone Number ${i + 1}`}
// 												onChange={(e) => {
// 													inputHandle(e, i);
// 												}}
// 												required
// 											/>
// 											{inputList.length !== 1 && (
// 												<span
// 													className="close-icon"
// 													onClick={() => removeLocationBox(i)}
// 												>
// 													<MdCancel color="#D60C0C" />
// 												</span>
// 											)}
// 										</div>
// 									</>
// 								);
// 							})}
// 							<div className="row dimension">
// 								<input
// 									type="text"
// 									name="length"
// 									id="length"
// 									placeholder="Length"
// 								/>
// 								<input
// 									type="text"
// 									name="breadth"
// 									id="breadth"
// 									placeholder="Breadth"
// 								/>
// 								<input
// 									type="text"
// 									name="height"
// 									id="height"
// 									placeholder="Height"
// 								/>
// 								<input
// 									type="text"
// 									name="weight"
// 									id="weight"
// 									placeholder="Weight"
// 								/>
// 							</div>
// 							<div className="row">
// 								<textarea
// 									name="msg"
// 									id="msg"
// 									cols="30"
// 									rows="5"
// 									placeholder="Message"
// 									required
// 								></textarea>
// 							</div>

// 							<button className="primary-button">Send New Load</button>
// 						</form>
// 					</div>
// 				</DialogContent>
// 				<DialogActions>
// 					<Button autoFocus onClick={handleClose}>
// 						Close
// 					</Button>
// 				</DialogActions>
// 			</BootstrapDialog>
// 		</>
// 	);
// }

// export default SendLoad;
