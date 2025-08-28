import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { sendEmail } from "../../utils/emailService";
import moment from "moment";

const Info = () => {
  let { email } = useParams();
  let redirect = useNavigate();
  const [applicant, setApplicant] = useState(null);

  useEffect(() => {
    if (email) fetchApplicantDetails();
  }, [email]);

  const fetchApplicantDetails = async () => {
    try {
      console.log("Fetching applicant details for:", email);
      const response = await axios.get(`http://localhost:2004/admin/getApplicant/${email}`);
      if (response.data && response.data.data) {
        setApplicant(response.data.data);
      } else {
        console.error("Invalid data structure received:", response.data);
        setApplicant(null);
      }
    } catch (error) {
      console.error("Error fetching applicant details:", error);
    }
  };

  const updateStatus = async (status) => {
    if (!applicant || !applicant._id) {
      console.error("❌ Applicant ID is missing");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:2004/admin/updateStatus/${applicant._id}`,
        { status },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data && response.data.status) {
        fetchApplicantDetails();
        if (status === 1) {
          try {
            await sendAcceptanceEmail(applicant.email, applicant.mname);
          } catch (error) {
            console.error("Email sending failed, but status was updated:", error);
          }
        }
        if (status === 2) {
          try {
            await sendFranchiseEmail(applicant.email, applicant.mname);
          } catch (error) {
            console.error("Email sending failed, but status was updated:", error);
          }
          try{
            await createFranchise();
          } catch(error){
            console.error("Error creating franchise:", error);
          }
        }
      }
    } catch (error) {
      console.error("❌ Error updating status:", error);
    }
  };


  const createFranchise = async () => {
    const franchiseData = {
      useremail: applicant.email,
      pwd: applicant.mb,
      usertype: "Franchise"
    };
    
    try {
      const url = "http://localhost:2004/admin/createFranchise";
      const resp = await axios.post(url, franchiseData, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (resp.data.status) {
        alert(resp.data.msg);
      } else {
        alert(resp.data.msg);
      }
    } catch (error) {
      console.error("Error creating franchise:", error);
      alert("Failed to create franchise. Please try again.");
    }
  };



  const sendAcceptanceEmail = async (toEmail, name) => {
    const subject = "Congratulations! Your Application Has Been Accepted for further discussion for franchise process 🎉";
    const message = `We are pleased to inform you that your application has been accepted! 🎉\n\nWelcome to our team, and we look forward to working with you.\n\nBest Regards,\nKakka&Cake Company`;
    const fromName = "Kakka&Cake Company";
    
    const emailSent = await sendEmail(toEmail, name, subject, message);
    
    if (emailSent) {
      console.log("Acceptance email sent successfully!");
    } else {
      console.error("Failed to send acceptance email.");
    }
  };

  const sendFranchiseEmail = async (toEmail, name) => {
    const subject = "Congratulations! Your Application Has Been Accepted as a Franchisee! 🎉";
    const message = `We are pleased to inform you that your application has been accepted for FRANCHISE!! \n Your login credentials are :- Email address: ${applicant.email}, Password: ${applicant.mb}🎉\n\nWelcome to our team, and we look forward to working with you.\n\nBest Regards,\nKakka&Cake Company`;
    const fromName = "Kakka&Cake Company";
    
    const emailSent = await sendEmail(toEmail, name, subject, message);

    if (emailSent) {
      console.log("Acceptance email sent successfully!");
    } else {
      console.error("Failed to send acceptance email.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl border relative">
        <button
          className="absolute top-4 left-4 bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-900 transition-all"
          onClick={() => redirect("/form2")}
        >
          Back
        </button>

        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Applicant Details</h2>

        {applicant ? (
          <div className="text-lg text-gray-700 space-y-2">
            {Object.entries(applicant)
              .filter(([key]) => !['_id', '__v'].includes(key)) // Exclude internal fields
              .map(([key, value]) => {
                const fieldMap = {
                  mname: 'Name',
                  email: 'Email',
                  mb: 'Contact',
                  addr: 'Address',
                  bname: 'Business',
                  createdAt: 'Created At',
                  updatedAt: 'Updated At'
                };
                
                if (key === 'status') {
                  return (
                    <p key={key}>
                      <strong>Status:</strong>
                      <span className={
                        value === 0 ? "text-yellow-500" :
                        value === 1 ? "text-green-500" :
                        value === 2 ? "text-blue-500" :
                        "text-red-500"
                      }>
                        {value === 0 ? "Pending" :
                        value === 1 ? "Accepted" :
                        value === 2 ? "Franchised" : "Declined"}
                      </span>
                    </p>
                  );
                }

                if (['createdAt', 'updatedAt'].includes(key)) {
                  value = moment(value).format("MMM Do YYYY, h:mm:ss a");
                }

                return (
                  <p key={key}>
                    <strong>{fieldMap[key] || key.replace(/_/g, " ")}:</strong> {value}
                  </p>
                );
              })}
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading applicant details...</p>
        )}

        <div className="mt-6 flex justify-center gap-4">
          {applicant?.status === 0 ? (
            <>
              <button
                className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-green-700 transition-all"
                onClick={() => updateStatus(1)}
              >
                Accept
              </button>
              <button
                className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-red-700 transition-all"
                onClick={() => updateStatus(-1)}
              >
                Decline
              </button>
            </>
          ) : applicant?.status === 1 ? (
            <>
              <button
                className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-red-700 transition-all"
                onClick={() => updateStatus(-1)}
              >
                Decline
              </button>
              <button
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all"
                onClick={() => updateStatus(2)}
              >
                Franchise
              </button>
            </>
          ) : applicant?.status === -1 ? (
            <p className="text-red-500 font-semibold">Declined</p>
          ) : applicant?.status === 2 ? (
            <p className="text-blue-500 font-semibold">Franchised</p>
          ) : (
            <p className="text-gray-500">No actions available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Info;
