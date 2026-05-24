export const getItems = () => {
  const data = localStorage.getItem('fridge_items');
  if (data) return JSON.parse(data);
  return [
    { id: 1, name: '우유', category: '냉장', qty: 1, expDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], icon: '/milk.png', fridgeId: 'main' },
    { id: 2, name: '계란', category: '냉장', qty: 6, expDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], icon: '/eggs.png', fridgeId: 'main' },
    { id: 3, name: '사과', category: '실온', qty: 3, expDate: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0], icon: '/apple.png', fridgeId: 'main' },
  ];
};

export const saveItems = (items) => {
  localStorage.setItem('fridge_items', JSON.stringify(items));
};

export const getFridges = () => {
  const data = localStorage.getItem('fridges');
  if (data) return JSON.parse(data);
  return [
    { id: 'main', name: '우리집 대장', icon: '🧊' },
    { id: 'sub', name: '자취방 꿀단지', icon: '🍯' }
  ];
};

export const saveFridges = (fridges) => {
  localStorage.setItem('fridges', JSON.stringify(fridges));
};

export const getCart = () => {
  const data = localStorage.getItem('shopping_cart');
  if (data) return JSON.parse(data);
  return [];
};

export const saveCart = (items) => {
  localStorage.setItem('shopping_cart', JSON.stringify(items));
};
