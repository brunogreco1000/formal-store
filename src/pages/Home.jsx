import React from 'react';
import { useFetchProducts } from '../hooks/useFetchProducts';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const { products, loading } = useFetchProducts();

  if (loading) return <p className="p-8 text-center">Cargando...</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-4">
      {products.map(product => (
        <ProductCard
          key={product.id}
          id={product.id}
          title={product.name}
          price={product.price}
          image={product.image}
        />
      ))}
    </div>
  );
}
