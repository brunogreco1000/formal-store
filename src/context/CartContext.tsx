import React, { createContext, useReducer, useContext, ReactNode, useCallback } from 'react';

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
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity: number } } // quantity siempre requerido
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

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
  let updatedItems: CartItem[];

  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);

      if (existingIndex >= 0) {
        updatedItems = state.items.map((item, i) =>
          i === existingIndex ? { ...item, quantity: item.quantity + action.payload.quantity } : item
        );
      } else {
        updatedItems = [...state.items, { ...action.payload }];
      }
      break;
    }

    case 'REMOVE_ITEM':
      updatedItems = state.items.filter(item => item.id !== action.payload);
      break;

    case 'UPDATE_QUANTITY':
      updatedItems = state.items.map(item =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
      );
      break;

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }

  const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { items: updatedItems, total };
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

const CartContext = createContext<CartContextProps | undefined>(undefined);

// -----------------------------
// Provider
// -----------------------------
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity } });
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

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
