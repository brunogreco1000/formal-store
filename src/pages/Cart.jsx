import React from 'react';
import { useUserCart } from '../context/UserCartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useUserCart();
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Carrito vacío</h2>
        <p className="mb-4">Inicia sesión para ver tus productos</p>
        <Link to="/login" className="text-blue-400 hover:text-blue-600 mb-2">
          Iniciar sesión
        </Link>
        <Link to="/register" className="text-blue-400 hover:text-blue-600">
          Registrarse
        </Link>
      </div>
    );

  if (cart.length === 0) return <p className="text-center p-8">Tu carrito está vacío.</p>;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemove = (id, name) => {
    removeFromCart(id);
    toast.info(`${name} eliminado del carrito ✅`);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Tu Carrito</h2>
      <div className="flex flex-col gap-6">
        {cart.map(item => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row justify-between items-center bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <div className="flex items-center gap-4 w-full sm:w-2/3">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
              <div>
                <h3 className="font-bold text-lg">{item.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity === 1}
                    aria-label="Disminuir cantidad"
                    className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    aria-label="Aumentar cantidad"
                    className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
                  >
                    +
                  </button>
                </div>
                <p className="text-gray-300 mt-1">
                  Precio: ${item.price.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 mt-4 sm:mt-0 sm:w-1/3">
              <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
              <button
                onClick={() => handleRemove(item.productId, item.name)}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end text-xl font-bold">
        Total: ${total.toFixed(2)}
      </div>
    </div>
  );
}
