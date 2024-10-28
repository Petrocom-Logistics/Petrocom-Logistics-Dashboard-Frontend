import * as React from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Toast(props) {
	const handleClose = (event, reason) => {
		props.setToast({ active: false, msg: "", type: "" });
	};

	return (
		<Stack spacing={2} sx={{ width: "100%" }}>
			<Snackbar open={props.open} autoHideDuration={3000} onClose={handleClose}>
				<Alert
					onClose={handleClose}
					severity={props.type}
					sx={{ width: "100%" }}
				>
					{props.msg}
				</Alert>
			</Snackbar>
		</Stack>
	);
}
