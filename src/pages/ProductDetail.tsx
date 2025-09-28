// src/pages/ProductDetail.tsx
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from '../api/axios';
import { useUserCart, CartProduct } from '../context/UserCartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [adding, setAdding] = useState<boolean>(false);

  const { addToCart, cart, updateQuantity } = useUserCart();
  const { isLoggedIn } = useAuth();

  // Fetch del producto
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get<Product>(`/products/${id}`);
        setProduct(res.data);

        const inCartItem = cart.find(item => item.id === res.data.id);
        setQuantity(inCartItem ? inCartItem.quantity : 1);
      } catch (err) {
        console.error('Error al obtener el producto:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, cart]);

  // Actualizar título de la página
  useEffect(() => {
    if (product) document.title = `${product.name} | FORMALSTORE`;
  }, [product]);

  // Manejo de agregar al carrito
  const handleAddToCart = async () => {
    if (!product) return;
    if (!isLoggedIn) {
      toast.error('Debes iniciar sesión para agregar productos al carrito.');
      return;
    }
    if (adding) return;

    setAdding(true);
    try {
      const inCartItem = cart.find(item => item.id === product.id);
      if (inCartItem) {
        updateQuantity(product.id, quantity);
      } else {
        addToCart({ ...product }, quantity);
      }
      toast.success(`${product.name} agregado al carrito ✅`);
    } catch (err) {
      console.error('Error al agregar al carrito:', err);
      toast.error('No se pudo agregar el producto. Intenta nuevamente.');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <Loader />;

  if (!product)
    return <p className="p-8 text-center text-red-400">Producto no encontrado</p>;

  return (
    <div className="max-w-6xl mx-auto p-8 flex flex-col md:flex-row gap-8">
      <div className="md:w-1/2 flex justify-center">
        <img
          src={product.image || '/images/fallback.jpg'}
          alt={product.name}
          onError={(e) => (e.currentTarget.src = '/images/fallback.jpg')}
          className="w-full h-auto rounded shadow-lg object-cover"
        />
      </div>

      <div className="md:w-1/2 flex flex-col justify-start">
        <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
        <p className="text-2xl text-blue-300 font-semibold mb-4">${product.price}</p>
        <p className="text-gray-300 mb-6">{product.description || 'Descripción no disponible.'}</p>

        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            disabled={quantity === 1 || adding}
            aria-label="Disminuir cantidad"
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 transition"
          >
            -
          </button>
          <span className="text-xl">{quantity}</span>
          <button
            onClick={() => setQuantity(q => q + 1)}
            disabled={adding}
            aria-label="Aumentar cantidad"
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={adding}
          aria-label={`Agregar ${product.name} al carrito`}
          className="bg-blue-900 text-white px-8 py-3 rounded-full hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {adding ? 'Agregando...' : 'Agregar al carrito'}
        </button>

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
