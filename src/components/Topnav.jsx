import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/mgtlogo2.png";

const Topnav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleScrollToProducts = (e) => {
    e.preventDefault();
    setIsOpen(false);
    const section = document.getElementById("products-section");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-zinc-100 uppercase tracking-tighter">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        
        {/* LOGO SECTION */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-10 md:h-12 w-auto" />
          <span className="text-black font-black text-sm md:text-xl tracking-tighter italic">
            {/* On mobile we show MTG, on desktop we show the full name */}
            <span className="block md:hidden">MTG<span className="text-red-600">_</span></span>
            <span className="hidden md:block">MODERNTECHGRAPHICS<span className="text-red-600">_</span></span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-10">
          {['About', 'Shop', 'Contact'].map((item) => (
            <a 
              key={item}
              href={item === 'Shop' ? "#products-section" : "#"}
              onClick={item === 'Shop' ? handleScrollToProducts : undefined}
              className="text-[10px] font-bold text-zinc-500 hover:text-black transition-all duration-300 relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-black transition-all group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleScrollToProducts}
            className="bg-purple-600 text-white px-4 py-2 text-[10px] font-black hover:bg-black transition-colors"
          >
            SHOP NOW
          </button>

          {/* MOBILE TOGGLE - CHANGED TO BLACK SO IT IS VISIBLE */}
          <button 
            className="md:hidden flex flex-col gap-1.5 z-[60] p-2" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            <span className={`h-0.5 w-6 transition-all duration-300 ${isOpen ? 'bg-white rotate-45 translate-y-2' : 'bg-black'}`}></span>
            <span className={`h-0.5 w-6 transition-all duration-300 ${isOpen ? 'opacity-0' : 'bg-black'}`}></span>
            <span className={`h-0.5 w-6 transition-all duration-300 ${isOpen ? 'bg-white -rotate-45 -translate-y-2' : 'bg-black'}`}></span>
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div className={`fixed inset-0 bg-black transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} z-50 flex flex-col items-center justify-center gap-8`}>
         <Link to="/" className="text-3xl font-black text-white hover:text-purple-500 transition" onClick={() => setIsOpen(false)}>ABOUT</Link>
         <a href="#products-section" className="text-3xl font-black text-white hover:text-purple-500 transition" onClick={handleScrollToProducts}>SHOP</a>
         <Link to="/contact" className="text-3xl font-black text-white hover:text-purple-500 transition" onClick={() => setIsOpen(false)}>CONTACT</Link>
         
         <div className="absolute bottom-10 text-zinc-600 text-[10px] tracking-widest">
            MODERN TECH GRAPHICS © 2024
         </div>
      </div>
    </nav>
  );
};

export default Topnav;











/*import React from "react";
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
        
        {/* Logo *//*
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="h-10 w-10 md:h-12 md:w-12" />
          
          <span className="text-lg font-semibold text-gray-900 hidden sm:block">
            MTG
          </span>
          </Link>
        </div>

        {/* Center Nav Links *//*
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

        {/* Shop Now Button *//*
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

export default Topnav;*/
