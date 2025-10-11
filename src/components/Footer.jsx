import React from 'react'
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaFacebook, FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";

function Footer() {
  return (
     <div className="bg-[#1a1a1a] text-gray-300 mt-20">
        <div className="max-w-6xl mx-auto py-10 px-6 grid md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-3">Modern Tech Graphics</h2>
            <p className="text-sm">
              Elegant, custom-made designs and products that celebrate life’s
              moments with style.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:underline">About</Link></li>
              <li><Link to="/shop" className="hover:underline">Shop</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Contact</h3>
            <p className="text-sm">📞 0784773601</p>
            <p className="text-sm">✉️ mtg@gmail.com</p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Follow Us</h3>
            <div className="flex gap-5 text-xl">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <FaFacebook className="hover:text-purple-400 transition" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <FaInstagram className="hover:text-purple-400 transition" />
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer">
              <FaXTwitter className="hover:text-purple-400 transition" />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer">
              <FaTiktok className="hover:text-purple-400 transition" />
            </a>
          </div>
          </div>
        </div>

        <div className="border-t border-gray-700 text-center py-4 text-sm">
          © Modern Tech Graphics {new Date().getFullYear()}
        </div>
      </div>
  )
}

export default Footer