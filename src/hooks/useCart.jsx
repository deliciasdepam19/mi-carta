import { useReducer, useEffect, createContext, useContext } from 'react';

const CartContext = createContext(null);
const CartDispatchContext = createContext(null);

const STORAGE_KEY = 'mi-carta-cart';

function loadCart() {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch { /* ignore quota errors */ }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(
        (i) => i.nombre === action.item.nombre && i.categoria === action.item.categoria
      );
      if (existing) {
        return state.map((i) =>
          i.nombre === action.item.nombre && i.categoria === action.item.categoria
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        );
      }
      return [...state, { ...action.item, cantidad: 1 }];
    }
    case 'REMOVE_ITEM':
      return state.filter(
        (i) => !(i.nombre === action.item.nombre && i.categoria === action.item.categoria)
      );
    case 'UPDATE_QUANTITY': {
      const { nombre, categoria, cantidad } = action;
      if (cantidad <= 0) {
        return state.filter((i) => !(i.nombre === nombre && i.categoria === categoria));
      }
      return state.map((i) =>
        i.nombre === nombre && i.categoria === categoria ? { ...i, cantidad } : i
      );
    }
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, null, loadCart);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  return (
    <CartContext.Provider value={items}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartContext.Provider>
  );
}

export function useCart() {
  const items = useContext(CartContext);
  const dispatch = useContext(CartDispatchContext);
  if (dispatch === null) throw new Error('useCart must be used within a CartProvider');

  const total = items.reduce((sum, item) => {
    const price = parseFloat(item.precio.replace(/[^0-9]/g, ''));
    return sum + price * item.cantidad;
  }, 0);

  const totalFormatted = '$' + total.toLocaleString('es-CL');

  const itemCount = items.reduce((sum, i) => sum + i.cantidad, 0);

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', item });
  const removeItem = (item) => dispatch({ type: 'REMOVE_ITEM', item });
  const updateQuantity = (nombre, categoria, cantidad) =>
    dispatch({ type: 'UPDATE_QUANTITY', nombre, categoria, cantidad });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  return { items, total, totalFormatted, itemCount, addItem, removeItem, updateQuantity, clearCart };
}
