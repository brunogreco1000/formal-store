import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => { e.preventDefault(); setSubmitted(true); };

  if (submitted) return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h2 className="text-3xl font-bold mb-4">¡Gracias por tu mensaje!</h2>
      <p className="mb-6 text-center">Nos pondremos en contacto contigo pronto.</p>
      <Link to="/" className="text-blue-400 hover:text-blue-600 transition">← Volver a Productos</Link>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-lg p-8 bg-gray-800 rounded shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Contacto</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Nombre" required className="p-3 rounded bg-gray-700 text-white" />
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required className="p-3 rounded bg-gray-700 text-white" />
          <input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="Asunto" required className="p-3 rounded bg-gray-700 text-white" />
          <textarea name="message" value={form.message} onChange={handleChange} placeholder="Mensaje" rows="4" required className="p-3 rounded bg-gray-700 text-white" />
          <button type="submit" className="bg-blue-900 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition">Enviar</button>
        </form>
        <div className="mt-6 text-center">
          <Link to="/" className="text-blue-400 hover:text-blue-600 transition">← Volver a Productos</Link>
        </div>
      </div>
    </div>
  );
}
