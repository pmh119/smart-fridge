import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where 
} from 'firebase/firestore';

const FridgeContext = createContext();

export const useFridge = () => useContext(FridgeContext);

export const FridgeProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [fridges, setFridges] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Subscribe to Items
    const qItems = query(collection(db, 'items'));
    const unsubItems = onSnapshot(qItems, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // 2. Subscribe to Fridges
    const qFridges = query(collection(db, 'fridges'));
    const unsubFridges = onSnapshot(qFridges, (snapshot) => {
      setFridges(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // 3. Subscribe to Cart
    const qCart = query(collection(db, 'cart'));
    const unsubCart = onSnapshot(qCart, (snapshot) => {
      setCart(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubItems();
      unsubFridges();
      unsubCart();
    };
  }, []);

  // CRUD Operations
  const addItem = async (item) => await addDoc(collection(db, 'items'), item);
  
  const updateItem = async (id, data) => await updateDoc(doc(db, 'items', id), data);
  
  const deleteItem = async (id) => await deleteDoc(doc(db, 'items', id));

  const addToCart = async (name) => {
    if (!cart.some(c => c.name === name)) {
      await addDoc(collection(db, 'cart'), { name, checked: false });
    }
  };

  const toggleCartItem = async (id, checked) => await updateDoc(doc(db, 'cart', id), { checked });

  const deleteCartItem = async (id) => await deleteDoc(doc(db, 'cart', id));

  const addFridge = async (name) => await addDoc(collection(db, 'fridges'), { name, icon: '🧊' });

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
