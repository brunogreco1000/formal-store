// src/hooks/useFetchProducts.ts
import { useState, useEffect } from 'react';
import axios from '../api/axios';
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

export function useFetchProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const res: AxiosResponse<RawProduct[]> = await axios.get('/products');

        if (isMounted) {
          const mappedProducts: Product[] = res.data.map(p => ({
            id: p._id,
            name: p.name,
            price: p.price,
            image: p.image,
          }));
          setProducts(mappedProducts);
        }
      } catch (err) {
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
