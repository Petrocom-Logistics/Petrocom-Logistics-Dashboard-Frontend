import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";

axios.defaults.baseURL = "https://dashboard-backend.petrocomlogistics.co.uk";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
