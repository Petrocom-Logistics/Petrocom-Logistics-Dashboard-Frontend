import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { FaCarSide } from "react-icons/fa";
import { BsFillClockFill } from "react-icons/bs";
import { MdLocationPin } from "react-icons/md";
import { useParams } from "react-router";
function DashboardCarousel(props) {
	const data = props.data;
 
	const [jobLocation, setJobLocation] = useState([]);

	const fetchLocation = () => {
		if (data !== undefined) {
			setJobLocation(JSON.parse(data?.job_location_data));
		}
	};
	useEffect(() => {
		fetchLocation();
	}, [props]);
	return (
		<>
			<Swiper
				spaceBetween={30}
				slidesPerView={"auto"}
				centeredSlides={false}
				pagination={{
					clickable: true,
				}}
				modules={[Pagination]}
				className="mySwiper"
			>
				{jobLocation === undefined ||
					jobLocation.map((item, index) => {
						return (
							<SwiperSlide className={"slide slide" + (index + 1)}>
								<div className="top">
									<h3>Drop{index + 1}</h3>
									<p>{data?.client?.client_name}</p>
								</div>
								<div className="middle">
									<table>
										<tr>
											<td>
												<MdLocationPin className="location-icon1" />
											</td>
											<td>
												{" "}
												<p>{item?.from}</p>
											</td>
										</tr>
										<tr>
											<td>
												<MdLocationPin className="location-icon2" />
											</td>
											<td>
												{" "}
												<p>{item?.to}</p>
											</td>
										</tr>
									</table>
								</div>
								<div className="bottom">
									<span>
										<img
											src="/Images/truck.svg"
											alt=""
											style={{ width: "20px" }}
										/>
										{data?.vehicle}
									</span>
									<span>
										<img
											src="/Images/watch.svg"
											alt=""
											style={{ width: "20px" }}
										/>
										{data?.date}
									</span>
								</div>
							</SwiperSlide>
						);
					})}

				
			</Swiper>
		</>
	);
}

export default DashboardCarousel;
