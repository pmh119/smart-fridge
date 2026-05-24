import React, { useState } from 'react';
import { useFridge } from '../context/FridgeContext';
import { Plus, Minus, Search, PackageOpen } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

export default function Fridge() {
  const { items, fridges, addItem, updateItem, deleteItem, addToCart, loading } = useFridge();
  const [selectedFridge, setSelectedFridge] = useState('main');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [newItem, setNewItem] = useState({
    name: '',
    category: '냉장',
    qty: 1,
    expDate: new Date().toISOString().split('T')[0]
  });

  const handleSave = async () => {
    if (!newItem.name) return;
    await addItem({
      ...newItem,
      icon: null,
      fridgeId: selectedFridge
    });
    setShowAddModal(false);
    setNewItem({ name: '', category: '냉장', qty: 1, expDate: new Date().toISOString().split('T')[0] });
  };

  const handleTakeOut = async (id, currentQty, amount, name) => {
    const newQty = Math.max(0, currentQty - amount);
    if (newQty === 0) {
      await addToCart(name);
      await deleteItem(id);
    } else {
      await updateItem(id, { qty: newQty });
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>데이터를 불러오는 중...</div>;

  const fridgeItems = items.filter(item => item.fridgeId === selectedFridge);
  const filteredItems = fridgeItems.filter(item => item.name.includes(searchTerm));

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>나의 냉장고 🧊</h1>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            {fridges.map(f => (
              <button 
                key={f.id} 
                className={`btn ${selectedFridge === f.id ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                onClick={() => setSelectedFridge(f.id)}
              >
                {f.icon || '🧊'} {f.name}
              </button>
            ))}
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={20} /> 입고하기
        </button>
      </div>

      <div className="cute-card" style={{ padding: '0', marginBottom: '2rem', overflow: 'hidden', display: 'flex', alignItems: 'center', background: '#fff' }}>
        <div style={{ padding: '1rem', color: 'var(--text-muted)' }}>
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="어떤 재료를 찾으시나요?" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, border: 'none', outline: 'none', padding: '1rem 1rem 1rem 0', fontSize: '1rem', background: 'transparent', fontWeight: '600', color: 'var(--text-main)' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {filteredItems.map((item) => {
          const days = differenceInDays(parseISO(item.expDate), new Date());
          return (
            <div key={item.id} className="cute-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid var(--border)', overflow: 'hidden' }}>
                  {item.icon ? <img src={item.icon} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <PackageOpen size={32} color="var(--text-muted)" />}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>{item.name}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-primary">{item.category}</span>
                    <span className={`badge ${days < 0 ? 'badge-danger' : (days <= 3 ? 'badge-warning' : 'badge-success')}`}>
                      {days < 0 ? '기한지남' : `D-${days}`}
                    </span>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-color)', padding: '0.8rem', borderRadius: '16px', border: '2px solid var(--border)' }}>
                <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>수량: {item.qty}개</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleTakeOut(item.id, item.qty, 1, item.name)} className="btn btn-outline" style={{ padding: '0.4rem', borderRadius: '12px' }}>
                    <Minus size={16} /> 1개 출고
                  </button>
                  <button onClick={() => handleTakeOut(item.id, item.qty, item.qty, item.name)} className="btn btn-outline" style={{ padding: '0.4rem', borderRadius: '12px', color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                    전부 출고
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filteredItems.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <PackageOpen size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
            <p style={{ fontWeight: '600' }}>앗, 이 냉장고엔 재료가 없어요!</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ marginBottom: '1.5rem' }}>새 식재료 입고 🛒</h2>
            
            <div className="input-group">
              <label>품목명</label>
              <input type="text" className="input-field" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} placeholder="예: 양파" />
            </div>
            
            <div className="input-group">
              <label>보관 위치</label>
              <select className="input-field" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                <option value="냉장">냉장</option>
                <option value="냉동">냉동</option>
                <option value="실온">실온</option>
                <option value="김치냉장고">김치냉장고</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label>수량 (개/봉)</label>
                <input type="number" min="1" className="input-field" value={newItem.qty} onChange={e => setNewItem({...newItem, qty: parseInt(e.target.value) || 1})} />
              </div>
              
              <div className="input-group" style={{ flex: 1 }}>
                <label>유통기한</label>
                <input type="date" className="input-field" value={newItem.expDate} onChange={e => setNewItem({...newItem, expDate: e.target.value})} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>취소</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>입고 완료!</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
