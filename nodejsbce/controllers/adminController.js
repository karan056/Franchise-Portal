const mongoose = require("mongoose");
var { getUserModel } = require("../models/userModel");
const { getLoginModel } = require("../models/LoginModel");
var UserColRef = getUserModel();
var LoginColRef = getLoginModel();


// module.exports = { submitSalesData };


async function loginUser(req, res) {
    try {
        const { useremail, pwd } = req.body;

        // Find user by email
        const user = await LoginColRef.findOne({ useremail });

        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid email or password" 
            });
        }

        // Check password
        if (user.pwd !== pwd) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid email or password" 
            });
        }

        // Return success response with user data
        res.json({ 
            success: true,
            user: {
                _id: user._id,
                email: user.useremail,
                usertype: user.usertype
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            success: false,
            message: "Login failed. Please try again." 
        });
    }
}

// Function to fetch all applicants from the database
async function doShowAll(req, resp) {
    try {
        let applicants = await UserColRef.find();
        resp.json(applicants); // Send data as JSON response
    } catch (err) {
        console.log(err.message);
        resp.status(500).send("Error retrieving applicants.");
    }
}


async function updateStatus(req, resp) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        // Validate status value
        if (![-1, 0, 1, 2].includes(status)) {
            return resp.status(400).json({ status: false, message: "Invalid status value" });
        }

        const updatedApplicant = await UserColRef.findByIdAndUpdate(
            id, 
            { status }, 
            { new: true }
        );

        if (!updatedApplicant) {
            return resp.status(404).json({ status: false, message: "Applicant not found" });
        }

        const statusMessages = {
            '-1': 'Declined',
            '0': 'Pending',
            '1': 'Accepted',
            '2': 'Franchised'
        };

        resp.json({ 
            status: true, 
            message: `Status updated to ${statusMessages[status]} (${status})`, 
            data: updatedApplicant 
        });
    } catch (error) {
        console.error(error.message);
        resp.status(500).json({ status: false, message: "Error updating status", error: error.message });
    }
}


// const { getUserModel } = require("../models/userModel");

const showApplicant = async (req, res) => {
  try {
    const User = getUserModel();
    const userEmail = req.params.email;

    // Find user by email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// module.exports = { showApplicantByEmail };
async function createFranchise(req, resp) {
    try {
        const { useremail, pwd } = req.body;
        
        // Validate required fields
        if (!useremail || !pwd) {
            return resp.status(400).json({ 
                status: false, 
                msg: "Email and password are required" 
            });
        }

        // Check if franchise already exists
        const existingFranchise = await LoginColRef.findOne({ useremail });
        if (existingFranchise) {
            return resp.status(400).json({ 
                status: false, 
                msg: "Franchise already exists" 
            });
        }

        // Create new franchise with only the required fields
        const franchiseData = {
            useremail,
            pwd,
            usertype: "Franchise"
        };

        const newFranchise = new LoginColRef(franchiseData);
        const savedFranchise = await newFranchise.save();

        resp.status(201).json({ 
            status: true, 
            msg: "Franchise created successfully",
            data: savedFranchise
        });

    } catch (err) {
        console.error("Error creating franchise:", err);
        resp.status(500).json({ 
            status: false, 
            msg: "Error creating franchise",
            error: err.message 
        });
    }
}

module.exports = { doShowAll, updateStatus, showApplicant, createFranchise, loginUser};
