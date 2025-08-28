import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CloudCog } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("🔄 Attempting login with:", { email, password });

      const response = await axios.post("http://localhost:2004/admin/login", {
        useremail: email,
        pwd: password,
      });

      console.log("✅ Login response:", response.data);

      if (response.data.success) {
        const user = response.data.user; // Get user object
        localStorage.setItem("user", JSON.stringify(user)); // Store user in localStorage
         console.log("saved loacally.");
        // ✅ Extract userType properly
        const userType = user.usertype;

        // Route based on user type
        if (userType === "Franchise") {
          console.log("✅ Redirecting to /userdashboard");
          navigate("/userdashboard");
        } else {
          console.log("✅ Redirecting to /admindashboard");
          navigate("/admindashboard");
        }
      } else {
        console.log("❌ Login failed:", response.data);
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="flex flex-col md:flex-row max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden w-full">
        
        {/* Left Side - Image Section */}
        <div className="md:w-1/2 hidden md:flex items-center justify-center bg-gradient-to-r from-yellow-400 to-purple-500">
          <img 
            src="/login.png" 
            alt="Login Illustration" 
            className="w-4/5 max-h-96 object-contain"
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-gray-800 text-center">Welcome Back</h2>
          <p className="text-gray-500 text-center mt-2">Sign in to your account</p>

          <form className="mt-6 space-y-5" onSubmit={handleLogin}>
            {/* Email Field */}
            <div>
              <label className="block text-gray-600 font-medium">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-600 font-medium">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            {error && (
              <div className="mt-4 text-red-500 text-center">
                {error}
              </div>
            )}
          </form>

          {/* Extra Links */}
          <p className="mt-4 text-center text-gray-600">
            Forgot password? <a href="#" className="text-blue-500 hover:underline">Reset</a>
          </p>
          <p className="mt-2 text-center text-gray-600">
            Don't have an account? <a href="#" className="text-blue-500 hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
