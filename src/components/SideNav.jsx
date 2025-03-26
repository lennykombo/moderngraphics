import React from "react";
import { Link } from "react-router-dom";
import { FaBox, FaList, FaUsers, FaTicketAlt, FaCreditCard, FaTruck, FaStar, FaCog, FaTimes } from "react-icons/fa";
import Logout from "./Logout";

const SideNav = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <div className={`w-64 bg-white shadow-lg h-screen p-5 flex flex-col justify-between transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:relative z-50`}>
      
      <div>
        {/* Close Button */}
        <button 
          className="md:hidden text-xl p-2 absolute top-4 right-4 rounded-lg focus:outline-none bg-purple-600 text-white hover:bg-purple-700"
          onClick={() => setIsSidebarOpen(false)}
        >
          <FaTimes />
        </button>

        <span className="text-lg font-bold mb-6 block">ModernTech Graphic</span>
        
        {/* Navigation Links */}
        <ul className="space-y-4">
          <NavItem icon={<FaBox />} text="Products" path="/dashboard/products" />
          <NavItem icon={<FaList />} text="Categories" path="/dashboard/categories" />
          <NavItem icon={<FaUsers />} text="Customers" path="/customers" />
          <NavItem icon={<FaTicketAlt />} text="Vouchers" path="/vouchers" />
          <NavItem icon={<FaCreditCard />} text="Payment" path="/payment" />
          <NavItem icon={<FaTruck />} text="Delivery" path="/delivery" />
          <NavItem icon={<FaStar />} text="Reviews" path="/reviews" />
          <NavItem icon={<FaCog />} text="Settings" path="/dashboard/settings" />
        </ul>
      </div>

      <div className="mt-4">
        <Logout />
      </div>
    </div>
  );
};

// Reusable Navigation Item Component
const NavItem = ({ icon, text, path }) => {
  return (
    <li>
      <Link to={path}
        className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
        onClick={() => setIsSidebarOpen(false)}>
        <span className="text-purple-500 text-lg">{icon}</span>
        <span className="text-gray-700 font-medium">{text}</span>
      </Link>
    </li>
  );
};

export default SideNav;
