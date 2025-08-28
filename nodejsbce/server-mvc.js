var express = require("express");
var fileuploader = require("express-fileupload");
var mongoose = require("mongoose");
var cors = require("cors");
var dotenv = require("dotenv");

var { url } = require("./config/config");

var app = express();
// dotenv.config(); // Load environment variables

// // ✅ Use CORS Middleware (Fix the origin)
// app.use(
//   cors({
//     origin: "http://localhost:5179", // Set frontend URL
//     methods: "GET,POST,PUT,DELETE",
//     credentials: true, // Allow cookies if needed
//   })
// );
app.use(cors());
// Start Server
app.listen(2004, function () {
  console.log("Server Started on Port 2004...");
});

// Middleware
app.use(express.json()); // Enable JSON body parsing
app.use(express.urlencoded({ extended: true }));
app.use(fileuploader());

// Connect to MongoDB (No Deprecated Options)
mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err.message);
  });

// Routers
var userRouter = require("./routers/userRouter");
app.use("/user", userRouter);

var adminRouter = require("./routers/adminRouter");
app.use("/admin", adminRouter);
