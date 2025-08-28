import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { sendEmail } from "../../utils/emailService";
import moment from "moment";

function SingleApplicant() {
  const { email } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://localhost:2004/admin/showapplicant/${email}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) {
      fetchUserData();
    }
  }, [email]);

  const createFranchise = async () => {
    const franchiseData = {
      useremail: user.email,
      pwd: user.mb,
      usertype: "Franchise"
    };
    
    try {
      const response = await axios.post(
        "http://localhost:2004/admin/createFranchise",
        franchiseData,
        {
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      
      if (response.data && response.data.status) {
        console.log("Franchise created successfully:", response.data);
        return true;
      } else {
        const errorMsg = response.data?.msg || "Failed to create franchise";
        console.error("Franchise creation failed:", errorMsg);
        throw new Error(errorMsg);
      }

    } catch (error) {
      console.error("Error creating franchise:", error);
      setError(error.message);
      return false;
    }
  };

  const sendFranchiseEmail = async (toEmail, name) => {
    const subject = "Congratulations! Your Franchise Has Been Created 🎉";
    const message = `We are pleased to inform you that your franchise has been successfully created! 🎉\n\nYour login credentials:\nEmail: ${toEmail}\nPassword: Your contact number\n\nWelcome to our team, and we look forward to working with you.\n\nBest Regards,\nKakka&Cake Company`;
    
    try {
      const emailSent = await sendEmail(toEmail, name, subject, message);
      if (emailSent) {
        console.log("Franchise email sent successfully!");
        return true;
      } else {
        console.error("Failed to send franchise email.");
        return false;
      }
    } catch (error) {
      console.error("Error sending franchise email:", error);
      return false;
    }
  };

  const updateStatus = async (status) => {
    if (!user || !user._id) {
      console.error("❌ Applicant ID is missing");
      return;
    }

    try {
      // First update the status
      const response = await axios.put(
        `http://localhost:2004/admin/updateStatus/${user._id}`,
        { status },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data && response.data.status) {
        // Refresh user data
        await fetchUserData();
        
        // Handle status-specific actions
        if (status === 1) {
          await sendAcceptanceEmail(user.email, user.mname);
        } else if (status === 2) {
          // First create franchise, then send email
          const franchiseCreated = await createFranchise();
          if (franchiseCreated) {
            await sendFranchiseEmail(user.email, user.mname);
          }
        }
      }
    } catch (error) {
      console.error("❌ Error updating status:", error);
      setError("Failed to update status. Please try again.");
    }
  };

  const sendAcceptanceEmail = async (toEmail, name) => {
    const subject = "Congratulations! Your Application Has Been Accepted";
    const message = `We are pleased to inform you that your application has been accepted! 🎉\n\nWelcome to our team, and we look forward to working with you.\n\nBest Regards,\nKakka&Cake Company`;
    
    try {
      const emailSent = await sendEmail(toEmail, name, subject, message);
      if (!emailSent) {
        throw new Error("Failed to send acceptance email");
      }
    } catch (error) {
      console.error("Error sending acceptance email:", error);
      setError("Status updated, but failed to send email");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-4">
        {error}. Please try again later.
      </div>
    );
  }

  if (!user) {
    return <p className="text-center text-gray-600">No data available</p>;
  }

  const renderField = (key, value) => {
    const fieldMap = {
      mname: 'Name',
      email: 'Email',
      mb: 'Contact No.',
      addr: 'Address',
      bname: 'Business Name'
    };

    if (key === 'date') {
      const date = new Date(value);
      return [
        <tr key="date" className="border-b border-gray-200">
          <td className="px-4 py-2 font-semibold bg-gray-100">Date</td>
          <td className="px-4 py-2">{date.toLocaleDateString()}</td>
        </tr>,
        <tr key="time" className="border-b border-gray-200">
          <td className="px-4 py-2 font-semibold bg-gray-100">Time</td>
          <td className="px-4 py-2">{date.toLocaleTimeString()}</td>
        </tr>
      ];
    }

    if (key === 'status') {
      const statusMap = {
        '-1': 'Declined',
        '0': 'Pending',
        '1': 'Accepted',
        '2': 'Franchise'
      };
      value = statusMap[value.toString()] || value;
    }

    return (
      <tr key={key} className="border-b border-gray-200">
        <td className="px-4 py-2 font-semibold bg-gray-100">
          {fieldMap[key] || key.replace(/_/g, " ")}
        </td>
        <td className="px-4 py-2">{value}</td>
      </tr>
    );
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <span 
          onClick={() => navigate(-1)}
          className="text-blue-500 hover:text-blue-700 cursor-pointer"
        >
          &larr; Back
        </span>
        <h2 className="text-2xl font-bold text-gray-700">
          Applicant Information
        </h2>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <tbody>
          {Object.entries(user)
            .filter(([key]) => key !== '_id')
            .map(([key, value]) => renderField(key, value))}
        </tbody>
      </table>

      <div className="mt-8">
        {user.status === -1 && (
          <p className="text-center text-red-500">Declined</p>
        )}
        {user.status === 0 && (
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => updateStatus(1)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Accept
            </button>
            <button
              onClick={() => updateStatus(-1)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Decline
            </button>
          </div>
        )}
        {user.status === 1 && (
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => updateStatus(-1)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
            <button
              onClick={() => updateStatus(2)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Franchise
            </button>
          </div>
        )}
        {user.status === 2 && (
          <p className="text-center text-green-500">Franchised</p>
        )}
      </div>
    </div>
  );
}

export default SingleApplicant;
