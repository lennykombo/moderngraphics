import React from 'react';
import { useNavigate } from "react-router-dom";

const Productcard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white border border-purple-200 p-3 sm:p-4 flex flex-col cursor-pointer hover:shadow-lg transition-all h-full"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image */}
      <img
        src={product.image}
        alt={product.name}
        // CHANGED: Removed fixed heights (h-32, etc) and added 'aspect-square'
        className="w-full aspect-square object-cover rounded-md mb-2"
      />

      {/* Name */}
      <h3 className="font-semibold text-sm sm:text-base lg:text-base xl:text-lg text-gray-800 text-left line-clamp-1">
        {product.name}
      </h3>

      {/* Price */}
      <p className="text-gray-600 text-xs sm:text-sm lg:text-sm mt-1 text-left">
        Ksh {product.price?.toLocaleString()}
      </p>
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
