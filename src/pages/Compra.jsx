import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaPaypal } from 'react-icons/fa';

export default function Compra() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('paypal');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePaymentSelect = (method) => {
    setPaymentMethod(method);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulario enviado:', { ...form, paymentMethod });
    alert('Compra enviada con éxito');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h2 className="text-3xl font-bold mb-4">¡Gracias por tu compra!</h2>
        <p className="mb-6 text-center">Recibimos tu solicitud y nos pondremos en contacto pronto.</p>
        <Link to="/" className="text-blue-400 hover:text-blue-600 transition">← Volver a Productos</Link>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-xl p-8 bg-gray-800 rounded shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Formulario de Compra</h2>

        {/* Selección de método de pago */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            type="button"
            className={`p-3 rounded-full ${paymentMethod === 'paypal' ? 'bg-blue-600' : 'bg-gray-700'} transition`}
            onClick={() => handlePaymentSelect('paypal')}
          >
            <FaPaypal size={36} color="white" />
          </button>
          <button
            type="button"
            className={`p-3 rounded-full ${paymentMethod === 'visa' ? 'bg-blue-600' : 'bg-gray-700'} transition`}
            onClick={() => handlePaymentSelect('visa')}
          >
            <FaCcVisa size={36} color="white" />
          </button>
          <button
            type="button"
            className={`p-3 rounded-full ${paymentMethod === 'mastercard' ? 'bg-blue-600' : 'bg-gray-700'} transition`}
            onClick={() => handlePaymentSelect('mastercard')}
          >
            <FaCcMastercard size={36} color="white" />
          </button>
          <button
            type="button"
            className={`p-3 rounded-full ${paymentMethod === 'amex' ? 'bg-blue-600' : 'bg-gray-700'} transition`}
            onClick={() => handlePaymentSelect('amex')}
          >
            <FaCcAmex size={36} color="white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-4">

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre completo"
            required
            className="p-3 rounded bg-gray-700 text-white"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
            required
            className="p-3 rounded bg-gray-700 text-white"
          />
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Teléfono"
            className="p-3 rounded bg-gray-700 text-white"
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Detalles adicionales del pedido"
            rows="4"
            className="p-3 rounded bg-gray-700 text-white"
          />

          {/* Campos de tarjeta si el método no es PayPal */}
          {paymentMethod !== 'paypal' && (
            <>
              <input
                type="text"
                name="cardNumber"
                value={form.cardNumber}
                onChange={handleChange}
                placeholder="Número de tarjeta"
                required
                pattern="\d{13,16}"
                title="Ingrese un número de tarjeta válido"
                className="p-3 rounded bg-gray-700 text-white"
              />
              <input
                type="text"
                name="cardName"
                value={form.cardName}
                onChange={handleChange}
                placeholder="Nombre en tarjeta"
                required
                className="p-3 rounded bg-gray-700 text-white"
              />
              <input
                type="text"
                name="expiry"
                value={form.expiry}
                onChange={handleChange}
                placeholder="MM/AA"
                required
                pattern="(0[1-9]|1[0-2])\/\d{2}"
                title="Formato MM/AA"
                className="p-3 rounded bg-gray-700 text-white"
              />
              <input
                type="text"
                name="cvv"
                value={form.cvv}
                onChange={handleChange}
                placeholder="CVV"
                required
                pattern="\d{3,4}"
                title="CVV de 3 o 4 dígitos"
                className="p-3 rounded bg-gray-700 text-white"
              />
            </>
          )}

          <button
            type="submit"
            className="bg-blue-900 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition mt-2"
          >
            Enviar Compra
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-blue-400 hover:text-blue-600 transition">← Volver a Productos</Link>
        </div>
      </div>
    </div>
  );
}
