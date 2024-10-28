import { React, useEffect, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { LiaCalendarAlt } from "react-icons/lia";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import Calendarr from "./Calendarr";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";
import axios from "axios";
import Loader from "../Loader";
import { filterJobHistory } from "../../Store/slice/JobSlice";
import Toast from "../Toast";
function JobHistoryTopBar(props) {
  const { name } = useParams();
  const dispatch = useDispatch();

  const id = props.clientId;
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ active: false, msg: "", type: "" });
  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const [openFilter, setOpenFilter] = useState(false);
  const onOpenFilterModal = () => setOpenFilter(true);
  const onCloseFilterModal = () => setOpenFilter(false);
  const navigate = useNavigate();
  const filterHandler = (e) => {
    setLoading(true);
    const value = e.target.innerText;
    if (location.pathname === "/jobhistory") {
      axios
        .get("/api/job/getJobByStatus/" + value, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("auth_token"),
          },
        })
        .then((res) => {
          setLoading(false);
          console.log(res.data);
          if (res.data.status != 1) {
            setToast({ active: true, msg: res.data.message, type: "error" });
          } else {
            dispatch(filterJobHistory(res.data.data));
            setOpenFilter(false);
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    } else {
      console.log(value);
      axios
        .get("/api/job/getJobByStatusByClient/" + id + "/" + value, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("auth_token"),
          },
        })
        .then((res) => {
          setLoading(false);
          if (res.data.status !== 1) {
            setToast({
              active: true,
              msg: res.data.message,
              type: "error",
            });
          } else {
            dispatch(filterJobHistory(res.data.data));
            setOpenFilter(false);
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
  };

  return (
    <>
      <Toast
        open={toast.active}
        msg={toast.msg}
        setToast={setToast}
        type={toast.type}
      />
      {loading ? <Loader /> : ""}
      <div>
        <Modal open={open} onClose={onCloseModal} center>
          <Calendarr />
        </Modal>
        <Modal open={openFilter} onClose={onCloseFilterModal} center>
          <div className="FilterBox">
            <ul>
              <li onClick={(e) => filterHandler(e)}>In-Progress</li>
              <li
                onClick={(e) => filterHandler(e)}
                style={{ background: "#FFEDE4" }}
              >
                Completed
              </li>
              <li onClick={(e) => filterHandler(e)}>Cancelled</li>
              <li onClick={(e) => filterHandler(e)}>Scheduled </li>
              <li onClick={(e) => filterHandler(e)} style={{}}>
                paid
              </li>
              <li onClick={(e) => filterHandler(e)}>due</li>
              <li onClick={(e) => filterHandler(e)}>Generated</li>
              <li onClick={(e) => filterHandler(e)}>Not-Generated</li>
            </ul>
          </div>
        </Modal>
      </div>

      <div id="JobHistroyTopBar">
        <div className="left">
          <h3>Job History</h3>
        </div>
        <div className="right">
          {localStorage.getItem("type") !== "3" &&
          location.pathname !== "/jobhistory" ? (
            <button
              className="send-load filter-btn"
              onClick={() => {
                navigate("/jobhistory/createJob/" + id + "/" + name);
              }}
            >
              <BsFillPlusCircleFill size={"20px"} />
              <span className="hide-text" filter-btn>
                Create Job
              </span>
            </button>
          ) : (
            ""
          )}

          <button className="border-button filter-btn" onClick={onOpenModal}>
            <LiaCalendarAlt size={"25px"} />
            <span className="hide-text" onClick={onOpenModal}>
              Search by Date
            </span>
          </button>
          <button
            className="border-button filter-btn"
            onClick={onOpenFilterModal}
          >
            <FiFilter size={"22px"} />
            <span className="hide-text">Job Filter</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default JobHistoryTopBar;
