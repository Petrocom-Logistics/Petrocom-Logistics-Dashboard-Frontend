import React, { useRef, useState, useEffect } from "react";
import { BsFillSquareFill } from "react-icons/bs";
import { useParams } from "react-router";

function ArrivalTime(props) {
	const { name } = useParams();
	const hourRef = useRef();
	const minRef = useRef();
	const secRef = useRef();
	const { data } = props;

	const [etaTime, setEtaTime] = useState(null);
	const [date, setDate] = useState(null);
	const [passed, setpassed] = useState(false);

	useEffect(() => {
		if (data?.eta) {
			let newEtaTime = new Date();
			newEtaTime.setHours(
				Number(data?.eta.split(":")[0]),
				Number(data?.eta.split(":")[1]),
				0
			);
			setEtaTime(newEtaTime);

			const parsedDate = new Date(data?.date);
			parsedDate.setHours(
				Number(data?.eta.split(":")[0]),
				Number(data?.eta.split(":")[1]),
				0
			);

			const options = {
				weekday: "short",
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "numeric",
				minute: "numeric",
				second: "numeric",
				timeZoneName: "short",
			};

			const formattedDate = parsedDate.toLocaleString("en-US", options);
			const newDate = Date.parse(formattedDate);
			setDate(Number(newDate));
		}
	}, [data?.eta]);

	useEffect(() => {
		if (data?.status === "In-Progress") {
			var interval = setInterval(() => {
				if (etaTime) {
					let currentTime = Number(new Date());
					if (date - currentTime > 0) {
						convertMsToTime(date - currentTime);
					} else {
						convertMsToTime(date-currentTime);
					}
				}
			}, 1000);

			// Clear the interval when the component unmounts or when the conditions change
			return () => clearInterval(interval);
		}
	}, [data?.status, etaTime]);

	function convertMsToTime(milliseconds) {
		let seconds = Math.floor(milliseconds / 1000);
		let minutes = Math.floor(seconds / 60);
		let hours = Math.floor(minutes / 60);
		// console.log(hours)

		seconds = seconds % 60;
		minutes = minutes % 60;
		//  hours = hours % 24;

		if (hours < 0 || minutes < 0 || seconds < 0) {
			setpassed(true);
		} else {
			setpassed(false);
		}
		if (!isNaN(hours) && hourRef.current !== null) {
			hourRef.current.innerText = hours + " hr";
			minRef.current.innerText = minutes + " min";
			secRef.current.innerText = seconds + " s";
		}
	}
	return (
		<div className="ArrivalTimeContainer">
			<h2 style={{ paddingBottom: "10px", visibility: "hidden" }}>{name}</h2>

			<h3>Estimated Time of Arrival</h3>
			<div className="Arrivalbox">
				<div className="top">
					<div className="top-left">
						<h3>
							ETA :{" "}
							{data?.status === "Cancelled" ||
							data === undefined ||
							data?.status === "Completed" ? (
								"00 : 00"
							) : (
								<>
									<span>{data?.eta}</span>,&nbsp;
									<span>{data?.date}</span>
								</>
							)}
						</h3>
						<h4>
							{data?.status === "Cancelled" ? (
								<>
									<span>00 hr</span> : &nbsp;
									<span>00 min</span> : &nbsp;
									<span>00 s</span>
								</>
							) : (
								<>
									{data?.status === "Completed" ? (
										<>
											<span>00 hr</span> : &nbsp;
											<span>00 min</span> : &nbsp;
											<span>00 s</span>
										</>
									) : (
										<>
											{data === undefined || passed === true ? (
												<>
													<span>00 hr</span> : &nbsp;
													<span>00 min</span> : &nbsp;
													<span>00 s</span>
												</>
											) : (
												<>
													<span ref={hourRef}>hr</span> : &nbsp;
													<span ref={minRef}>min</span> : &nbsp;
													<span ref={secRef}>s</span>
												</>
											)}
										</>
									)}
								</>
							)}
						</h4>
						<p>
							<span className="job-type">Job Status : &nbsp;</span>
							{data === undefined ? (
								<>
									<span>No Job Found!</span>
								</>
							) : (
								<>
									<span>
										<BsFillSquareFill
											className={"list-icon list-" + data?.status}
										/>
									</span>
									<span>{data?.status}</span>
								</>
							)}
						</p>
					</div>
					<div className="top-right">
						<img src="/Images/clock.png" alt="clock" />
					</div>
				</div>
				<div className="bottom">
					<ul>
						<li>
							<BsFillSquareFill className="list-icon list-In-Progress" />
							In-Progress
						</li>
						<li>
							<BsFillSquareFill className="list-icon list-Completed" />
							Completed
						</li>
						<li>
							<BsFillSquareFill className="list-icon list-Cancelled" />
							Cancelled
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

export default ArrivalTime;
