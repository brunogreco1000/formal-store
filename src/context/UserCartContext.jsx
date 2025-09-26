// src/context/UserCartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

export const UserCartContext = createContext();
export const useUserCart = () => useContext(UserCartContext);

export const UserCartProvider = ({ children }) => {
  const { isLoggedIn, userId } = useAuth();
  const [cart, setCart] = useState([]);

  // Cargar carrito desde backend al iniciar sesión
  const fetchCart = async () => {
    if (!isLoggedIn) {
      setCart([]);
      return;
    }

    try {
      const resCart = await axios.get(`/cart?userId=${userId}`);
      const resProducts = await axios.get('/products');

      const fullCart = resCart.data.map(item => {
        const product = resProducts.data.find(p => Number(p.id) === Number(item.productId));
        return {
          ...item,
          name: product?.name || 'Producto',
          price: product?.price || 0,
          image: product?.image || '',
          quantity: item.quantity || 1
        };
      });

      setCart(fullCart);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setCart([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isLoggedIn, userId]);

  // Agregar producto al carrito
  const addToCart = async (product, qty = 1) => {
    if (!isLoggedIn) {
      toast.error('Debes iniciar sesión para agregar productos al carrito.');
      return;
    }

    const exist = cart.find(item => item.productId === product.id);

    if (exist) {
      // Si ya existe, solo actualizar cantidad
      updateQuantity(product.id, exist.quantity + qty);
    } else {
      // Agregar producto a UI inmediatamente
      setCart(prev => [
        ...prev,
        { productId: product.id, name: product.name, price: product.price, image: product.image, quantity: qty }
      ]);

      try {
        const res = await axios.post('/cart', { userId, productId: product.id, quantity: qty });
        // Guardar id que devuelve backend
        setCart(prev =>
          prev.map(item =>
            item.productId === product.id ? { ...item, id: res.data.id } : item
          )
        );
        toast.success(`${product.name} agregado al carrito ✅`);
      } catch (err) {
        console.error('Error saving new cart item:', err);
      }
    }
  };

  // Eliminar producto del carrito
  const removeFromCart = async (productId) => {
    const item = cart.find(i => i.productId === productId);
    if (!item) return;

    setCart(prev => prev.filter(i => i.productId !== productId));

    if (item.id) {
      try {
        await axios.delete(`/cart/${item.id}`);
      } catch (err) {
        console.error('Error removing from backend cart:', err);
      }
    }
  };

  // Actualizar cantidad
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    const item = cart.find(i => i.productId === productId);
    if (!item) return;

    // Actualización inmediata en UI
    setCart(prev =>
      prev.map(i => (i.productId === productId ? { ...i, quantity } : i))
    );

    try {
      if (item.id) {
        await axios.patch(`/cart/${item.id}`, { quantity });
      } else {
        // Si no tiene id, crear registro en backend
        const res = await axios.post('/cart', { userId, productId, quantity });
        setCart(prev =>
          prev.map(i =>
            i.productId === productId ? { ...i, id: res.data.id } : i
          )
        );
      }
    } catch (err) {
      console.error('Error updating backend cart quantity:', err);
    }
  };

  return (
    <UserCartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </UserCartContext.Provider>
  );
};
