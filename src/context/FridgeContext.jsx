import React, { createContext, useContext, useState, useEffect } from 'react';
import { rtdb } from '../firebase';
import { ref, onValue, set } from 'firebase/database';
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

  // Read family sync code from localStorage (must be set by user)
  let initialFamilyCode = localStorage.getItem('family_sync_code') || '';
  if (initialFamilyCode === '5688') {
    localStorage.removeItem('family_sync_code');
    initialFamilyCode = '';
  }
  const familyCode = initialFamilyCode;

  // 1. Initial synchronous load from LocalStorage
  useEffect(() => {
    setItems(getItems());
    setFridges(getFridges());
    setCart(getCart());
    setLoading(false);
  }, []);

  // 2. Background Sync Listener
  useEffect(() => {
    const fridgeRef = ref(rtdb, `family-sync/${familyCode}/fridge`);
    
    const unsubscribe = onValue(fridgeRef, (snapshot) => {
      const remoteData = snapshot.val();
      if (remoteData) {
        const localUpdatedAt = parseInt(localStorage.getItem('fridge_updated_at') || '0');
        const remoteUpdatedAt = remoteData.updatedAt || 0;

        if (remoteUpdatedAt > localUpdatedAt) {
          const remoteItems = remoteData.items || [];
          const remoteFridges = remoteData.fridges || [];
          const remoteCart = remoteData.cart || [];

          setItems(remoteItems);
          setFridges(remoteFridges);
          setCart(remoteCart);

          saveItems(remoteItems);
          saveFridges(remoteFridges);
          saveCart(remoteCart);
          localStorage.setItem('fridge_updated_at', remoteUpdatedAt.toString());
          console.log('Smart Fridge synchronized with family cloud');
        }
      } else {
        // If cloud path is empty, push our local storage to it
        const currentItems = getItems();
        const currentFridges = getFridges();
        const currentCart = getCart();
        const now = Date.now();
        set(fridgeRef, {
          items: currentItems,
          fridges: currentFridges,
          cart: currentCart,
          updatedAt: now
        }).catch(err => console.error('Initial cloud sync failed: ', err));
      }
    });

    return () => unsubscribe();
  }, [familyCode]);

  // Helper to push updates to Firebase Realtime Database
  const pushToCloud = (newItems, newFridges, newCart) => {
    const now = Date.now();
    localStorage.setItem('fridge_updated_at', now.toString());
    const fridgeRef = ref(rtdb, `family-sync/${familyCode}/fridge`);
    set(fridgeRef, {
      items: newItems,
      fridges: newFridges,
      cart: newCart,
      updatedAt: now
    }).catch(err => console.error('Cloud synchronization failed: ', err));
  };

  // CRUD Operations
  const addItem = async (item) => {
    const newItem = { id: Date.now().toString(), ...item };
    setItems(prevItems => {
      const updated = [...prevItems, newItem];
      saveItems(updated);
      pushToCloud(updated, fridges, cart);
      return updated;
    });
    return newItem;
  };
  
  const updateItem = async (id, data) => {
    setItems(prevItems => {
      const updated = prevItems.map(item => item.id === id ? { ...item, ...data } : item);
      saveItems(updated);
      pushToCloud(updated, fridges, cart);
      return updated;
    });
  };
  
  const deleteItem = async (id) => {
    setItems(prevItems => {
      const updated = prevItems.filter(item => item.id !== id);
      saveItems(updated);
      pushToCloud(updated, fridges, cart);
      return updated;
    });
  };

  const addToCart = async (name) => {
    setCart(prevCart => {
      if (!prevCart.some(c => c.name === name)) {
        const updated = [...prevCart, { id: Date.now().toString(), name, checked: false }];
        saveCart(updated);
        pushToCloud(items, fridges, updated);
        return updated;
      }
      return prevCart;
    });
  };

  const toggleCartItem = async (id, checked) => {
    setCart(prevCart => {
      const updated = prevCart.map(item => item.id === id ? { ...item, checked } : item);
      saveCart(updated);
      pushToCloud(items, fridges, updated);
      return updated;
    });
  };

  const deleteCartItem = async (id) => {
    setCart(prevCart => {
      const updated = prevCart.filter(item => item.id !== id);
      saveCart(updated);
      pushToCloud(items, fridges, updated);
      return updated;
    });
  };

  const addFridge = async (name) => {
    const newFridge = { id: Date.now().toString(), name, icon: '🧊' };
    setFridges(prevFridges => {
      const updated = [...prevFridges, newFridge];
      saveFridges(updated);
      pushToCloud(items, updated, cart);
      return updated;
    });
    return newFridge;
  };

  return (
    <FridgeContext.Provider value={{ 
      items, fridges, cart, loading, familyCode,
      addItem, updateItem, deleteItem,
      addToCart, toggleCartItem, deleteCartItem,
      addFridge
    }}>
      {children}
    </FridgeContext.Provider>
  );
};
