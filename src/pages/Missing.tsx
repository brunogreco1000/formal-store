import React from 'react';
import { Link } from 'react-router-dom';

const Missing: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Página no encontrada</p>
      <Link
        to="/"
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
};

export default Missing;
