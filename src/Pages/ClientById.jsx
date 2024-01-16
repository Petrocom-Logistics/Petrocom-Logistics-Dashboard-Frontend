import React from "react";
import LeftBar from "../Component/LeftBar";
import ClientDetailsById from "../Component/ClientList/ClientDetailsById";
function ClientById() {
	return (
		<>
			<div className="PageContainer">
				<div className="Page-left">
					<LeftBar />
				</div>
				<div className="page-right">
					<ClientDetailsById />
				</div>
			</div>
		</>
	);
}

export default ClientById;
