import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import api from '../api/axios';

export interface CartProduct {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selected: boolean;
}

export interface AddToCartPayload {
  productId: string;
  name: string;
  price: number;
  image: string;
}

interface UserCartContextProps {
  cart: CartProduct[];
  loading: boolean;
  addToCart: (item: AddToCartPayload, quantity?: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  toggleSelect: (id: string) => void;
  clearCart: () => void;
}

const UserCartContext = createContext<UserCartContextProps | undefined>(undefined);

export const useUserCart = (): UserCartContextProps => {
  const context = useContext(UserCartContext);
  if (!context) throw new Error('useUserCart must be used within UserCartProvider');
  return context;
};

interface ProviderProps { children: ReactNode; }

export const UserCartProvider: React.FC<ProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/cart');
      const items: CartProduct[] = res.data.items.map((item: any) => ({
        id: item._id,
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        image: item.productId.image,
        quantity: item.quantity,
        selected: true
      }));
      setCart(items);
    } catch {
      setCart([]);
    } finally { setLoading(false); }
  }, []);

  const addToCart = useCallback(async (product: AddToCartPayload, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.productId);
      if (existing) return prev.map(item =>
        item.productId === product.productId ? { ...item, quantity: item.quantity + quantity } : item
      );
      return [...prev, { ...product, id: `temp-${product.productId}`, quantity, selected: true }];
    });

    try {
      await api.post('/cart', { productId: product.productId, quantity });
      await fetchCart();
    } catch {
      await fetchCart();
    }
  }, [fetchCart]);

  const removeFromCart = useCallback(async (id: string) => {
    const prev = [...cart];
    setCart(prevCart => prevCart.filter(item => item.id !== id));
    try { await api.delete(`/cart/${id}`); } catch { setCart(prev); }
  }, [cart]);

  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    const prev = [...cart];
    setCart(prevCart => prevCart.map(item => item.id === id ? { ...item, quantity } : item));
    try { await api.put(`/cart/${id}`, { quantity }); } catch { setCart(prev); }
  }, [cart]);

  const toggleSelect = useCallback((id: string) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, selected: !item.selected } : item));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  return (
    <UserCartContext.Provider value={{ cart, loading, addToCart, removeFromCart, updateQuantity, toggleSelect, clearCart }}>
      {children}
    </UserCartContext.Provider>
  );
};
