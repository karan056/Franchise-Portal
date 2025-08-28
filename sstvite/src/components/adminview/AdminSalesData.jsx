import React, { useEffect, useState } from "react";

function AdminSalesData() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:2004/admin/getsales")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch sales data");
        return response.json();
      })
      .then((data) => {
        setSalesData(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-10">Loading sales data...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">Error: {error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">All Sales Records</h2>

      <div className="overflow-x-auto bg-white shadow-lg rounded-xl p-4">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Customers</th>
              <th className="px-4 py-2 border">Total Sale</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((entry) => (
              <tr key={entry._id} className="text-center">
                <td className="px-4 py-2 border">{entry.useremail}</td>
                <td className="px-4 py-2 border">{new Date(entry.date).toLocaleDateString()}</td>
                <td className="px-4 py-2 border">{entry.customers}</td>
                <td className="px-4 py-2 border">₹{entry.todaySale}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminSalesData;
