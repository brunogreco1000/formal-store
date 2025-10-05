import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import axios from 'axios';

const validateEmail = (email: string): boolean => /\S+@\S+\.\S+/.test(email);
const validatePassword = (password: string): boolean => password.length >= 6;

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error('Por favor ingresa un email válido.');
      return;
    }
    if (!validatePassword(password)) {
      toast.error('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', { email, password });
      toast.success('¡Registro exitoso! Serás redirigido al login.');
      setEmail('');
      setPassword('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Error al registrarse. Intenta nuevamente.');
      } else {
        toast.error('Error inesperado. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-8 max-w-md mx-auto bg-gray-800 rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Crear una cuenta</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          aria-label="Email"
          autoComplete="email"
          className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Contraseña (mínimo 6 caracteres)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          aria-label="Contraseña"
          autoComplete="new-password"
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
