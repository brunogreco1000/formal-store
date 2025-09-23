import { useState, useEffect } from 'react';
import axios from 'axios';

export function useFetchCart(userId) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si estás simulando usuario, podés pasar userId = 1 o null
    axios.get(`http://localhost:5000/cart?userId=${userId || 1}`)
      .then(res => {
        setCartItems(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [userId]);

  return { cartItems, loading };
}
