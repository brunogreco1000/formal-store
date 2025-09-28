// src/components/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useUserCart } from '../context/UserCartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, title, price, image }) => {
  const { cart, addToCart, removeFromCart } = useUserCart();
  const { isLoggedIn } = useAuth();

  // Buscar si el producto ya está en el carrito
  const inCart = cart.find(item => item.id === id);

  const handleClick = () => {
    if (!isLoggedIn) {
      toast.error('Debes iniciar sesión para agregar productos al carrito.');
      return;
    }

    if (inCart) {
      removeFromCart(inCart.id); // El toast se dispara desde el provider
    } else {
      // ⚡ Corrección: quantity no va dentro del objeto, se pasa como segundo argumento
      addToCart({ id, name: title, price, image }, 1);
    }
  };

  // Formatear precio a moneda local
  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(price);

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col items-center hover:shadow-2xl transition transform hover:-translate-y-1">
      <Link to={`/product/${id}`} className="w-full flex justify-center">
        <img
          src={image}
          alt={title}
          className="h-48 w-auto mb-4 object-contain hover:scale-105 transition-transform duration-300 cursor-pointer"
        />
      </Link>

      <h2 className="text-xl font-semibold text-center">{title}</h2>
      <p className="text-gray-300 mt-1">{formattedPrice}</p>

      <button
        onClick={handleClick}
        aria-pressed={!!inCart}
        className={`mt-3 px-4 py-2 rounded ${
          inCart ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
        } text-white transition`}
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
