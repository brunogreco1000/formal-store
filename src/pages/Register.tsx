import React, { useState } from 'react';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ URL correcta
      await axios.post('/auth/register', { email, password });

      toast.success('¡Registro exitoso!');
      setSuccess(true);
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error al registrarse. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className="p-8 max-w-md mx-auto bg-gray-800 rounded-xl shadow-lg mt-8 text-center">
        <h1 className="text-2xl font-bold mb-4">¡Registro exitoso!</h1>
        <p className="mb-4">Ya puedes iniciar sesión con tu cuenta.</p>
        <Link to="/login" className="text-blue-400 hover:text-blue-600 font-semibold">
          Iniciar sesión
        </Link>
      </section>
    );
  }

  return (
    <section className="p-8 max-w-md mx-auto bg-gray-800 rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Registro</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          aria-label="Email"
          className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          aria-label="Contraseña"
          className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? <Loader small /> : 'Crear Cuenta'}
        </button>
      </form>
      <p className="mt-4 text-center text-gray-400">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-blue-400 hover:text-blue-600">
          Inicia sesión
        </Link>
      </p>
    </section>
  );
};

export default Register;
