import { React, useState } from "react";
import { Modal } from "react-responsive-modal";
import { MdDashboard, MdManageAccounts } from "react-icons/md";
import { BsFillHandbagFill, BsPeopleFill } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetUser } from "../Store/slice/UserSlice";

function LeftBar() {
	const [open, setOpen] = useState(false);
	const onOpenModal = () => setOpen(true);
	const onCloseModal = () => setOpen(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	

	return (
		<>
			<nav id="nav">
				<div id="leftBar">
					<ul>
						<NavLink
							to="/"
						>
							<li>
								<span>
									<MdDashboard className="menu-icon" />
								</span>
								<span className="hide-text">Dashboard</span>
							</li>
						</NavLink>
						<NavLink to="/jobhistory">
							<li>
								<span>
									<img src="/Images/job-icon.svg" alt="" />
								</span>
								<span className="hide-text">Job History</span>
							</li>
						</NavLink>
						{localStorage.getItem("type") !== "3" ? (
							<NavLink to="/clientlist">
								<li>
									<span>
										<img src="/Images/people-icon.svg" alt="" />
									</span>
									<span className="hide-text">Client List</span>
								</li>
							</NavLink>
						) : (
							""
						)}

						{localStorage.getItem("type") === "2" ||
						localStorage.getItem("type") === "3" ? (
							<></>
						) : (
							<NavLink to="/manage">
								<li>
									<span>
										<MdManageAccounts className="menu-icon" />
									</span>
									<span className="hide-text">Manage</span>
								</li>
							</NavLink>
						)}
						<Link to=" ">
							<li
								onClick={() => {
									onOpenModal();
								}}
							>
								<span>
									{/* <FiLogOut className="menu-icon" /> */}
									<img src="/Images/logout.svg" alt="" />
								</span>
								<span className="hide-text">Logout</span>
							</li>
						</Link>
						<Modal open={open} onClose={onCloseModal} center>
							<div className="logout-container">
								<h2>Are You Sure Want to Logout </h2>
								<div className="buttons">
									<button className=" border-button" onClick={onCloseModal}>
										Cancel
									</button>
									<button
										onClick={() => {
											localStorage.clear();
											dispatch(resetUser());
											navigate("/login");
										}}
										className="logout send-load"
									>
										Logout
									</button>
								</div>
							</div>
						</Modal>
					</ul>
				</div>
			</nav>
		</>
	);
}

export default LeftBar;
