import React from "react";
import LeftBar from "../Component/LeftBar";
import Load from "../Component/Load";
function LoadSend() {
	return (
		<>
			<div className="PageContainer">
				<div className="Page-left">
          <LeftBar/>
				</div>
				<div className="page-right">
					<Load />
				</div>
			</div>
		</>
	);
}

export default LoadSend;
