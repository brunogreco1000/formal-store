import { useState, useEffect } from 'react';
import api from '../api/axios'; // tu instancia
import { AxiosResponse } from 'axios';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface RawProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface UseFetchProductsReturn {
  products: Product[];
  loading: boolean;
}

export function useFetchProducts(): UseFetchProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async (): Promise<void> => {
      try {
        const res: AxiosResponse<RawProduct[]> = await api.get('/products');
        if (!isMounted) return;

        const mappedProducts: Product[] = res.data.map(p => ({
          id: p._id,
          name: p.name,
          price: p.price,
          image: p.image,
        }));
        setProducts(mappedProducts);
      } catch (err: unknown) {
        console.error('Error fetching products:', err);
        if (isMounted) setProducts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, loading };
}
