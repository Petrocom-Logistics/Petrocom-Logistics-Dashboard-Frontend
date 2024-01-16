import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import axios from "axios";
import PreLoader from "../Component/Loader";
import { useDispatch, useSelector } from "react-redux";
import { showUser } from "../Store/slice/UserSlice";

function Login() {
	const [loading, setLoading] = useState(false);
	const [passwordType, setPasswordType] = useState("password");
	const [passwordInput, setPasswordInput] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const toggleEye = () => {
		if (passwordType === "password") {
			setPasswordType("text");
		} else if (passwordType === "text") {
			setPasswordType("password");
		}
	};
	const passwordHandler = (e) => {
		setPasswordInput(e.target.value);
	};

	const submitHandler = (e) => {
		setLoading(true);
		e.preventDefault();
		axios
			.post(
				"/api/user/login",
				{
					email: e.target.email.value,
					password: e.target.password.value,
				},
				{
					headers: {
						Accept: "application/json",
					},
				}
			)
			.then((res) => {
				setLoading(false);
				alert(res.data.message);
				if (res.data.message === "Login Successfull") {
					localStorage.setItem("auth_token", res.data.token);
					localStorage.setItem("type", res.data.type);
					if (res.data.type == 3) {
						navigate("/dashboard/" + res?.data?.client_data?.id);
					} else {
						navigate("/");
					}
					fetchUser();
				}
			})
			.catch((err) => {
				setLoading(false);
				console.log(err);
			});
	};

	const fetchUser = () => {
		setLoading(true);
		axios
			.get("/api/user/getUserData", {
				headers: {
					Accept: "application/json",
					Authorization: "Bearer " + localStorage.getItem("auth_token"),
				},
			})
			.then((res) => {
				setLoading(false);
				localStorage.setItem("client_id", res.data.data.client_id);
				localStorage.setItem("client_data", JSON.stringify(res.data.data));
				dispatch(showUser(res.data.data));
			})
			.catch((err) => {
				setLoading(false);
				console.log(err);
			});
	};
	useEffect(() => {
		document.querySelector("#header").style.display = "none";
	}, []);
	return (
		<>
			{loading ? <PreLoader /> : ""}
			<div id="login-container">
				<div className="left">
					<img src="/Images/logo.png" className="logo" alt="logo" />
					<img src="/Images/login-img.png" alt="img" />
				</div>
				<div className="right">
					<div className="login-form">
						<h2> Login</h2>
						<form onSubmit={submitHandler}>
							<div className="input-box">
								<label>Email Id</label>

								<span className="input-item">
									<input
										type="email"
										name="email"
										placeholder="Enter your Email"
										required
									/>
								</span>
							</div>

							<div className="input-box">
								<label> Passsword</label>
								<span className="input-item">
									<input
										type={passwordType}
										value={passwordInput}
										name="password"
										placeholder=" Enter Your Password"
										onChange={passwordHandler}
										required
									/>
									<span onClick={toggleEye}>
										{passwordType === "text" ? (
											<AiFillEye color={"#a7a7a7"} size={"20px"} />
										) : (
											<AiFillEyeInvisible color={"#a7a7a7"} size={"20px"} />
										)}
									</span>
								</span>
							</div>

							<button name="submit">Login</button>
						</form>

						<div className="help">
							<Link to="">
								<h4>Need help ?</h4>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Login;
