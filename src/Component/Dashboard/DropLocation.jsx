import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PiCarProfileFill } from "react-icons/pi";
import { BsFillClockFill } from "react-icons/bs";
import DashboardCarousel from "./DashboardCarousel";
import { useEffect } from "react";
import SendLoad from "../SendLoad";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
function DropLocation(props) {
	const { name } = useParams();
	const [open, setOpen] = useState(false);
	const [updates, setUpdates] = useState([]);
	const navigate = useNavigate()
	const { data } = props;
	// const [openLoad, setOpenLoad] = useState({ active: false });
	// const openSendLoad = () => {
	// 	setOpenLoad({ active: true });
	// };

	const BootstrapDialog = styled(Dialog)(({ theme }) => ({
		"& .MuiDialogContent-root": {
			padding: theme.spacing(2),
		},
		"& .MuiDialogActions-root": {
			padding: theme.spacing(1),
		},
	}));

	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		if (data !== undefined) {
			setUpdates(JSON.parse(data?.update));
		}
	}, [data]);
	return (
		<>
			{/* {openLoad ? (
				<SendLoad open={openLoad.active} setOpenLoad={setOpenLoad} />
			) : (
				""
			)} */}
			<div id="drop-location-container">
				<h2 style={{ paddingBottom: "10px" }}>{name}</h2>
				<h3>Pickup Drop Location</h3>
				<div className="drop-location-box">
					<DashboardCarousel data={data} />

					<div className="bottom">
						{data === undefined ? (
							<h4>No Data Available</h4>
						) : (
							<h4>Updates : </h4>
						)}
						<ul>
							{updates === undefined ||
								updates === null ||
								updates.toReversed().map((item, index) => {
									if (index < 3) {
										return <li>{item}</li>;
									}
								})}
						</ul>
						{data === undefined ? (
							<button
								className="send-load"
								onClick={() => {
									// openSendLoad();
									navigate("/sendload")
								}}
							>
								<span>
									<img
										src="/Images/up-arrow.svg"
										alt=""
										style={{ width: "24px", height: "24px" }}
									/>
								</span>

								<span className="">Send Load</span>
							</button>
						) : (
							<span
								className="see-all"
								onClick={() => {
									handleClickOpen();
								}}
							>
								{" "}
								See all Updates
							</span>
						)}
					</div>
				</div>

				<BootstrapDialog
					onClose={handleClose}
					aria-labelledby="customized-dialog-title"
					open={open}
				>
					<DialogTitle sx={{ m: 0, p: 1 }} id="customized-dialog-title">
						All Updates
					</DialogTitle>

					<DialogContent dividers>
						{updates === undefined ||
							updates === null ||
							updates?.toReversed().map((item, index) => {
								return (
									<>
										<Typography gutterBottom>
											{index + 1}. {item}
										</Typography>
									</>
								);
							})}
					</DialogContent>
					<DialogActions>
						<Button autoFocus onClick={handleClose}>
							Close
						</Button>
					</DialogActions>
				</BootstrapDialog>
			</div>
		</>
	);
}

export default DropLocation;
