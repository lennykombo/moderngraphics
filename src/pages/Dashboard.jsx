import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Sidenav from "../components/SideNav";
import { Routes, Route, useLocation } from "react-router-dom";
import Products from "./Products";
import Categories from "./Categories";
import Settings from "./Settings";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation(); // Get the current path

  // Dummy data for charts
  const barChartData = [
    { name: "March 1", reservations: 10 },
    { name: "March 2", reservations: 15 },
    { name: "March 3", reservations: 8 },
    { name: "March 4", reservations: 20 },
  ];

  const pieChartData = [
    { name: "Confirmed", value: 12 },
    { name: "Pending", value: 5 },
    { name: "Canceled", value: 3 },
  ];

  const COLORS = ["#6A0DAD", "#007BFF", "#F44336"];

  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-r from-purple-50 to-blue-50 min-h-screen">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform md:relative md:translate-x-0 z-50`}> 
        <Sidenav isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      {/* Main Content */}
      <div className={`flex-1 p-6 transition-all ${isSidebarOpen ? "md:ml-64" : "md:ml-0"}`}>
        {/* Sidebar Toggle Button */}
        <button
          className="text-2xl p-3 rounded-lg focus:outline-none md:hidden bg-purple-600 text-white hover:bg-purple-700"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Route Content */}
        <Routes>
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/settings" element={<Settings />} />
          {/* Default Dashboard content (only shows when path is exactly /dashboard) */}
          <Route
            path="/"
            element={
              <div>
                <h1 className="text-3xl font-bold mb-6 text-purple-800">Dashboard</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-xl shadow-md text-white">
                    <h2 className="text-lg font-semibold">Total Orders</h2>
                    <p className="text-2xl font-bold">1,234</p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 rounded-xl shadow-md text-white">
                    <h2 className="text-lg font-semibold">Active Users</h2>
                    <p className="text-2xl font-bold">342</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-xl shadow-md text-white">
                    <h2 className="text-lg font-semibold">Revenue</h2>
                    <p className="text-2xl font-bold">$45,678</p>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bar Chart */}
                  <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500 w-full">
                    <h2 className="text-lg font-semibold mb-4 text-purple-700">Order Over Time</h2>
                    <ResponsiveContainer width="100%" height={300} className="w-full">
                      <BarChart data={barChartData} width={500} height={300}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="reservations" fill="#6A0DAD" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Pie Chart */}
                  <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 w-full">
                    <h2 className="text-lg font-semibold mb-4 text-blue-700">Order Status</h2>
                    <ResponsiveContainer width="100%" height={300} className="w-full">
                      <PieChart width={400} height={300}>
                        <Pie data={pieChartData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                          ))}
                        </Pie>
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
