import React, { useRef, useState } from "react";
import LeftBar from "../Component/LeftBar";
import { BsPlusCircleFill, BsImageFill } from "react-icons/bs";
import { FaArrowUpLong } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import axios from "axios";
import Loader from "../Component/Loader";
import { useNavigate, useParams } from "react-router";
function CreateJob() {
	const { id, name } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [pod, setPod] = useState();
	const [invoice, setInvoice] = useState();
	const [multidropValue, setMultidropValue] = useState("No");
	const [inputList, setInputList] = useState([{ from: "", to: "" }]);
	const [messageText, setMessageText] = useState("");
	const [update, setUpdate] = useState([]);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showTimePicker, setShowTimePicker] = useState(false);

	const showDatePickerHandler = () => {
		setShowDatePicker(true);
	};

	const hideDatePickerHandler = () => {
		setShowDatePicker(false);
	};
	const showTimePickerHandler = () => {
		setShowTimePicker(true);
	};

	const hideTimePickerHandler = () => {
		setShowTimePicker(false);
	};

	const multidropHandler = (e) => {
		setMultidropValue(e.target.value);
	};
	const addLocationButton = () => {
		setInputList([...inputList, { from: "", to: "" }]);
	};
	const inputHandle = (e, index) => {
		const { name, value } = e.target;
		const list = [...inputList];
		list[index][name] = value;
		setInputList(list);
	};
	const removeLocationBox = (index) => {
		const list = [...inputList];
		list.splice(index, 1);
		setInputList(list);
	};
	const podRef = useRef(null);
	const invoiceRef = useRef(null);
	const handlePodFileClick = () => {
		podRef.current.click();
	};
	const handleInvoiceFileClick = () => {
		invoiceRef.current.click();
	};

	const handleUpdateMessge = () => {
		if (messageText.trim() !== "") {
			setUpdate((update) => [...update, messageText]);
			setMessageText("");
		}
	};
	const deleteUpdateMessage = () => {
		setUpdate(update.splice(0, update.length - 1));
	};

	const podHandler = (e) => {
		setPod(e.target.files[0]);
	};
	const invoiceHandler = (e) => {
		setInvoice(e.target.files[0]);
	};
	const submitHandler = (e) => {
		e.preventDefault();
		setLoading(true);
		let formData = new FormData();
		formData.append("client_id", id);
		formData.append("job_id", e.target.jobid.value);
		formData.append("date", e.target.date.value);
		formData.append("multidrop", e.target.multidrop.value);
		formData.append("job_location_data", JSON.stringify(inputList));
		formData.append("vehicle", e.target.vehicle.value);
		formData.append("status", e.target.status.value);
		formData.append("pod", pod);
		formData.append("invoice_status", e.target.invoicestatus.value);
		formData.append("invoice", invoice);
		formData.append("eta", e.target.eta.value);
		formData.append("update", JSON.stringify(update));
		axios
			.post("/api/job/create", formData, {
				headers: {
					Accept: "Application/json",

					authorization: "Bearer " + localStorage.getItem("auth_token"),
				},
			})
			.then((res) => {
				alert(res.data.message);
				if (res.data.status === 1) {
					navigate("/clientlist/jobhistory/" + id + "/" + name);
				}
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				console.log(err);
			});
	};

	return (
		<>
			{loading ? <Loader /> : ""}
			<div className="PageContainer">
				<div className="Page-left">
					<LeftBar />
				</div>
				<div className="page-right">
					<div id="Job-details">
						<form onSubmit={submitHandler}>
							<div className="details">
								<h3>Job Details</h3>
								<div className="row">
									<div className="box">
										<label htmlFor="job_id">Job ID</label>
										<span className="input-box">
											<input
												type="text"
												name="jobid"
												id="job_id"
												placeholder=""
											/>
										</span>
									</div>
									<div className="box">
										<label htmlFor="date">Date</label>
										<span className="input-box">
											{showDatePicker ? (
												<input
													type="date"
													name="date"
													onBlur={hideDatePickerHandler}
													style={{ display: "block" }}
													required
												/>
											) : (
												<input
													type="text"
													name="date"
													onFocus={showDatePickerHandler}
													placeholder="dd/mm/yyyy"
													required
												/>
											)}
										</span>
									</div>
									<div className="box">
										<label htmlFor="multidrop">Multi Drop</label>
										<span className="input-box">
											<select
												name="multidrop"
												id="multidrop"
												onChange={multidropHandler}
											>
												<option value="0">No</option>
												<option value="1">Yes</option>
											</select>
										</span>
									</div>
								</div>
								<div className="row">
									<div className="box">
										<div className="add-location">
											<span>Location</span>
											{multidropValue === "1" ? (
												<BsPlusCircleFill
													className="add-location-icon"
													onClick={addLocationButton}
												/>
											) : (
												<></>
											)}
										</div>

										{inputList.map((x, i) => {
											return (
												<>
													<div
														className="location-box"
														id="locationbox"
														style={{ gap: "20px" }}
													>
														<label htmlFor="from">From</label>
														<span className="input-box">
															<input
																type="text"
																name="from"
																placeholder=""
																onChange={(e) => {
																	inputHandle(e, i);
																}}
															/>
														</span>
														<label htmlFor="from">
															<span>
																<img
																	src="/Images/right-arrow.svg"
																	className="location-arrow"
																	alt=""
																/>
															</span>
														</label>
														<span className="input-box">
															<input
																type="text"
																name="to"
																placeholder=""
																onChange={(e) => {
																	inputHandle(e, i);
																}}
															/>
														</span>

														{inputList.length !== 1 && (
															<span
																className="close-icon"
																onClick={() => removeLocationBox(i)}
															>
																<MdCancel color="#D60C0C" />
															</span>
														)}
													</div>
												</>
											);
										})}
									</div>
									<div className="box">
										<label htmlFor="vehicle">Vehicle</label>
										<div className="input-box">
											<input
												type="text"
												name="vehicle"
												id="vehicle"
												placeholder=""
												required
											/>
										</div>
									</div>
								</div>
								<div className="row" id="clonelocationbox"></div>
							</div>

							{/* Job Details Status  */}
							<div className="details">
								<h3>Job Status</h3>
								<div className="row">
									<div className="box">
										<label htmlFor="status">Status</label>
										<div className="input-box">
											<select id="status" name="status">
												<option value="In-Progress">In-Progress</option>
												<option value="Completed">Completed</option>
												<option value="Cancelled">Cancelled</option>
												<option value="Scheduled ">Scheduled </option>
												{/* <option value="completed">Completed</option> */}
											</select>
										</div>
									</div>
									<div className="box">
										<label htmlFor="pod">POD</label>
										<div className="pod">
											<div className="input-box" onClick={handlePodFileClick}>
												<BsImageFill size={"25px"} color="#666666" />
												<input
													type="file"
													id="pod"
													name="pod"
													onChange={podHandler}
													ref={podRef}
													style={{ display: "none" }}
												/>
												<p>Upload a files</p>
											</div>

											{pod === undefined ? (
												<div className="input-box img-prev">
													<BsImageFill size={"25px"} color="#666666" />
												</div>
											) : (
												<div className="input-box img-prev">
													<BsImageFill size={"25px"} color="#666666" />
													{pod.name}
													<MdCancel
														color="#D60C0C"
														id="closeButton"
														onClick={() => {
															setPod();
														}}
													/>
												</div>
											)}
										</div>
									</div>
								</div>
								<div className="row">
									<div className="box">
										<label htmlFor="invoice_status">Invoice Status</label>
										<div className="input-box">
											<select id="invoice_status" name="invoicestatus">
												<option value="paid">Paid</option>
												<option value="due">Due</option>
											</select>
										</div>
									</div>
									<div className="box">
										<label htmlFor="invoice">Invoice</label>
										<div className="pod">
											<div
												className="input-box"
												onClick={handleInvoiceFileClick}
											>
												<BsImageFill size={"25px"} color="#666666" />
												<input
													type="file"
													id="invoice"
													name="invoice"
													ref={invoiceRef}
													style={{ display: "none" }}
													onChange={invoiceHandler}
												/>
												<p>Upload a files</p>
											</div>

											{invoice === undefined ? (
												<div className="input-box img-prev">
													<BsImageFill size={"25px"} color="#666666" />
												</div>
											) : (
												<div className="input-box img-prev">
													<BsImageFill size={"25px"} color="#666666" />
													{invoice.name}
													<MdCancel
														color="#D60C0C"
														id="closeButton"
														onClick={() => {
															setInvoice();
														}}
													/>
												</div>
											)}
										</div>
									</div>
								</div>
								<div className="row" style={{ alignItems: "flex-start" }}>
									<div className="box">
										<label htmlFor="eta">ETA</label>
										<div className="input-box">
											{/* <input
												type="text"
												onFocus={(e) => (e.target.type = "time")}
												onBlur={(e) => (e.target.type = "text")}
												name="eta"
												id="eta"
												placeholder="hr-min"
												required
											/> */}
											{showTimePicker ? (
												<input
													type="time"
													name="eta"
													id="eta"
													onBlur={hideTimePickerHandler}
													required
													style={{ display: "block" }}
												/>
											) : (
												<input
													type="text"
													name="eta"
													id="eta"
													onFocus={showTimePickerHandler}
													placeholder="hr-min"
													required
												/>
											)}
										</div>
									</div>
									<div className="box">
										<label htmlFor="update">Update</label>
										<div className="update">
											<div
												className="input-box"
												style={{ alignItems: "flex-end" }}
											>
												<textarea
													name="update"
													id="update"
													rows={"3"}
													placeholder="Text a Message"
													value={messageText}
													onChange={(e) => {
														setMessageText(e.target.value);
													}}
												></textarea>
												<FaArrowUpLong
													className="update-icon"
													onClick={() => {
														handleUpdateMessge();
													}}
												/>
											</div>

											{update?.length === 0 ? (
												<div></div>
											) : (
												<div
													className="input-box"
													style={{ alignItems: "flex-end" }}
												>
													<p className="update-p">
														{update[update?.length - 1]}
													</p>
													<span>
														<MdCancel
															color="#D60C0C"
															onClick={() => {
																deleteUpdateMessage();
															}}
														/>
													</span>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
							<div className="update-btn">
								<button className="send-load ">Create</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}

export default CreateJob;
