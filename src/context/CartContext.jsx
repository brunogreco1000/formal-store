// src/context/CartContext.jsx
import React, { createContext, useReducer, useContext } from 'react';

const CartContext = createContext();

const initialState = {
  items: [], // array de productos en el carrito
  total: 0,  // suma total
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      let updatedItems = [...state.items];

      if (existingIndex >= 0) {
        // Si ya está, aumentamos la cantidad
        updatedItems[existingIndex].quantity += 1;
      } else {
        updatedItems.push({ ...action.payload, quantity: 1 });
      }

      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };

    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: filteredItems,
        total: filteredItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
