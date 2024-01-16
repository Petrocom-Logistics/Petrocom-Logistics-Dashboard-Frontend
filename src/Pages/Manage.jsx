import React, { useState } from "react";
import LeftBar from "../Component/LeftBar";
import CreateClient from "../Component/Manage/CreateClient";
import CreateAdmin from "../Component/Manage/CreateAdmin";
function Manage() {
	const [openCreateClient, setopenCreateClient] = useState(true);
	const [openCreateAdmin, setopenCreateAdmin] = useState(false);

	const createClient = () => {
		setopenCreateAdmin(false);
		setopenCreateClient(true);
	};
	const createAdmin = () => {
		setopenCreateClient(false);
		setopenCreateAdmin(true);
	};

	return (
		<>
			<div className="PageContainer">
				<div className="Page-left">
					<LeftBar />
				</div>
				<div className="page-right">
					<div className="top" style={{ display: "flex", gap: "20px" }}>
						<button
							className="send-load  create-client border-btn"
							onClick={createClient}
						>
							Create Client
						</button>

						<button
							className="send-load  create-admin border-btn"
							onClick={createAdmin}
						>
							Create Admin
						</button>
					</div>
					<div className="bottom">
						{openCreateClient ? <CreateClient /> : <CreateAdmin />}
					</div>
				</div>
			</div>
		</>
	);
}

export default Manage;
