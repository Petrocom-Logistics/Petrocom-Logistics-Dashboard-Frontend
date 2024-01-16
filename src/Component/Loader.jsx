import React from "react";
import { HashLoader } from "react-spinners";

function Loader() {
	return (
		<>
			{/* <section id="loader">
				<HashLoader color="#ff5f13"  />
			</section> */}

			<div id="preloader-active">
				<div class="preloader">
					<div class="preloader-inner" style={{position:"relative"}}>
						<div class="preloader-circle"></div>
						<div class="preloader-img pere-text">
							<img src="/Images/loader.png" alt="" />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Loader;
