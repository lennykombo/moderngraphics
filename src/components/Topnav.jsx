import React from 'react';
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import logo from "../assets/mgtlogo2.png";

const Topnav = () => {
  return (
    <nav className="w-full flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-purple-500 text-white fixed top-0 left-0 right-0 z-50 h-20 md:h-24">
      {/* Left Section: Logo */}
      <div className="flex items-center space-x-4">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-14 w-14 md:h-20 md:w-20 cursor-pointer" />
        </Link>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6 text-sm md:text-base">
        <li><a href="#" className="hover:text-gray-300">Shop</a></li>
        <li><a href="#" className="hover:text-gray-300">About</a></li>
        <li><a href="#" className="hover:text-gray-300">Contact</a></li>
      </ul>

      {/* Social Icons & Login */}
      <div className="flex items-center space-x-6">
        <FaFacebook className="hover:text-gray-400 cursor-pointer h-6 w-6 md:h-8 md:w-8" />
        <FaTwitter className="hover:text-gray-400 cursor-pointer h-6 w-6 md:h-8 md:w-8" />
        <FaInstagram className="hover:text-gray-400 cursor-pointer h-6 w-6 md:h-6 md:w-8" />
        <span className="ml-2 md:ml-4 text-sm md:text-base cursor-pointer hover:text-gray-300">
            <Link to="/dashboard">Login</Link>
            </span>
      </div>
    </nav>
  );
};

export default Topnav;
