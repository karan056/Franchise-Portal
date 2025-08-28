import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, LineChart, History, Settings, LogOut, Menu, X, Users } from "lucide-react";

function AdminSidebar() {
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
    return "Not Available";
  });

  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { name: "Total Sales", path: "/admindashboard/totalsales", icon: <Home size={20} /> },
    { name: "Sales History", path: "/admindashboard/sales-history", icon: <History size={20} /> },
    { name: "Charts", path: "/admindashboard/charts", icon: <LineChart size={20} /> },
    { name: "Applicants", path: "/admindashboard/applicants", icon: <Users size={20} /> },
    { name: "Settings", path: "/admindashboard/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex">
      <div
        className={`bg-gray-900 text-white min-h-screen p-4 border-r border-gray-700 flex flex-col transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mb-4 text-gray-300 hover:text-white focus:outline-none"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {isOpen && (
          <div className="bg-gray-800 p-4 text-center mb-6 rounded-md shadow">
            <p className="text-gray-300 text-sm">{`Franchise ID: ${email}`}</p>
          </div>
        )}

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

        <div className="mt-6">
          <Link
            to="/login"
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

export default AdminSidebar;
