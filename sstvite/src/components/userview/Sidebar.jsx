import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, LineChart, History, Settings, LogOut, Menu, X } from "lucide-react";

function Sidebar() {
  // Load user email from localStorage immediately
  const [email, setEmail] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      // console.log(localStorage.getItem("user"));
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // console.log(`${parsedUser.useremail}`);
        return parsedUser?.email || "Not Available";
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
    return "Not Available"; // Default fallback
  });

  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true); // Toggle state

  // Debugging: Log email whenever it updates
  useEffect(() => {
    console.log("Updated email:", email);
  }, [email]);

  const navItems = [
    { name: "Today's Sale", path: "/userdashboard", icon: <Home size={20} /> },
    { name: "Sales History", path: "/userdashboard/sales-history", icon: <History size={20} /> },
    { name: "Charts", path: "/userdashboard/charts", icon: <LineChart size={20} /> },
    { name: "Settings", path: "/userdashboard/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white min-h-screen p-4 border-r border-gray-700 flex flex-col transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Toggle Button */}
        {/* <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-6 right-[-35px] bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-700 transition"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button> */}

        {/* Franchisee ID */}
        {isOpen && (
          <div className="bg-gray-800 p-4 text-center mb-6 rounded-md shadow">
            <p className="text-gray-300 text-sm">{`Frachise ID: ${email}`}</p>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1">
          <ul className="space-y-3">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-md transition duration-200 ${
                    location.pathname === item.path
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {item.icon}
                  {isOpen && <span className="text-sm font-medium">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="mt-6">
          <Link
            to="/userdashboard/logout"
            className="flex items-center gap-3 p-3 rounded-md bg-red-500 text-white transition duration-200 hover:bg-red-600"
          >
            <LogOut size={20} />
            {isOpen && <span className="text-sm font-medium">Logout</span>}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
