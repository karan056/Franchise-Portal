import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Form from "./components/form/Form.jsx";
import App from "./App.jsx";
import Applicants from "./components/applicants/applicants.jsx";
import UserDashboard from "./components/dashboard/UserDashboard.jsx"; // ✅ Import Dashboard
import SingleApplicant from "./components/applicants/SingleApplicant.jsx";
import Login from "./components/login/Login.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/*" element={<App />} /> {/* ✅ Parent Route */}
      <Route path="/userdashboard/*" element={<UserDashboard />} /> {/* ✅ Nested Routes */}
      <Route path="/form" element={<Form />} />
      <Route path="/applicants" element={<Applicants />} />
      <Route path="/showApplicant/:email" element={<SingleApplicant />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </BrowserRouter>
);
