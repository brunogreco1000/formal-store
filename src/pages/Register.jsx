import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

const Register = () => {
  const userRef = useRef();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/users', { email, password });
      setSuccess(true);
      toast.success('¡Registro exitoso!');
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error(err);
      toast.error('Error al registrarse. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className="p-8 max-w-md mx-auto bg-gray-800 rounded-xl shadow-lg mt-8 text-center">
        <h1 className="text-2xl font-bold mb-4">¡Registro exitoso!</h1>
        <p>
          <Link to="/login" className="text-blue-400 hover:text-blue-600">Iniciar sesión</Link>
        </p>
      </section>
    );
  }

  return (
    <section className="p-8 max-w-md mx-auto bg-gray-800 rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-4">Registro</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          ref={userRef}
          autoFocus
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          aria-label="Email"
          className="p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          aria-label="Contraseña"
          className="p-2 rounded bg-gray-700 text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? <Loader small /> : 'Crear Cuenta'}
        </button>
      </form>
    </section>
  );
};

export default Register;
