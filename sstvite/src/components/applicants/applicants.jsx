import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";




const Applicants = () => {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("Show All");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const rowsLimit = 5;


  useEffect(() => {
    fetchApplicants();
  }, []);

  useEffect(() => {
    filterApplicants();
  }, [applicants, selectedStatus]);

  const fetchApplicants = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:2004/admin/getApplicants", {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (response.data && Array.isArray(response.data)) {
        setApplicants(response.data);
      } else {
        throw new Error("Invalid data format received from server");
      }
    } catch (error) {
      console.error("Error fetching applicants:", error);
      setError(error.response?.data?.message || "Failed to fetch applicants. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };


  const filterApplicants = () => {
    if (selectedStatus === "Show All") {
      setFilteredApplicants(applicants);
    } else {
      const statusMap = {
        Pending: 0,
        Accepted: 1,
        Rejected: -1,
        Franchise: 2,
      };
      setFilteredApplicants(applicants.filter((app) => app.status === statusMap[selectedStatus]));
    }
    setCurrentPage(0);
  };




  const handleDecline = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:2004/admin/updateStatus/${id}`,
        { status: -1 },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      if (response.data && response.data.status) {
        fetchApplicants(); // Refresh the data

      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setError(error.response?.data?.message || "Failed to update status. Please try again.");
    }
  };





  const rowsToShow = filteredApplicants.slice(currentPage * rowsLimit, (currentPage + 1) * rowsLimit);
  const totalPage = Math.ceil(filteredApplicants.length / rowsLimit);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center pt-10 pb-14">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">Loading...</div>
        </div>
      )}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="w-full max-w-7xl px-4 bg-white rounded-lg shadow-lg">
        {/* Header with Title & Dropdown */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Applicants Table</h1>
          <select
            className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="Show All">Show All</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="Franchise">Franchise</option>
          </select>
        </div>

        <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 font-semibold">Sr No.</th>
                <th className="py-3 px-4 font-semibold">Name</th>
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold">Contact No.</th>
                <th className="py-3 px-4 font-semibold">Address</th>
                <th className="py-3 px-4 font-semibold">Business</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rowsToShow.map((data, index) => (
                <tr
                  key={data._id}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-t border-b border-gray-200`}
                >
                  <td className="py-3 px-4">{index + 1 + currentPage * rowsLimit}</td>
                  <td className="py-3 px-4">{data.mname}</td>
                  <td className="py-3 px-4">{data.email}</td>
                  <td className="py-3 px-4">{data.mb}</td>
                  <td className="py-3 px-4">{data.addr}</td>
                  <td className="py-3 px-4">{data.bname}</td>
                  <td className="py-3 px-4">
                    {data.status === 0 ? "Pending" :
                    data.status === 1 ? "Accepted" :
                    data.status === -1 ? "Declined" :
                    "Franchise"}
                  </td>
                  <td className="py-3 px-4">{new Date(data.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 flex space-x-2">
                    <button 
                      onClick={() => navigate(`/showApplicant/${data.email}`)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                      Info
                    </button>

                    {data.status !== -1 && (
                      <button
                        onClick={() => handleDecline(data._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition duration-200"
                      >
                        Decline
                      </button>
                    )}

                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-700">
            Showing {currentPage * rowsLimit + 1} to {Math.min((currentPage + 1) * rowsLimit, filteredApplicants.length)} of {filteredApplicants.length} entries
          </div>
          <div className="flex space-x-3">
            <button
              className={`px-3 py-2 rounded-lg border ${currentPage === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-800 text-white"}`}
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
            >
              Prev
            </button>
            <button
              className={`px-3 py-2 rounded-lg border ${currentPage === totalPage - 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-800 text-white"}`}
              onClick={() => setCurrentPage(Math.min(totalPage - 1, currentPage + 1))}
              disabled={currentPage === totalPage - 1}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applicants;
