import { useState, useEffect } from 'react';
import api from '../api/axios';

// 1. Interfaz que usa el frontend (consistente con ProductCard)
export interface Product {
    id: string; // ✅ El ID para el frontend
    name: string;
    price: number;
    image: string;
    // Opcional: Si necesitas más campos (como description, countInStock) agrégalos aquí.
}

// 2. Interfaz de la API (para tipar la respuesta de Axios)
interface ApiProduct {
    _id: string; // ID de Mongo (lo que devuelve la API)
    name: string;
    price: number;
    image: string;
}

interface UseFetchProductsReturn {
    products: Product[];
    loading: boolean;
    error: string | null;
}

export function useFetchProducts(): UseFetchProductsReturn {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                // Obtiene la respuesta de la API tipada como un array de ApiProduct
                const res = await api.get<ApiProduct[]>('/products', {
                    signal: controller.signal,
                });

                // ✅ Mapea la respuesta: Convierte '_id' a 'id'
                const mappedProducts: Product[] = res.data.map((p) => ({
                    id: p._id, // ¡Aquí se hace la conversión clave!
                    name: p.name,
                    price: p.price,
                    image: p.image,
                }));

                setProducts(mappedProducts);
            } catch (err: any) {
                if (err.name === 'CanceledError') return; 
                console.error('Error fetching products:', err);
                setProducts([]);
                setError(err.message || 'Error al cargar productos');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

        // Función de limpieza para cancelar la petición al desmontar el componente
        return () => {
            controller.abort(); 
        };
    }, []); // Se ejecuta solo una vez al montar

    return { products, loading, error };
}