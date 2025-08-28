import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../adminview/AdminSidebar.jsx";

function AdminDashboard() {
  const [salesData, setSalesData] = useState([]);
  const [applicantsData, setApplicantsData] = useState([]);
  const [loadingSales, setLoadingSales] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(true);
  const [errorSales, setErrorSales] = useState(null);
  const [errorApplicants, setErrorApplicants] = useState(null);

  const fetchSalesData = async () => {
    setLoadingSales(true);
    setErrorSales(null);
    try {
      const response = await fetch("http://localhost:2004/admin/getsales");
      if (!response.ok) throw new Error("Failed to fetch sales data");
      const data = await response.json();
      if (data.success) {
        setSalesData(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch sales data");
      }
    } catch (err) {
      setErrorSales(err.message || "Failed to fetch sales data");
    } finally {
      setLoadingSales(false);
    }
  };

  const fetchApplicantsData = async () => {
    setLoadingApplicants(true);
    setErrorApplicants(null);
    try {
      const response = await fetch("http://localhost:2004/admin/getApplicants");
      if (!response.ok) throw new Error("Failed to fetch applicants data");
      const data = await response.json();
      setApplicantsData(data);
    } catch (err) {
      setErrorApplicants(err.message || "Failed to fetch applicants data");
    } finally {
      setLoadingApplicants(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
    fetchApplicantsData();
  }, []);

  if (loadingSales || loadingApplicants) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading data...</p>
      </div>
    );
  }

  if (errorSales || errorApplicants) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-600">
        <p>Error: {errorSales || errorApplicants}</p>
        <button
          onClick={() => {
            fetchSalesData();
            fetchApplicantsData();
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-6 bg-white shadow-md rounded-lg">
        <Outlet context={{ salesData, setSalesData, applicantsData }} />
      </div>
    </div>
  );
}

export default AdminDashboard;
