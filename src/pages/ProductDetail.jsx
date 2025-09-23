import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return <p className="p-8 text-center">Producto no encontrado</p>;

  return (
    <div className="max-w-6xl mx-auto p-8 flex flex-col md:flex-row gap-8">

      {/* Imagen a la izquierda */}
      <div className="md:w-1/2 flex justify-center">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-auto rounded shadow-lg object-cover" 
        />
      </div>

      {/* Información a la derecha */}
      <div className="md:w-1/2 flex flex-col justify-start">
        <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
        <p className="text-2xl text-blue-300 font-semibold mb-4">${product.price}</p>
        <p className="text-gray-300 mb-6">{product.description || "Descripción profesional del producto no disponible."}</p>

        {/* Otros parámetros opcionales */}
        {product.material && <p className="mb-2"><span className="font-semibold">Material:</span> {product.material}</p>}
        {product.category && <p className="mb-2"><span className="font-semibold">Categoría:</span> {product.category}</p>}
        {product.size && <p className="mb-2"><span className="font-semibold">Tamaño:</span> {product.size}</p>}
        {product.color && <p className="mb-2"><span className="font-semibold">Color:</span> {product.color}</p>}

        {/* Botones al final */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button className="bg-blue-900 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition">
            Agregar al carrito
          </button>
                    <Link
            to="/compra" 
            className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-500 transition text-center"
            >
            Comprar
            </Link>

        </div>

        {/* Link volver a productos al final */}
        <div className="mt-6">
          <Link 
            to="/" 
            className="text-blue-400 hover:text-blue-600 transition"
          >
            ← Volver a Productos
          </Link>
        </div>
      </div>
    </div>
  );
}
