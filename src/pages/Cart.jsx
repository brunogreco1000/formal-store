import React from 'react';
import { Link } from 'react-router-dom';

export default function Cart({ isLoggedIn }) {
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Your FORMALSTORE Cart is empty</h2>
        <p className="mb-4">Shop today's deals</p>
        <Link to="/login" className="text-blue-400 hover:text-blue-600 transition mb-2">
          Sign in to your account
        </Link>
        <Link to="/register" className="text-blue-400 hover:text-blue-600 transition">
          Sign up now
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 text-center">
      {/* Aquí pondrías la lógica para mostrar el carrito real cuando esté logueado */}
      <p>Your cart items will appear here.</p>
    </div>
  );
}
