import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import api from '../api/axios';
import { CartProduct } from '../context/UserCartContext';

interface UseFetchCartReturn {
  cartItems: CartProduct[];
  loading: boolean;
  cartCount: number;
  total: number;
  addToCart: (product: Omit<CartProduct, 'quantity'>, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateCartItem: (cartItemId: string, quantity: number) => Promise<void>;
  fetchCart: () => Promise<void>;
}

export function useFetchCart(): UseFetchCartReturn {
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const token = localStorage.getItem('accessToken');

  // -------------------------
  // Fetch del carrito
  // -------------------------
  const fetchCart = useCallback(async (): Promise<void> => {
    if (!token) {
      setCartItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get<CartProduct[]>('/cart');
      setCartItems(res.data);
    } catch (err: unknown) {
      if (axios.isCancel(err)) return;
      console.error('Error fetching cart:', err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // -------------------------
  // Agregar al carrito (Optimistic Update)
  // -------------------------
  const addToCart = useCallback(
    async (product: Omit<CartProduct, 'quantity'>, quantity = 1) => {
      setCartItems(prev => {
        const existing = prev.find(item => item.id === product.id);
        if (existing) {
          return prev.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          );
        }
        return [...prev, { ...product, quantity }];
      });

      try {
        await api.post('/cart', { productId: product.id, quantity });
      } catch (err: unknown) {
        console.error('Error adding to cart:', err);
        await fetchCart(); // revertir en caso de error
      }
    },
    [fetchCart]
  );

  // -------------------------
  // Remover del carrito
  // -------------------------
  const removeFromCart = useCallback(
    async (cartItemId: string) => {
      const prevCart = [...cartItems];
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));

      try {
        await api.delete(`/cart/${cartItemId}`);
      } catch (err: unknown) {
        console.error('Error removing from cart:', err);
        setCartItems(prevCart); // revertir en caso de error
      }
    },
    [cartItems]
  );

  // -------------------------
  // Actualizar cantidad de un item
  // -------------------------
  const updateCartItem = useCallback(
    async (cartItemId: string, quantity: number) => {
      const prevCart = [...cartItems];
      setCartItems(prev =>
        prev.map(item => (item.id === cartItemId ? { ...item, quantity } : item))
      );

      try {
        await api.patch(`/cart/${cartItemId}`, { quantity });
      } catch (err: unknown) {
        console.error('Error updating cart item:', err);
        setCartItems(prevCart); // revertir en caso de error
      }
    },
    [cartItems]
  );

  // -------------------------
  // Efecto inicial con AbortController
  // -------------------------
  useEffect(() => {
    const controller = new AbortController();

    const loadCart = async () => {
      try {
        await fetchCart();
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error(err);
      }
    };

    loadCart();

    return () => {
      controller.abort(); // cancelar petición al desmontar
    };
  }, [fetchCart]);

  // -------------------------
  // Estado derivado
  // -------------------------
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return { cartItems, loading, cartCount, total, addToCart, removeFromCart, updateCartItem, fetchCart };
}
