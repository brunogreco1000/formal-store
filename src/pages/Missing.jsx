// src/pages/Missing.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function Missing() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Página no encontrada</p>
      <Link
        to="/"
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded transition"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
