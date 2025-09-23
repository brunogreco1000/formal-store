import React from 'react'
import { Link } from 'react-router-dom'

const ProductCard = ({ id, title, price, image }) => (
  <div className="bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col items-center hover:shadow-2xl transition">
    <Link to={`/product/${id}`}>
      <img
        src={image}
        alt={title}
        className="h-48 w-auto mb-4 object-contain hover:scale-105 transition-transform duration-300 cursor-pointer"
      />
    </Link>
    <h2 className="text-xl font-semibold">{title}</h2>
    <p className="text-gray-300 mt-1">${price}</p>
    <Link
      to={`/product/${id}`}
      className="mt-4 bg-blue-900 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
    >
      Ver Detalle
    </Link>
  </div>
)

export default ProductCard
