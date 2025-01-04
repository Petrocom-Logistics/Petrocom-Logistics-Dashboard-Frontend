import React, { useEffect, useState } from "react";
import { RiShareBoxFill } from "react-icons/ri";
import { NavLink, Link, useLocation, useParams } from "react-router-dom";
import Loader from "../Loader";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setJobHistory } from "../../Store/slice/JobSlice";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
function JobList(props) {
  const { name } = useParams();
  const dispatch = useDispatch();
  const jobData = props.jobData;
  const [loading, setLoading] = useState(false);
  const stateJobData = useSelector((state) => state.job.jobHistory);
  const [openModal, setOpenModal] = useState(false);
  const gotoTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useEffect(() => {
    dispatch(setJobHistory(jobData));
  }, [props]);
  const [invoiceData, setInvoiceData] = useState({
    inv_no: "",
    inv_date: "",
    job_id: "",
    job_cost: "",
    job_total: "",
    vat: "20",
    po: "",
    data: [{ item: "", unit_cost: "", total: "" }],
  });
  const [jobid, setjobid] = useState("");
  const [jobbid, setJobbid] = useState("");
  const handleOpenModal = (job) => {
    setjobid(job?.id);
    setJobbid(job?.job_id);
    setOpenModal(true);
  };
  useEffect(() => {
    setInvoiceData((prevData) => ({
      ...prevData,
      job_id: jobid,
    }));
  }, [jobid]);
  const handleCloseModal = () => {
    setOpenModal(false);
    setInvoiceData({
      inv_no: "",
      inv_date: "",
      job_id: "",
      job_cost: "",
      vat: "20",
      job_total: "",
      po: "",
      data: [{ item: "", unit_cost: "", total: "" }],
    });
  };

  const handleItemChange = (index, field, value) => {
    setInvoiceData({ ...invoiceData, job_id: jobid });
    const updatedData = [...invoiceData.data];
    updatedData[index][field] = value;
    setInvoiceData({ ...invoiceData, data: updatedData });
  };

  const handleAddItem = () => {
    setInvoiceData((prev) => ({
      ...prev,
      data: [...prev.data, { item: "", unit_cost: "", total: "" }],
    }));
  };
  const handleRemoveItem = (index) => {
    const updatedData = invoiceData.data.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, data: updatedData });
  };
  const handleGenerateInvoice = (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post(
        "/api/invoice/create",
        {
          inv_date: invoiceData?.inv_date,
          inv_no: invoiceData?.inv_no,
          job_id: invoiceData?.job_id,
          vat: invoiceData?.vat,
          po: invoiceData?.po,
          data: invoiceData?.data,
          job_cost: invoiceData?.job_cost,
          job_total: invoiceData?.job_total,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("auth_token"),
          },
        }
      )
      .then((res) => {
        setLoading(false);
        setOpenModal(false);
        if (res.data.success == 1) {
          alert(res.data.message);
          window.scrollTo({ top: 0, left: 0 });
          window.location.reload();
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("AxiosError:", error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Request data:", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error message:", error.message);
        }
      });
  };

  return (
    <>
      {loading ? <Loader /> : ""}
      <h2>{name}</h2>
      <div className="JobListContainer">
        <table>
          <thead>
            <th>S.N</th>
            <th>Job Id</th>
            <th>Location</th>
            <th>Multidrop</th>
            <th>POD</th>
            <th>Invoice</th>
            {localStorage.getItem("type") == "1" ? (
              <th>Generate In.</th>
            ) : (
              <th></th>
            )}
            <th>Date</th>
            <th> Status</th>
            <th>Job Status</th>
            <th>Vehicle</th>
            <th>View </th>
          </thead>
          <tbody>
            <>
              {stateJobData === undefined || stateJobData?.length === 0 ? (
                <>
                  <Alert variant="outlined" severity="error">
                    No Such Record Found!
                  </Alert>
                </>
              ) : (
                <>
                  {stateJobData === undefined ||
                    stateJobData.toReversed().map((item, index) => {
                      const jobLocation = JSON.parse(item.job_location_data);
                      return (
                        <tr key={index} style={{ cursor: "context-menu" }}>
                          <td>{index + 1}</td>
                          <td>{item?.job_id}</td>
                          <td className="location">
                            {jobLocation === undefined ||
                              jobLocation.map((location) => {
                                return (
                                  <div>
                                    <p>{location?.from}</p>
                                    <p>{location?.to}</p>
                                  </div>
                                );
                              })}
                          </td>
                          <td>{item?.multidrop === 1 ? "Yes" : "No"}</td>
                          <td>
                            {item?.pod === null ? (
                              <Tooltip title="Unable to Download" arrow>
                                <img
                                  src="/Images/download-icon.svg"
                                  className="download-icon"
                                  alt=""
                                />
                              </Tooltip>
                            ) : (
                              <Tooltip title="Download POD" arrow>
                                <Link
                                  to={
                                    "https://dashboard-backend.petrocomlogistics.co.uk" +
                                    item?.pod
                                  }
                                >
                                  <img
                                    src="/Images/download-icon.svg"
                                    className="download-icon"
                                    alt=""
                                  />
                                </Link>
                              </Tooltip>
                            )}
                          </td>
                          <td>
                            {item?.invoice_id == 0 && item?.invoice == null ? (
                              <Tooltip title="Unable to Download" arrow>
                                <img
                                  src="/Images/download-icon.svg"
                                  className="download-icon"
                                  alt=""
                                />
                              </Tooltip>
                            ) : (
                              <Tooltip title="Download Invoice" arrow>
                                {item?.invoice != null ? (
                                  <Link
                                    to={
                                      "https://dashboard-backend.petrocomlogistics.co.uk" +
                                      item?.invoice
                                    }
                                  >
                                    {" "}
                                    <img
                                      src="/Images/download-icon.svg"
                                      className="download-icon"
                                      alt=""
                                    />
                                  </Link>
                                ) : (
                                  <NavLink to={"/invoice/" + item?.invoice_id}>
                                    <img
                                      src="/Images/download-icon.svg"
                                      className="download-icon"
                                      alt=""
                                    />
                                  </NavLink>
                                )}
                              </Tooltip>
                            )}
                          </td>
                          {localStorage.getItem("type") == "1" &&
                          item?.status == "Completed" ? (
                            <td>
                              {item?.invoice_id == "0" &&
                              item?.invoice == null ? (
                                <button
                                  onClick={() => handleOpenModal(item)}
                                  style={{ color: "#ff5f13" }}
                                >
                                  Generate
                                </button>
                              ) : (
                                <button style={{ color: "#447b18" }}>
                                  Generated
                                </button>
                              )}
                            </td>
                          ) : (
                            <td></td>
                          )}

                          <td>{item?.created_at.slice(0, 10)}</td>
                          <td>{item?.invoice_status}</td>
                          <td>
                            <span className={item?.status}>{item?.status}</span>
                          </td>
                          <td>{item?.vehicle}</td>
                          <Tooltip title="View Details" arrow>
                            <Link
                              to={"/jobhistory/jobdetails/" + item?.job_id}
                              onClick={gotoTop}
                            >
                              <td>
                                <RiShareBoxFill className="view-icon" />
                              </td>
                            </Link>
                          </Tooltip>
                        </tr>
                      );
                    })}
                </>
              )}
            </>
          </tbody>
        </table>
      </div>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <div id="send-load">
            <h2 style={{ paddingBottom: "10px" }}>Generate Invoice</h2>
            <p>Job Id : {jobbid}</p>
            <form className="invoice-gen-form" onSubmit={handleGenerateInvoice}>
              {/* Invoice Number */}
              <div className="row">
                {/* Invoice Date */}
                <div>
                  <label>Invoice Date:</label>
                  <input
                    type="date"
                    value={invoiceData.inv_date}
                    onChange={(e) =>
                      setInvoiceData({
                        ...invoiceData,
                        inv_date: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label>VAT:</label>

                  <input
                    style={{ padding: "10px ", width: "100px" }}
                    type="text"
                    className=""
                    value={invoiceData.vat}
                    onChange={(e) =>
                      setInvoiceData({
                        ...invoiceData,
                        vat: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label>PO:</label>

                  <input
                    style={{ padding: "10px ", width: "100px" }}
                    type="text"
                    className=""
                    value={invoiceData.po}
                    onChange={(e) =>
                      setInvoiceData({
                        ...invoiceData,
                        po: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Item Details */}
              <div style={{ marginBottom: "15px" }}>
                <h4>Item Details</h4>
                <label>Job:</label>

                <div className="row" style={{ marginBottom: "15px" }}>
                  <div>
                    <input
                      type="text"
                      className=""
                      value={invoiceData.job_cost}
                      onChange={(e) =>
                        setInvoiceData({
                          ...invoiceData,
                          job_cost: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter Job Cost "
                    />
                  </div>

                  {/* Invoice Date */}
                  <div>
                    <input
                      type="text"
                      value={invoiceData.job_total}
                      onChange={(e) =>
                        setInvoiceData({
                          ...invoiceData,
                          job_total: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter Job Total "
                    />
                  </div>
                </div>
                {invoiceData.data.map((item, index) => (
                  <div key={index} style={{ marginBottom: "10px" }}>
                    {/* Item Name */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <label>Item: {index + 1}</label>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        style={{
                          width: "auto",
                          backgroundColor: "#F44336",
                          color: "white",
                          padding: "5px",
                          border: "none",
                          cursor: "pointer",
                          marginBottom: "4px",
                        }}
                      >
                        X
                      </button>
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <input
                        type="text"
                        placeholder="Enter item name"
                        value={item.item}
                        onChange={(e) =>
                          handleItemChange(index, "item", e.target.value)
                        }
                      />
                      {/* Unit Cost */}
                      <input
                        type="number"
                        placeholder=" Unit cost"
                        value={item.unit_cost}
                        onChange={(e) =>
                          handleItemChange(index, "unit_cost", e.target.value)
                        }
                      />

                      {/* Total */}
                      <input
                        type="number"
                        placeholder="Total"
                        value={item.total}
                        onChange={(e) =>
                          handleItemChange(index, "total", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="Scheduled"
                  style={{
                    width: "auto",
                    marginRight: "10px",
                  }}
                >
                  Add Item
                </button>
                <button
                  type="submit"
                  className="Completed"
                  style={{
                    width: "auto",
                  }}
                >
                  Generate Invoice
                </button>
              </div>

              {/* Submit Button */}
            </form>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default JobList;
