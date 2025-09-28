import React, { useState, FormEvent, ChangeEvent } from 'react';
import api from '../api/axios'; // tu instancia con interceptor
import { AxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const LoginComponent: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/login', { email, password });
      const { _id, token } = response.data;
      login(_id, token);
      toast.success('¡Inicio de sesión exitoso!');
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'Credenciales inválidas o error de red.');
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        required
        className="p-2 rounded bg-gray-700 text-white"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        required
        className="p-2 rounded bg-gray-700 text-white"
      />
      <button
        type="submit"
        className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Iniciar Sesión
      </button>
    </form>
  );
};

export default LoginComponent;
