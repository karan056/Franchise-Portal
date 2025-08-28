import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../userview/Sidebar";
import SalesData from "../userview/SalesData";
import SalesHistory from "../userview/SalesHistory";
import Charts from "../userview/Charts";
import Settings from "../userview/Settings";
import LoginForm from "../userview/LoginForm";

function UserDashboard() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSalesData = async () => {
    setLoading(true);
    setError(null);

    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) throw new Error("User data not found in local storage");

      const userEmail = JSON.parse(storedUser)?.email;
      if (!userEmail) throw new Error("User email not found in local storage");

      const response = await fetch(
        `http://localhost:2004/user/getsales?useremail=${userEmail}`
      );

      if (!response.ok) throw new Error("Failed to fetch sales data");

      const data = await response.json();

      if (data.success) {
        setSalesData(data.data); // Update salesData state
        console.log("📩 Sales Data Updated:", data.data);
      } else {
        throw new Error(data.message || "Failed to fetch sales history");
      }
    } catch (err) {
      console.error("❌ Error fetching sales data:", err);
      setError(err.message || "Failed to fetch sales data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-white shadow-md rounded-lg">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading sales data...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-red-500">Error: {error}</p>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<SalesData salesData={salesData} setSalesData={setSalesData} />} />
            <Route path="totalsales" element={<SalesData salesData={salesData} setSalesData={setSalesData} />} />
            <Route path="sales-history" element={<SalesHistory salesData={salesData} />} />
            <Route path="charts" element={<Charts salesData={salesData} />} />
            <Route path="settings" element={<Settings />} />
            <Route path="logout" element={<LoginForm />} />
          </Routes>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
