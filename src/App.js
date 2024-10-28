import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import JobHistory from "./Pages/JobHistory";
import ClientLists from "./Pages/ClientLists";
import Manage from "./Pages/Manage";
import { Provider } from "react-redux";
import Protected from "./Component/Protected";
import Header from "./Component/Header";
import store from "./Store/index";
import ClientById from "./Pages/ClientById";
import CreateJob from "./Pages/CreateJob";
import JobDetailsById from "./Pages/JobDetailsById";
import LoadSend from "./Pages/LoadSend";
import Invoice from "./Pages/Invoice";

function App() {
  return (
    <>
      <Provider store={store}>
        <HashRouter>
          <Header />
          <Routes>
            <Route path="/login" element={<Protected Component={Login} />} />
            <Route path="/" element={<Protected Component={Dashboard} />} />
            <Route
              path="/dashboard"
              element={<Protected Component={Dashboard} />}
            />
            <Route
              path="/dashboard/:id"
              element={<Protected Component={Dashboard} />}
            />
            <Route
              path="/clientlist/dashboard/:id/:name"
              element={<Protected Component={Dashboard} />}
            />
            <Route
              path="/clientlist/jobhistory/:id/:name"
              element={<Protected Component={JobHistory} />}
            />

            <Route
              path="/jobhistory"
              element={<Protected Component={JobHistory} />}
            />
            <Route
              path="/jobhistory/:id"
              element={<Protected Component={JobHistory} />}
            />
            <Route
              path="/jobhistory/jobdetails/:id"
              element={<Protected Component={JobDetailsById} />}
            />
            <Route
              path="/jobhistory/createJob/:id/:name"
              element={<Protected Component={CreateJob} />}
            />
            <Route
              path="/manage/:clientId"
              element={<Protected Component={Manage} />}
            />
            <Route
              path="/clientlist/id/:id"
              element={<Protected Component={ClientById} />}
            />
            <Route
              path="/clientlist"
              element={<Protected Component={ClientLists} />}
            />
            <Route path="/manage" element={<Protected Component={Manage} />} />
            <Route
              path="/sendload"
              element={<Protected Component={LoadSend} />}
            />
            <Route
              path="/invoice/:id"
              element={<Protected Component={Invoice} />}
            />
          </Routes>
        </HashRouter>
      </Provider>
    </>
  );
}

export default App;
