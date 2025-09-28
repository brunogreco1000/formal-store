
import CartItem from '../components/CartItem';
import { useUserCart } from '../context/UserCartContext';
import Loader from '../components/Loader';

export default function Cart() {
  const { cart, loading, updateQuantity, removeFromCart } = useUserCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) return <Loader />;
  if (!cart.length) return <p className="text-center mt-8">El carrito está vacío</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col gap-6">
      {cart.map(item => (
        <CartItem
          key={item.id}
          item={item}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
        />
      ))}
      <div className="text-right font-bold text-xl mt-4">
        Total: ${total.toFixed(2)}
      </div>
    </div>
  );
}
