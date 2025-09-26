import React from 'react';
import { Link } from 'react-router-dom';
import { useUserCart } from '../context/UserCartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProductCard = ({ id, title, price, image }) => {
  const { cart, addToCart, removeFromCart } = useUserCart();
  const { isLoggedIn } = useAuth();
  const inCart = cart.find(item => item.productId === id);

  const handleClick = () => {
    if (!isLoggedIn) {
      toast.error('Debes iniciar sesión para agregar productos al carrito.');
      return;
    }
    inCart ? removeFromCart(id) : addToCart({ id, name: title, price, image });
  };

  return (
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
      <button
        className={`mt-4 px-6 py-2 rounded-full transition ${
          inCart ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-900 hover:bg-blue-700'
        } text-white`}
        onClick={handleClick}
      >
        {inCart ? 'Quitar del carrito' : 'Agregar al carrito'}
      </button>
      <Link
        to={`/product/${id}`}
        className="mt-2 text-blue-400 hover:text-blue-600 transition text-center"
      >
        Ver Detalle
      </Link>
    </div>
  );
};

export default ProductCard;
