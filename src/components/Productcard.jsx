import React from 'react';
import { useNavigate } from "react-router-dom";

const Productcard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      // REMOVED: border, p-3, shadow, background color
      // ADDED: 'group' so we can animate the image when hovering the text/card
      className="flex flex-col cursor-pointer grou hover:shadow-lg hover:p-2"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image Container */}
      <div className="w-full aspect-square overflow-hidden rounded-xl bg-gray-100 relative">
        <img
          src={product.image}
          alt={product.name}
          // aspect-square: Forces 1x1 ratio
          // group-hover:scale-105: subtle zoom on hover
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
      //className="bg-white shadow-md rounded-lg p-3 sm:p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition-all h-[260px] sm:h-[300px] lg:h-[340px] xl:h-[380px]"
      className="bg-white border border-purple-200 p-3 sm:p-4 flex flex-col cursor-pointer hover:shadow-lg transition-all"
      onClick={() => navigate(`/product/${product.id}`)}
    >
    
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-32 sm:h-40 lg:h-48 xl:h-56 object-cover rounded-md mb-2"
      />

    
      <h3 className="font-semibold text-sm sm:text-base lg:text-base xl:text-lg text-gray-800 text-left line-clamp-1">
        {product.name}
      </h3>

      
      <p className="text-gray-600 text-xs sm:text-sm lg:text-sm mt-1 text-left">
        Ksh {product.price?.toLocaleString()}
      </p>

      
      {/*<button className="mt-auto bg-purple-500 w-full text-white text-xs sm:text-sm lg:text-base px-3 py-1.5 lg:py-2 rounded-md hover:bg-purple-600 transition-all">
        View Product
      </button>*//*
    </div>
  );
};

export default Productcard;*/
