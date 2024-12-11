import React, { useRef, useState, useEffect } from "react";
import { PDFExport } from "@progress/kendo-react-pdf";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../Component/Loader";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const Invoice = () => {
  const pdfRef = useRef();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [dropdata, setdropdata] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const fetchList = () => {
    setLoading(true);
    axios
      .get("/api/invoice/" + id, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("auth_token"),
        },
      })
      .then((res) => {
        if (res.data.success == 1) {
          setData(res.data.invoice);
          setdropdata(JSON.parse(res.data.invoice?.job?.job_location_data));
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  console.log(data);
  useEffect(() => {
    fetchList();
  }, [id]);

  const handleGeneratePdf = () => {
    pdfRef.current.save();
  };

  // Calculate Total Amount
  let totalAmount = 0;
  const jobAmount = parseFloat(data?.job_total) || 0;
  data?.data?.forEach((item) => {
    totalAmount += parseFloat(item.total) || 0;
  });
  const vat = parseFloat(data?.vat) || 0;
  const vattotal = ((jobAmount + totalAmount) * vat) / 100;
  const total = jobAmount + totalAmount + vattotal;

  // Handling Modal Open and Close
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // Handle Item Change for Edit
  const handleItemChange = (index, field, value) => {
    const updatedData = [...data.data];
    updatedData[index][field] = value;
    setData({ ...data, data: updatedData });
  };

  // Handle Adding a New Item
  const handleAddItem = () => {
    const newItem = { item: "", unit_cost: "", total: "" };
    setData((prev) => ({ ...prev, data: [...prev.data, newItem] }));
  };

  // Handle Removing an Item
  const handleRemoveItem = (index) => {
    const updatedData = data.data.filter((_, i) => i !== index);
    setData({ ...data, data: updatedData });
  };

  // Handle Form Submission (Can replace this with API call)
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(
        "/api/invoice/update/" + data?.id,
        {
          inv_date: data?.inv_date,
          inv_no: data?.inv_no,
          job_id: data?.job_id,
          vat: data?.vat,
          data: data?.data,
          job_cost: data?.job_cost,
          job_total: data?.job_total,
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
        alert(res.data.message);
        setOpenModal(false);
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
    // You can send `data` to your backend here
  };

  return (
    <div>
      {loading ? <Loader /> : ""}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handleGeneratePdf}
          style={{ margin: "20px", padding: "7px 15px" }}
          className="send-load"
        >
          Download PDF
        </button>
        {localStorage.getItem("type") == "1" ? (
          <button
            style={{ margin: "20px", padding: "7px 15px" }}
            className="send-load"
            onClick={() => handleOpenModal()}
          >
            Edit Invoice
          </button>
        ) : (
          ""
        )}
      </div>

      <PDFExport ref={pdfRef} fileName={`Invoice_${data?.inv_no}`}>
        <div className="invoice-container">
          <header className="invoice-header d-flex">
            <div className="logo">
              <img
                src="/Images/logoo.png"
                alt="logo"
                style={{ color: "black" }}
              />
            </div>
            <div className="company-info">
              <div style={{ textAlign: "left", width: "320px" }}>
                <p>INVOICE</p>
                <p>PETROCOM LOGISTICS</p>
                <p>74 Terrace Road, London</p>
                <p>E13 0PB</p>
              </div>
              <p>Tel.: +447502072526</p>
              <p>Email: info@petrocomlogistics.co.uk</p>
              <p>VAT: 466 0199 77</p>
            </div>
          </header>

          <section className="invoice-details">
            <div className="invoice-to">
              <div>
                <p>Invoice To:</p>
                <p>{data?.job?.client?.address}</p>
              </div>
            </div>
            <div className="invoice-meta">
              <p>INVOICE NO: {data?.id}</p>
              <p>INVOICE DATE: {data?.inv_date}</p>
            </div>
          </section>

          <section className="invoice-items">
            <table>
              <thead>
                <tr>
                  <th>Sr No.</th>
                  <th>Description</th>
                  <th>Unit Cost</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>
                    Date Ordered:{" "}
                    {new Date(data?.job?.created_at).toLocaleDateString()},
                    Vehicle: {data?.job?.vehicle}
                    <br />
                    <br />
                    {dropdata?.map((ite, index) => {
                      return (
                        <>
                          <span>
                            <b>Drop {index + 1}</b>
                            <br />
                            Pick up from: {ite?.from}
                            <br />
                            <br />
                            Delivered to: {ite?.to}
                            <br /> <br />
                          </span>
                        </>
                      );
                    })}
                    Delivered on :{" "}
                    {new Date(data?.created_at).toLocaleDateString()}
                  </td>
                  <td>£{data?.job_cost}</td>
                  <td>£{data?.job_total}</td>
                </tr>
                {data?.data?.[0]?.item != null &&
                  data?.data?.map((item, index) => {
                    return (
                      <>
                        <tr>
                          <td>{index + 2}</td>
                          <td>{item?.item}</td>
                          <td>£{item?.unit_cost}</td>
                          <td>£{item?.total}</td>
                        </tr>
                      </>
                    );
                  })}
                <tr>
                  <td
                    colSpan={2}
                    style={{ textAlign: "center" }}
                    className="total-label"
                  >
                    <b>Total Vat</b>
                  </td>
                  <td>
                    <b>£{vattotal}</b>
                  </td>
                  <td>
                    <b>£{vattotal}</b>
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan="2"
                    className="total-label"
                    style={{ textAlign: "center" }}
                  >
                    <b>Total Amount</b>
                  </td>
                  <td colSpan="2" style={{ textAlign: "center" }}>
                    <b>£{total}</b>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
          <p className="text-center" style={{ paddingBottom: "10px" }}>
            Payment Terms : 14 Days (From Invoice)
          </p>
          <section className="invoice-items">
            <table>
              <tbody style={{ textAlign: "left", lineHeight: "1.3" }}>
                <tr>
                  <td>
                    Bank Details : <br />
                    Bank Name : Lloyd's Bank
                    <br />
                    Account Holder Name : PETROCOM LOGISTICS LTD
                    <br />
                    Sort Code : 30-99-50
                    <br />
                    Account Number : 62957168
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
          <hr />
          <footer className="invoice-footer">
            <p>Thank you for your business!</p>
          </footer>
        </div>
      </PDFExport>
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
            <h2 style={{ paddingBottom: "10px" }}>Edit Invoice</h2>
            <p>Job Id : {data?.job?.job_id}</p>
            <form onSubmit={handleSubmit} className="invoice-gen-form">
              {/* Invoice Number and Date */}
              <div className="row">
                <div>
                  <label>Invoice Date:</label>
                  <input
                    type="date"
                    value={data?.inv_date || ""}
                    onChange={(e) =>
                      setData({ ...data, inv_date: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label>VAT:</label>
                  <input
                    type="text"
                    style={{ padding: "10px " }}
                    value={data?.vat || ""}
                    onChange={(e) => setData({ ...data, vat: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <h4>Item Details</h4>
                <label>Job:</label>
                {/* Job Cost and Total */}
                <div className="row" style={{ marginBottom: "15px" }}>
                  <div>
                    <input
                      type="text"
                      value={data?.job_cost || ""}
                      onChange={(e) =>
                        setData({ ...data, job_cost: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={data?.job_total || ""}
                      onChange={(e) =>
                        setData({ ...data, job_total: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Item List */}
              <div>
                {data?.data?.map((item, index) => (
                  <div key={index} style={{ marginBottom: "15px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <label>Item {index + 1}</label>
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
                        value={item?.item || ""}
                        onChange={(e) =>
                          handleItemChange(index, "item", e.target.value)
                        }
                        placeholder="Item name"
                      />
                      <input
                        type="number"
                        value={item?.unit_cost || ""}
                        onChange={(e) =>
                          handleItemChange(index, "unit_cost", e.target.value)
                        }
                        placeholder="Unit cost"
                      />
                      <input
                        type="number"
                        value={item?.total || ""}
                        onChange={(e) =>
                          handleItemChange(index, "total", e.target.value)
                        }
                        placeholder="Total"
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
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Invoice;
