import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaPaypal } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useUserCart } from '../context/UserCartContext';
import api from '../api/axios';

type PaymentMethod = 'paypal' | 'visa' | 'mastercard' | 'amex';

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
}

interface LocationState {
  selectedItems: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
}

const Compra: React.FC = () => {
  const location = useLocation();
  const { selectedItems } = (location.state as LocationState) || { selectedItems: [] };
  const { user } = useAuth();
  const userId = user?.id;
  const { clearCart } = useUserCart();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    message: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paypal');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const total = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId) return toast.error('Debes iniciar sesión para comprar');
    if (!selectedItems.length) return toast.error('No hay productos seleccionados.');
    if (!form.name || !form.email || (paymentMethod !== 'paypal' &&
        (!form.cardNumber || !form.cardName || !form.expiry || !form.cvv))) {
      return toast.error('Completa todos los campos requeridos.');
    }

    setLoading(true);
    try {
      await api.post('/order', {
        userId,
        items: selectedItems,
        total,
        shippingInfo: form,
        paymentMethod
      });
      setSubmitted(true);
      toast.success('Compra realizada con éxito ✅');
      clearCart();
      setTimeout(() => navigate('/'), 3000);
    } catch {
      toast.error('Ocurrió un error, intenta nuevamente.');
    } finally { setLoading(false); }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-900 text-white">
        <h2 className="text-3xl font-bold mb-4">¡Gracias por tu compra!</h2>
        <p className="mb-6 text-center">Recibimos tu orden y te contactaremos pronto.</p>
        <Link to="/" className="text-blue-400 hover:text-blue-600 transition">← Volver a Productos</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-center">Formulario de Compra</h2>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
        
        {/* 🛒 Resumen de items */}
        <div className="md:w-1/2 flex flex-col gap-4">
          {selectedItems.map(item => (
            <div key={item.id} className="flex gap-4 p-4 bg-gray-800 rounded">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-bold">{item.name}</h3>
                <p>${item.price.toFixed(2)} x {item.quantity}</p>
              </div>
              <div className="font-bold">${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>

        {/* 📝 Formulario + pago */}
        <form onSubmit={handleSubmit} className="md:w-1/2 flex flex-col gap-4 bg-gray-800 p-6 rounded">
          <div className="flex flex-col gap-2">
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Nombre completo" required className="p-3 rounded bg-gray-700 text-white" />
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Correo electrónico" required className="p-3 rounded bg-gray-700 text-white" />
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Teléfono" className="p-3 rounded bg-gray-700 text-white" />
            <textarea name="message" value={form.message} onChange={handleChange} placeholder="Detalles adicionales" rows={3} className="p-3 rounded bg-gray-700 text-white" />
          </div>

          <div className="flex justify-center gap-4 my-4">
            {[{ method: 'paypal', icon: <FaPaypal size={36} /> },
              { method: 'visa', icon: <FaCcVisa size={36} /> },
              { method: 'mastercard', icon: <FaCcMastercard size={36} /> },
              { method: 'amex', icon: <FaCcAmex size={36} /> }].map(p => (
              <button
                key={p.method}
                type="button"
                className={`p-3 rounded-full ${paymentMethod === p.method ? 'bg-blue-600' : 'bg-gray-700'} transition`}
                onClick={() => setPaymentMethod(p.method as PaymentMethod)}
              >
                {p.icon}
              </button>
            ))}
          </div>

          {paymentMethod !== 'paypal' && (
            <div className="flex flex-col gap-2">
              <input type="text" name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="Número de tarjeta" required className="p-3 rounded bg-gray-700 text-white" />
              <input type="text" name="cardName" value={form.cardName} onChange={handleChange} placeholder="Nombre en tarjeta" required className="p-3 rounded bg-gray-700 text-white" />
              <input type="text" name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM/AA" required className="p-3 rounded bg-gray-700 text-white" />
              <input type="text" name="cvv" value={form.cvv} onChange={handleChange} placeholder="CVV" required className="p-3 rounded bg-gray-700 text-white" />
            </div>
          )}

          {/* Total y botón final */}
          <div className="mt-4 text-center font-bold text-xl">
            Total a pagar: ${total.toFixed(2)}
          </div>
          <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full mt-2 w-full transition">
            {loading ? 'Procesando...' : 'Finalizar Compra'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Compra;
