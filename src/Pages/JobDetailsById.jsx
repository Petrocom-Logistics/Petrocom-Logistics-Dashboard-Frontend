import React, { useEffect, useRef, useState } from "react";
import LeftBar from "../Component/LeftBar";
import { BsPlusCircleFill, BsImageFill } from "react-icons/bs";
import { FaArrowUpLong } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import axios from "axios";
import Loader from "../Component/Loader";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
function JobDetailsById() {
	const { id } = useParams();
	const [data, setData] = useState("");
	const [loading, setLoading] = useState(false);
	const [jobid, setjobid] = useState("");
	const [vehicle, setvehicle] = useState("");
	const [date, setDate] = useState("");
	const [eta, setEta] = useState("");
	const [pod, setPod] = useState();
	const [invoice, setInvoice] = useState();
	const [multidropValue, setMultidropValue] = useState("");
	const [inputList, setInputList] = useState([{ from: "", to: "" }]);
	const [messageText, setMessageText] = useState("");
	const [update, setUpdate] = useState([]);
	const [disable, setDisable] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showTimePicker, setShowTimePicker] = useState(false);

	const showDatePickerHandler = () => {
		setShowDatePicker(true);
	};

	const hideDatePickerHandler = () => {
		setShowDatePicker(false);
	};
	

	useEffect(() => {
		if (localStorage.getItem("type") === "3") {
			setDisable(true);
		}
		fetchJob();
	}, []);

	const podHandler = (e) => {
		setPod(e.target.files[0]);
	};
	const invoiceHandler = (e) => {
		setInvoice(e.target.files[0]);
	};

