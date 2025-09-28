// src/context/CartContext.tsx
import React, { createContext, useReducer, useContext, ReactNode } from 'react';

// -----------------------------
// Tipos
// -----------------------------
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } };

// -----------------------------
// Estado inicial
// -----------------------------
const initialState: CartState = {
  items: [],
  total: 0,
};

// -----------------------------
// Reducer
// -----------------------------
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      const updatedItems = [...state.items];

      const quantityToAdd = action.payload.quantity ?? 1; // nunca undefined

      if (existingIndex >= 0) {
        const existingItem = state.items[existingIndex];
        if (!existingItem) throw new Error('Item no encontrado'); // TS strict-safe

        updatedItems[existingIndex] = {
          id: existingItem.id,
          name: existingItem.name,
          price: existingItem.price,
          quantity: existingItem.quantity + quantityToAdd,
        };
      } else {
        updatedItems.push({
          id: action.payload.id,
          name: action.payload.name,
          price: action.payload.price,
          quantity: quantityToAdd,
        });
      }

      const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return { items: updatedItems, total };
    }

    case 'REMOVE_ITEM': {
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      const total = filteredItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return { items: filteredItems, total };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      const updatedItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return { items: updatedItems, total };
    }

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
}

// -----------------------------
// Context
// -----------------------------
interface CartContextProps extends CartState {
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

interface CartProviderProps {
  children: ReactNode;
}

const CartContext = createContext<CartContextProps | null>(null);

// -----------------------------
// Provider
// -----------------------------
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item: Omit<CartItem, 'quantity'>, quantity?: number) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { ...item, quantity: quantity ?? 1 }, // nunca undefined
    });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// -----------------------------
// Hook personalizado
// -----------------------------
export const useCart = (): CartContextProps => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
