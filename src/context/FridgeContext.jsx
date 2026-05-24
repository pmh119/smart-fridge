import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getItems, 
  saveItems, 
  getFridges, 
  saveFridges, 
  getCart, 
  saveCart 
} from '../utils/storage';

const FridgeContext = createContext();

export const useFridge = () => useContext(FridgeContext);

export const FridgeProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [fridges, setFridges] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial values from localStorage synchronously
    setItems(getItems());
    setFridges(getFridges());
    setCart(getCart());
    setLoading(false);
  }, []);

  // CRUD Operations
  const addItem = async (item) => {
    const newItem = { id: Date.now().toString(), ...item };
    setItems(prevItems => {
      const updated = [...prevItems, newItem];
      saveItems(updated);
      return updated;
    });
    return newItem;
  };
  
  const updateItem = async (id, data) => {
    setItems(prevItems => {
      const updated = prevItems.map(item => item.id === id ? { ...item, ...data } : item);
      saveItems(updated);
      return updated;
    });
  };
  
  const deleteItem = async (id) => {
    setItems(prevItems => {
      const updated = prevItems.filter(item => item.id !== id);
      saveItems(updated);
      return updated;
    });
  };

  const addToCart = async (name) => {
    setCart(prevCart => {
      if (!prevCart.some(c => c.name === name)) {
        const updated = [...prevCart, { id: Date.now().toString(), name, checked: false }];
        saveCart(updated);
        return updated;
      }
      return prevCart;
    });
  };

  const toggleCartItem = async (id, checked) => {
    setCart(prevCart => {
      const updated = prevCart.map(item => item.id === id ? { ...item, checked } : item);
      saveCart(updated);
      return updated;
    });
  };

  const deleteCartItem = async (id) => {
    setCart(prevCart => {
      const updated = prevCart.filter(item => item.id !== id);
      saveCart(updated);
      return updated;
    });
  };

  const addFridge = async (name) => {
    const newFridge = { id: Date.now().toString(), name, icon: '🧊' };
    setFridges(prevFridges => {
      const updated = [...prevFridges, newFridge];
      saveFridges(updated);
      return updated;
    });
    return newFridge;
  };

  return (
    <FridgeContext.Provider value={{ 
      items, fridges, cart, loading,
      addItem, updateItem, deleteItem,
      addToCart, toggleCartItem, deleteCartItem,
      addFridge
    }}>
      {children}
    </FridgeContext.Provider>
  );
};
