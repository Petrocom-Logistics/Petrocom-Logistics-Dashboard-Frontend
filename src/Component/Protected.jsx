import React, { useEffect } from "react";
import { useNavigate } from "react-router";

function Protected(props) {
	const { Component } = props;
	const navigate = useNavigate();

	useEffect(() => {
		if (
			localStorage.getItem("auth_token") === null &&
			localStorage.getItem("type") === null
		) {
			navigate("/login");
		}
	}, [props]);
	return (
		<>
			<Component />
		</>
	);
}

export default Protected;
