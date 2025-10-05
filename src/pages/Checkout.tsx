import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserCart } from '../context/UserCartContext';
import CartItem from '../components/CartItem';
import Loader from '../components/Loader';

const Checkout: React.FC = () => {
  const { cart, loading, updateQuantity, removeFromCart, toggleSelect } = useUserCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleProceedToCompra = () => {
    if (!cart.length) return;
    const selectedItems = cart.filter(item => item.selected);
    navigate('/compra', { state: { selectedItems } });
  };

  if (loading) return <Loader />;

  if (!cart.length)
    return (
      <p className="text-center mt-8 text-red-400">
        Tu carrito está vacío. <Link to="/">Volver a productos</Link>
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto p-8 flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-center mb-4">Resumen de tu carrito</h1>

      <div className="flex flex-col gap-4">
        {cart.map(item => (
          <CartItem
            key={item.id}
            item={item}
            onRemove={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onToggleSelect={toggleSelect}
          />
        ))}
      </div>

      <div className="text-right font-bold text-xl mt-4">
        Total: ${total.toFixed(2)}
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleProceedToCompra}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full transition"
        >
          Proceder al pago
        </button>
      </div>
    </div>
  );
};

export default Checkout;
