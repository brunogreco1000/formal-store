// src/pages/Cart.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserCart } from '../context/UserCartContext';
import CartItem from '../components/CartItem';
import Loader from '../components/Loader';

const Cart: React.FC = () => {
  const { cart, loading, updateQuantity, removeFromCart, toggleSelect } = useUserCart();
  const navigate = useNavigate();

  if (loading) return <Loader />;
  if (!cart.length) return <p className="text-center mt-8">El carrito está vacío</p>;

  const selectedItems = cart.filter(item => item.selected);
  const total = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col gap-6">
      {cart.map(item => (
        <CartItem
          key={item.id}
          item={item}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onToggleSelect={toggleSelect}
        />
      ))}

      <div className="text-right font-bold text-xl mt-4">
        Total seleccionados: ${total.toFixed(2)}
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={() => navigate('/compra', { state: { selectedItems } })}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full transition"
        >
          Proceder al pago
        </button>
      </div>
    </div>
  );
};

export default Cart;
