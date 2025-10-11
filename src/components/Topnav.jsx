import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/mgtlogo2.png";

const Topnav = () => {
  // Smooth scroll function
  const handleScrollToProducts = (e) => {
    e.preventDefault();
    const section = document.getElementById("products-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="h-10 w-10 md:h-12 md:w-12" />
          
          <span className="text-lg font-semibold text-gray-900 hidden sm:block">
            MTG
          </span>
          </Link>
        </div>

        {/* Center Nav Links */}
        <ul className="hidden md:flex space-x-10 text-gray-700 font-medium">
          <li>
            <Link to="/" className="hover:text-black transition">
              ABOUT
            </Link>
          </li>
          <li>
            <a href="#products-section" onClick={handleScrollToProducts} className="hover:text-black transition cursor-pointer">
              SHOP
            </a>
          </li>
          <li>
            <Link to="#" className="hover:text-black transition">
              CONTACT
            </Link>
          </li>
        </ul>

        {/* Shop Now Button */}
        <div>
          <button
            onClick={handleScrollToProducts}
            className="border border-gray-800 px-4 py-2 rounded text-sm md:text-base hover:bg-gray-100 transition"
          >
            Shop Now
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Topnav;
