import React from "react";
import LeftBar from "../Component/LeftBar";
import List from "../Component/ClientList/List";
function ClientLists() {
	return (
		<>
			<div className="PageContainer">
				<div className="Page-left">
					<LeftBar />
				</div>
				<div className="page-right">
					<List />
				</div>
			</div>
		</>
	);
}

export default ClientLists;
