import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";

axios.defaults.baseURL =
  "https://d6b1-2401-4900-1ca9-d672-41c5-57fe-6740-bb05.ngrok-free.app";
// axios.defaults.baseURL = "https://dashboard-backend.petrocomlogistics.co.uk";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
