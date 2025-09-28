import React from 'react';
import { useFetchProducts, Product } from '../hooks/useFetchProducts';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const Home: React.FC = () => {
  const { products, loading } = useFetchProducts(); // ❌ Sin <Product[]>

  if (loading) return <Loader />;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-4">
      {products.map((product: Product) => (
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
};

export default Home;
