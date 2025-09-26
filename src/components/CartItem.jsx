import React from 'react';

export default function CartItem({ item, onRemove, onUpdateQuantity }) {
  const handleDecrease = () => {
    if (item.quantity > 1) onUpdateQuantity(item.productId, item.quantity - 1);
  };
  const handleIncrease = () => onUpdateQuantity(item.productId, item.quantity + 1);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition">
      <div className="flex items-center gap-4 w-full sm:w-2/3">
        <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
        <div>
          <h3 className="font-bold text-lg">{item.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <button onClick={handleDecrease} aria-label="Disminuir cantidad" className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">-</button>
            <span>{item.quantity}</span>
            <button onClick={handleIncrease} aria-label="Aumentar cantidad" className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">+</button>
          </div>
          <p className="text-gray-300 mt-1">Precio: ${item.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 mt-4 sm:mt-0 sm:w-1/3">
        <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
        <button onClick={() => onRemove(item.productId)} aria-label="Eliminar del carrito" className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded transition">
          Eliminar
        </button>
      </div>
    </div>
  );
}
