import { useState, useEffect } from 'react';
import axios from 'axios';

export function useFetchCart(userId) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return; // Si no hay usuario, no fetch

    let isMounted = true; // para evitar setState en componente desmontado

    const fetchCart = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/cart?userId=${userId}`);
        if (isMounted) setCartItems(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error al obtener el carrito:', err);
        if (isMounted) setCartItems([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCart();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return { cartItems, loading };
}
