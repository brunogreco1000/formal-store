import React from 'react';
import { CartProduct } from '../context/UserCartContext';

interface Props {
  item: CartProduct;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onToggleSelect: (id: string) => void;
}

const CartItem: React.FC<Props> = ({ item, onRemove, onUpdateQuantity, onToggleSelect }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-800 rounded">
      <input type="checkbox" checked={item.selected} onChange={() => onToggleSelect(item.id)} />
      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded"/>
      <div className="flex-1">
        <h3 className="font-bold">{item.name}</h3>
        <p>${item.price.toFixed(2)}</p>
        <input
          type="number"
          min={1}
          value={item.quantity}
          onChange={e => onUpdateQuantity(item.id, Number(e.target.value))}
          className="w-16 p-1 rounded bg-gray-700 text-white"
        />
      </div>
      <button onClick={() => onRemove(item.id)} className="text-red-500 font-bold px-3 py-1 rounded hover:bg-red-700 transition">Eliminar</button>
    </div>
  );
};

export default CartItem;
