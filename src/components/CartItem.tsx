// src/components/CartItem.tsx
import React, { useState } from 'react';
import { CartProduct } from '../context/UserCartContext'; // o CartContext según uses

interface CartItemProps {
  item: CartProduct;
  onRemove: (id: string) => Promise<void>;
  onUpdateQuantity: (id: string, quantity: number) => Promise<void>;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove, onUpdateQuantity }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleDecrease = async () => {
    if (item.quantity > 1 && !loading) {
      setLoading(true);
      await onUpdateQuantity(item.id, item.quantity - 1);
      setLoading(false);
    }
  };

  const handleIncrease = async () => {
    if (!loading) {
      setLoading(true);
      await onUpdateQuantity(item.id, item.quantity + 1);
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!loading) {
      setLoading(true);
      await onRemove(item.id);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition">
      <div className="flex items-center gap-4 w-full sm:w-2/3">
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            className="w-24 h-24 object-cover rounded"
          />
        )}
        <div>
          <h3 className="font-bold text-lg">{item.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={handleDecrease}
              disabled={loading}
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition"
            >
              -
            </button>
            <span className="px-2">{item.quantity}</span>
            <button
              onClick={handleIncrease}
              disabled={loading}
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition"
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
        <p className="font-bold text-lg">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <button
          onClick={handleRemove}
          disabled={loading}
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded transition"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default CartItem;
