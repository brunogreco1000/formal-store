// src/context/UserCartContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import axios from '../api/axios';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

// Tipos
export interface CartProduct {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

interface UserCartContextType {
  cart: CartProduct[];
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (product: Omit<CartProduct, 'quantity'>, qty?: number) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
}

const UserCartContext = createContext<UserCartContextType | undefined>(undefined);
export const useUserCart = (): UserCartContextType => {
  const context = useContext(UserCartContext);
  if (!context) throw new Error('useUserCart must be used within a UserCartProvider');
  return context;
};

interface UserCartProviderProps {
  children: ReactNode;
}

export const UserCartProvider: React.FC<UserCartProviderProps> = ({ children }) => {
  const { isLoggedIn, accessToken } = useAuth();
  const [cart, setCart] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const fetchedRef = useRef(false);

  const config = {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  };

  const showToastOnce = useCallback((key: string, message: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') toast.success(message, { toastId: key });
    else toast.error(message, { toastId: key });
  }, []);

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) {
      setCart([]);
      setLoading(false);
      return;
    }

    if (fetchedRef.current) return;
    fetchedRef.current = true;

    setLoading(true);
    try {
      const res = await axios.get<CartProduct[]>('/cart', config);
      setCart(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching cart:', err);
      showToastOnce('fetch-error', 'No se pudo cargar el carrito', 'error');
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, accessToken, showToastOnce]);

  useEffect(() => {
    fetchedRef.current = false;
    fetchCart();
  }, [fetchCart, isLoggedIn]);

  const addToCart = async (product: Omit<CartProduct, 'quantity'>, qty = 1) => {
    if (!isLoggedIn) return showToastOnce('login', 'Debes iniciar sesión para agregar al carrito', 'error');

    try {
      const res = await axios.post<CartProduct>('/cart', { productId: product.id, quantity: qty }, config);
      setCart(prev => {
        const exists = prev.find(i => i.id === res.data.id);
        if (exists) return prev.map(i => i.id === res.data.id ? res.data : i);
        return [...prev, res.data];
      });
      showToastOnce(`add-${res.data.id}`, `${res.data.name} agregado al carrito ✅`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      showToastOnce(`add-error-${product.id}`, 'Error agregando al carrito', 'error');
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (!isLoggedIn) return showToastOnce('login', 'Debes iniciar sesión para modificar el carrito', 'error');
    if (quantity < 1) return;

    try {
      const res = await axios.patch<CartProduct>(`/cart/${id}`, { quantity }, config);
      setCart(prev => prev.map(i => i.id === id ? res.data : i));
      showToastOnce(`update-${id}`, 'Cantidad actualizada ✅');
    } catch (err) {
      console.error('Error updating quantity:', err);
      showToastOnce(`update-error-${id}`, 'Error actualizando cantidad', 'error');
    }
  };

  const removeFromCart = async (id: string) => {
    if (!isLoggedIn) return showToastOnce('login', 'Debes iniciar sesión para eliminar productos', 'error');

    try {
      await axios.delete(`/cart/${id}`, config);
      setCart(prev => prev.filter(i => i.id !== id));
      showToastOnce(`remove-${id}`, 'Producto eliminado del carrito ✅');
    } catch (err) {
      console.error('Error removing cart item:', err);
      showToastOnce(`remove-error-${id}`, 'Error eliminando del carrito', 'error');
    }
  };

  return (
    <UserCartContext.Provider value={{ cart, loading, fetchCart, addToCart, updateQuantity, removeFromCart }}>
      {children}
    </UserCartContext.Provider>
  );
};
