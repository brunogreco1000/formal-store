// src/hooks/useFetchCart.ts
import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { CartProduct } from '../context/UserCartContext'; // tu tipo

export function useFetchCart() { 
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('accessToken');

  const fetchCart = async () => {
    if (!token) return setCartItems([]);
    setLoading(true);
    try {
      const res = await axios.get<CartProduct[]>('/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Omit<CartProduct, 'quantity'>, quantity = 1) => {
    if (!token) return;
    try {
      await axios.post(
        '/cart',
        { productId: product.id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    if (!token) return;
    try {
      await axios.delete(`/cart/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCart();
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

  const updateCartItem = async (cartItemId: string, quantity: number) => {
    if (!token) return;
    try {
      await axios.patch(
        `/cart/${cartItemId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
    } catch (err) {
      console.error('Error updating cart item:', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  return { cartItems, loading, addToCart, removeFromCart, updateCartItem };
}