console.log(invoice)
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
	const submitHandler = (e) => {
		e.preventDefault();
		setLoading(true);
		let formData = new FormData();
		formData.append("job_id", jobid);
		formData.append("date", date);
		formData.append("multidrop", e.target.multidrop.value);
		formData.append("job_location_data", JSON.stringify(inputList));
		formData.append("vehicle", vehicle);
		formData.append("status", e.target.status.value);
		formData.append("pod", pod);
		formData.append("invoice_status", e.target.invoicestatus.value);
		formData.append("invoice", invoice);
		formData.append("eta", eta);
		formData.append("update", JSON.stringify(update));

		axios
			.post("/api/job/update", formData, {
				headers: {
					Accept: "Application/json",
					authorization: "Bearer " + localStorage.getItem("auth_token"),
				},
			})
			.then((res) => {
				alert(res.data.message);
				if (res.data.status === 1) {
					fetchJob();
				}
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				console.log(err);
			});
	};
	const fetchJob = () => {
		setLoading(true);
		axios
			.get("/api/job/getJobById/" + id, {
				headers: {
					Accept: "Application/json",
					Authorization: "Bearer " + localStorage.getItem("auth_token"),
				},
			})
			.then((res) => {
				setLoading(false);
				setData(res.data.data);
				setjobid(res.data.data.job_id);
				setvehicle(res.data.data.vehicle);
				setPod(res.data.data.pod);
				setInvoice(res.data.data.invoice);
				setDate(res.data.data.date);
				setEta(res.data.data.eta);
				if (res.data.data.update === null) {
					setUpdate([]);
				} else {
					setUpdate(JSON.parse(res.data.data.update));
				}
				if (res.data.data.multidrop == "0") {
					setMultidropValue("0");
				} else {
					setMultidropValue("1");
				}
				// setJobLocation(JSON.parse(res.data.data.job_location_data));
				setInputList(JSON.parse(res.data.data.job_location_data));
				// console.log(JSON.parse(data?.job_location_data));
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
												name="job_id"
												id="job_id"
												value={jobid}
												placeholder=""
												disabled={disable}
											/>
										</span>
									</div>
									<div className="box">
										<label htmlFor="date">Date</label>
										<span className="input-box">
											{/* <input
												type="text"
												name="date"
												value={date}
												onChange={(e) => {
													setDate(e.target.value);
												}}
												onFocus={(e) => {
													e.target.type = "date";
												}}
												onBlur={(e) => {
													e.target.type = "text";
												}}
												placeholder="dd/mm/yyyy"
												disabled={disable}
											/> */}
											{showDatePicker ? (
												<input
													type="date"
													name="date"
													value={date}
													onChange={(e) => {
														setDate(e.target.value);
													}}
													onBlur={hideDatePickerHandler}
													style={{ display: "block" }}
													disabled={disable}
													required
												/>
											) : (
												<input
													type="text"
													name="date"
													onChange={(e) => {
														setDate(e.target.value);
													}}
													value={date}
													onFocus={showDatePickerHandler}
													placeholder="dd/mm/yyyy"
													disabled={disable}
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
												disabled={disable}
											>
												<option value={multidropValue}>
													{multidropValue == 1 ? "Yes" : "No"}
												</option>
												<option value="1">Yes</option>
												<option value="0">No</option>
												{/* {console.log(multidropValue)}
												{ multidropValue == 1 ? (
													<>
														<option value="1">Yes</option>
														<option value="0">No</option>
													</>
												) : (
													<>
														<option value="0">No</option>
														<option value="1">Yes</option>
													</>
												)} */}
											</select>
										</span>
									</div>
								</div>
								<div className="row">
									<div className="box">
										<div className="add-location">
											<span>Location</span>
											{localStorage.getItem("type") !== "3" ? (
												<>
													{multidropValue == "1" ? (
														<BsPlusCircleFill
															className="add-location-icon"
															onClick={addLocationButton}
														/>
													) : (
														<></>
													)}
												</>
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
																value={x.from}
																onChange={(e) => {
																	inputHandle(e, i);
																}}
																disabled={disable}
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
																value={x.to}
																onChange={(e) => {
																	inputHandle(e, i);
																}}
																disabled={disable}
															/>
														</span>

														{localStorage.getItem("type") !== "3" ? (
															<>
																{inputList.length !== 1 && (
																	<span
																		className="close-icon"
																		onClick={() => removeLocationBox(i)}
																	>
																		<MdCancel color="#D60C0C" />
																	</span>
																)}
															</>
														) : (
															<></>
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
												value={vehicle}
												onChange={(e) => {
													setvehicle(e.target.value);
												}}
												disabled={disable}
												placeholder=""
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
											<select id="status" name="status" disabled={disable}>
												{/* {data?.status === "Completed"} */}
												<option value={data?.status}>{data?.status}</option>
												<option value="Completed">Completed</option>
												<option value="In-Progress">In-Progress</option>
												<option value="Cancelled">Cancelled</option>
												{/* <option value="completed">Completed</option> */}
											</select>
										</div>
									</div>
									<div className="box">
										<label htmlFor="pod">POD</label>
										<div className="pod">
											{localStorage.getItem("type") !== "3" ? (
												<div className="input-box" onClick={handlePodFileClick}>
													<BsImageFill size={"25px"} color="#666666" />
													<input
														type="file"
														id="pod"
														name="pod"
														onChange={podHandler}
														ref={podRef}
														disabled={disable}
														style={{ display: "none" }}
													/>
													<p>Upload a files</p>
												</div>
											) : (
												<></>
											)}

											{pod === undefined || pod === null ? (
												<div className="input-box img-prev">
													<BsImageFill size={"25px"} color="#666666" />
												</div>
											) : (
												<div className="input-box img-prev">
													<BsImageFill size={"25px"} color="#666666" />

													{pod === null ? (
														<></>
													) : pod.name ? (
														pod.name
													) : (
														<Link
															to={"https://dashboard-backend.petrocomlogistics.co.uk" + pod}
														>
															Download
														</Link>
													)}
													{disable ? (
														<> </>
													) : (
														<MdCancel
															color="#D60C0C"
															id="closeButton"
															onClick={() => {
																setPod();
															}}
														/>
													)}
												</div>
											)}
										</div>
									</div>
								</div>
								<div className="row">
									<div className="box">
										<label htmlFor="invoice_status">Invoice Status</label>
										<div className="input-box">
											<select
												id="invoice_status"
												name="invoicestatus"
												disabled={disable}
											>
												{data?.invoice_status === "paid" ? (
													<>
														<option value="paid">Paid</option>
														<option value="due">Due</option>
													</>
												) : (
													<>
														<option value="due">Due</option>
														<option value="paid">Paid</option>
													</>
												)}
											</select>
										</div>
									</div>
									<div className="box">
										<label htmlFor="invoice">Invoice</label>
										<div className="pod">
											{localStorage.getItem("type") !== "3" ? (
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
														disabled={disable}
													/>
													<p>Upload a files</p>
												</div>
											) : (
												<></>
											)}

											{invoice === undefined || invoice === null ? (
												<div className="input-box img-prev">
													<BsImageFill size={"25px"} color="#666666" />
												</div>
											) : (
												<div className="input-box img-prev">
													<BsImageFill size={"25px"} color="#666666" />

													{invoice === null ? (
														<></>
													) : invoice.name ? (
														invoice.name
													) : (
														<Link
															to={
																"https://dashboard-backend.petrocomlogistics.co.uk" + invoice
															}
														>
															Download
														</Link>
													)}
													{disable ? (
														<> </>
													) : (
														<MdCancel
															color="#D60C0C"
															id="closeButton"
															onClick={() => {
																setInvoice(null);
															}}
														/>
													)}
												</div>
											)}
										</div>
									</div>
								</div>
								<div className="row" style={{ alignItems: "flex-start" }}>
									<div className="box">
										<label htmlFor="eta">ETA</label>
										<div className="input-box">
											<input
												type="time"
												// onFocus={(e) => (e.target.type = "time")}
												// onBlur={(e) => (e.target.type = "text")}
												name="eta"
												id="eta"
												value={eta}
												disabled={disable}
												onChange={(e) => {
													setEta(e.target.value);
												}}
												placeholder="hr-min"
											/>
										</div>
									</div>
									<div className="box">
										<label htmlFor="update">Update</label>
										<div className="update">
											{localStorage.getItem("type") !== "3" ? (
												<div
													className="input-box"
													style={{ alignItems: "flex-end" }}
												>
													<textarea
														name="update"
														id="update"
														rows={"3"}
														placeholder="Text a Message"
														disabled={disable}
														value={messageText}
														onChange={(e) => {
															setMessageText(e.target.value);
														}}
													></textarea>
													{disable ? (
														<> </>
													) : (
														<FaArrowUpLong
															className="update-icon"
															onClick={() => {
																handleUpdateMessge();
															}}
														/>
													)}
												</div>
											) : (
												""
											)}

											{update?.length === 0 ? (
												""
											) : (
												<>
													<div
														className="input-box"
														style={{ alignItems: "flex-end" }}
													>
														<p className="update-p">
															{update[update?.length - 1]}
														</p>
														{localStorage.getItem("type") !== "3" ? (
															<span>
																<MdCancel
																	color="#D60C0C"
																	onClick={() => {
																		deleteUpdateMessage();
																	}}
																/>
															</span>
														) : (
															""
														)}
													</div>
												</>
											)}
										</div>
									</div>
								</div>
							</div>
							{localStorage.getItem("type") !== "3" ? (
								<div className="update-btn">
									<button className="send-load " disabled={disable}>
										Update
									</button>
								</div>
							) : (
								""
							)}
						</form>
					</div>
				</div>
			</div>
		</>
	);
}

export default JobDetailsById;
