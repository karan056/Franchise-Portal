import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login/Login";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import SalesData from "./components/userview/SalesData";
import SalesHistory from "./components/userview/SalesHistory";
import Charts from "./components/userview/Charts";
import Applicants from "./components/applicants/applicants";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admindashboard/*" element={<AdminDashboard />}>
        <Route index element={<Navigate to="totalsales" replace />} />
        <Route path="totalsales" element={<SalesData />} />
        <Route path="sales-history" element={<SalesHistory />} />
        <Route path="charts" element={<Charts />} />
        <Route path="applicants" element={<Applicants />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
