import React from 'react';
import { useNavigate } from "react-router-dom";

const Productcard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      // Fixed typo: 'grou' to 'group'
      className="flex flex-col cursor-pointer group hover:shadow-lg hover:p-2 rounded-lg transition-all duration-300"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image Container */}
      <div className="w-full aspect-square overflow-hidden rounded-xl bg-gray-100 relative">
        <img
          src={product.image}
          alt={product.name}
          // ADDED: pointer-events-none (stops direct interaction)
          // ADDED: select-none (prevents highlighting)
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none select-none"
        />

        {/* --- ADDED: THE PROTECTION SHIELD --- */}
        {/* This transparent div sits on top. Since the parent handles the click, 
            this div just blocks right-clicks and dragging. */}
        <div 
          className="absolute inset-0 z-10 bg-transparent"
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />
      </div>

      {/* Details */}
      <div className="mt-3">
        <h3 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-1 group-hover:text-purple-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm mt-1 font-semibold">
          Ksh {product.price?.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default Productcard;







/*import React from 'react';
import { useNavigate } from "react-router-dom";

const Productcard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      // REMOVED: border, p-3, shadow, background color
      // ADDED: 'group' so we can animate the image when hovering the text/card
      className="flex flex-col cursor-pointer grou hover:shadow-lg hover:p-2 rounded-lg"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image Container *//*
      <div className="w-full aspect-square overflow-hidden rounded-xl bg-gray-100 relative">
        <img
          src={product.image}
          alt={product.name}
          // aspect-square: Forces 1x1 ratio
          // group-hover:scale-105: subtle zoom on hover
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Details *//*
      <div className="mt-3">
        <h3 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-1 group-hover:text-purple-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm mt-1 font-semibold">
          Ksh {product.price?.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default Productcard;*/