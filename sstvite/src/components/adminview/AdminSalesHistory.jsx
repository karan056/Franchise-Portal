import React, { useState, useEffect } from "react";

function AdminSalesHistory({ salesData = [] }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "asc" });
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    setFilteredData(salesData);
  }, [salesData]);

  const handleFetch = () => {
    if (!startDate || !endDate) {
      alert("⚠ Please select both start and end dates.");
      return;
    }

    const filtered = salesData.filter((sale) => {
      const saleDate = new Date(sale.date).setHours(0, 0, 0, 0);
      const start = new Date(startDate).setHours(0, 0, 0, 0);
      const end = new Date(endDate).setHours(23, 59, 59, 999);
      return saleDate >= start && saleDate <= end;
    });

    setFilteredData(filtered);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key === "date") {
      return sortConfig.direction === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    } else {
      return sortConfig.direction === "asc"
        ? a[sortConfig.key] - b[sortConfig.key]
        : b[sortConfig.key] - a[sortConfig.key];
    }
  });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const totalRevenue = sortedData.reduce((sum, sale) => sum + (sale.todaySale || 0), 0);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="bg-white shadow-lg rounded-3xl p-8 border border-gray-200 relative">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">🧾 Admin: Sales History</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleFetch}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Fetch Data
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-sm">
          <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-500 text-white text-sm uppercase">
                <th className="py-4 px-4 text-left">📧 Email</th>
                <th className="py-4 px-4 text-left cursor-pointer" onClick={() => handleSort("date")}>
                  📅 Date {sortConfig.key === "date" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
                <th className="py-4 px-4 text-left cursor-pointer" onClick={() => handleSort("customers")}>
                  👥 Customers {sortConfig.key === "customers" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
                <th className="py-4 px-4 text-left cursor-pointer" onClick={() => handleSort("todaySale")}>
                  💰 Sales (₹) {sortConfig.key === "todaySale" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.length > 0 ? (
                <>
                  {sortedData.map((sale, index) => (
                    <tr
                      key={sale._id}
                      className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
                    >
                      <td className="py-4 px-4">{sale.useremail}</td>
                      <td className="py-4 px-4">{new Date(sale.date).toLocaleDateString()}</td>
                      <td className="py-4 px-4">{sale.customers}</td>
                      <td className="py-4 px-4 font-semibold">₹{sale.todaySale}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-bold">
                    <td colSpan="3" className="py-4 px-4 text-right">Total Revenue:</td>
                    <td className="py-4 px-4 text-blue-600">₹{totalRevenue}</td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    ⚠ No data for selected dates.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showNotification && (
          <div className="fixed bottom-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade">
            ✅ Data Fetched!
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminSalesHistory;
