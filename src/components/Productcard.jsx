import React from 'react'
import { useNavigate } from "react-router-dom";

const Productcard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div 
    className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition-all"
    onClick={() => navigate(`/product/${product.id}`)}
  >
    <img 
      src={product.image} 
      alt={product.name} 
      className="w-full h-60 object-contain rounded-md mb-3"
    />
    <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
    <p className="text-gray-600 text-sm">Ksh {product.price.toLocaleString()}</p>
    <button className="mt-3 bg-purple-500 w-full text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-all">
      View Product
    </button>
  </div>
  )
}

export default Productcard