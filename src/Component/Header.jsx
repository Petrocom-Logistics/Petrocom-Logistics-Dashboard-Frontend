import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsArrowUpCircle } from "react-icons/bs";
import { RiMenu2Line } from "react-icons/ri";
import { VscBellDot } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Loader from "./Loader";
function Header() {
  const [active, setActive] = useState(false);
  const navigate = useNavigate();
  const data = useSelector((state) => state.user);

  const openmenuHandler = () => {
    if (window.innerWidth <= 769) {
      setActive(true);
      document.querySelector("#leftBar").style.display = "block";
    }
  };
  const closemenuHandler = () => {
    if (window.innerWidth <= 769) {
      setActive(!active);
      document.querySelector("#leftBar").style.display = "none";
    }
  };

  const [openLoad, setOpenLoad] = useState({ active: false });
  const openSendLoad = () => {
    setOpenLoad({ active: true });
  };
  return (
    <>
      <header id="header">
        <div className="header-left">
          <div className="menu">
            <span>
              {!active ? (
                <RiMenu2Line size={"25px"} onClick={openmenuHandler} />
              ) : (
                <AiOutlineCloseCircle
                  size={"25px"}
                  onClick={closemenuHandler}
                />
              )}
            </span>
          </div>
          <Link to="/">
            <img src="/Images/logo.png" alt="logo" />
          </Link>
        </div>
        <div className="header-right">
          {localStorage.getItem("type") === "3" ? (
            <button
              className="send-load"
              onClick={() => {
                // openSendLoad();
                navigate("/sendload");
              }}
            >
              <span>
                {/* <BsArrowUpCircle className="load-icon" /> */}
                <img
                  src="/Images/up-arrow.svg"
                  alt=""
                  style={{ width: "24px", height: "24px" }}
                />
              </span>

              <span className="hide-text">Send Load</span>
            </button>
          ) : (
            <></>
          )}
          {/* <span className="mail-icon">
            <HiMail />
          </span> */}
          {/* <span className="notification-icon">
						<VscBellDot />
					</span> */}
          {localStorage.getItem("type") !== "3" ? (
            <span>
              <img src="/Images/avtar.jpg" alt="img" className="avtar" />
            </span>
          ) : (
            <img
              src={
                "https://dashboard-backend.petrocomlogistics.co.uk" +
                JSON.parse(localStorage.getItem("client_data"))?.client_details
                  ?.photo
              }
              alt=""
            />
          )}

          <div className="about">
            <span className="hide-text">
              {localStorage.getItem("type") !== "3" ? (
                localStorage.getItem("type") === "1" ? (
                  <span className="user">Super Admin</span>
                ) : (
                  <span className="user">Admin</span>
                )
              ) : (
                <span className="user">
                  {
                    JSON.parse(localStorage.getItem("client_data"))
                      ?.client_details?.client_name
                  }
                </span>
              )}
            </span>
            <br />
            <span className="email">
              {JSON.parse(localStorage.getItem("client_data"))?.email?.slice(
                0,
                15
              ) + "..."}
            </span>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
