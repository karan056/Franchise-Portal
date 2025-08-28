import React, { useState } from "react";

function SalesData({ salesData, setSalesData }) {
  const [date, setDate] = useState("");
  const [customers, setCustomers] = useState("");
  const [todaySale, setTodaySale] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  const [email, setEmail] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        return parsedUser?.email || "Not Available";
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
    return "Not Available"; // Default fallback
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ date, customers, todaySale, email });

    fetch("http://localhost:2004/user/submitsales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ useremail: email, date, todaySale, customers }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("✅ Sales data submitted:", data);

        // Update salesData state in UserDashboard.jsx
        setSalesData((prevData) => [
          ...prevData,
          {
            _id: Date.now().toString(), // Temporary ID until the real one comes from DB
            useremail: email,
            date,
            customers: Number(customers),
            todaySale: Number(todaySale),
          },
        ]);

        setShowNotification(true); // Show success notification

        // Clear input fields
        setDate("");
        setCustomers("");
        setTodaySale("");

        // Hide notification after 3 seconds
        setTimeout(() => {
          setShowNotification(false);
        }, 3000);
      })
      .catch((error) => console.error("❌ Error submitting sales data:", error));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 relative">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Sales Data Entry
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Customers Served
              </label>
              <input
                type="number"
                value={customers}
                onChange={(e) => setCustomers(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Total Sales Amount ($)
              </label>
              <input
                type="number"
                value={todaySale}
                onChange={(e) => setTodaySale(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-medium py-3 rounded-xl hover:opacity-90 transition shadow-md"
          >
            Submit Sales Data
          </button>
        </form>

        {/* Notification */}
        {showNotification && (
          <div className="fixed bottom-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade">
            ✅ Sales Data Submitted Successfully!
          </div>
        )}
      </div>
    </div>
  );
}

export default SalesData;
