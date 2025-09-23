import React, { createContext, useState, useContext } from 'react';

// Crear contexto
export const UserCartContext = createContext();

// Hook personalizado para usar el contexto
export const useUserCart = () => useContext(UserCartContext);

// Provider que envuelve la app
export const UserCartProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null si no hay usuario logueado
  const [cart, setCart] = useState([]);   // array de productos en el carrito

  const login = (userData) => setUser(userData);
  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter(p => p.id !== productId));
  };

  return (
    <UserCartContext.Provider value={{
      user,
      cart,
      login,
      logout,
      addToCart,
      removeFromCart
    }}>
      {children}
    </UserCartContext.Provider>
  );
};
