import { useState, useEffect } from 'react';
import api from '../api/axios'; // tu instancia con interceptor
import { CartProduct } from '../context/UserCartContext';

interface UseFetchCartReturn {
  cartItems: CartProduct[];
  loading: boolean;
  addToCart: (product: Omit<CartProduct, 'quantity'>, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateCartItem: (cartItemId: string, quantity: number) => Promise<void>;
}

export function useFetchCart(): UseFetchCartReturn {
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const token = localStorage.getItem('accessToken');

  const fetchCart = async (): Promise<void> => {
    if (!token) {
      setCartItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get<CartProduct[]>('/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data);
    } catch (err: unknown) {
      console.error('Error fetching cart:', err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Omit<CartProduct, 'quantity'>, quantity = 1): Promise<void> => {
    if (!token) return;
    try {
      await api.post('/cart', { productId: product.id, quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCart();
    } catch (err: unknown) {
      console.error('Error adding to cart:', err);
    }
  };

  const removeFromCart = async (cartItemId: string): Promise<void> => {
    if (!token) return;
    try {
      await api.delete(`/cart/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCart();
    } catch (err: unknown) {
      console.error('Error removing from cart:', err);
    }
  };

  const updateCartItem = async (cartItemId: string, quantity: number): Promise<void> => {
    if (!token) return;
    try {
      await api.patch(`/cart/${cartItemId}`, { quantity }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCart();
    } catch (err: unknown) {
      console.error('Error updating cart item:', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  return { cartItems, loading, addToCart, removeFromCart, updateCartItem };
}
