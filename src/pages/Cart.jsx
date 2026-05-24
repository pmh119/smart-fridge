import React, { useState } from 'react';
import { useFridge } from '../context/FridgeContext';
import { ShoppingBag, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function Cart() {
  const { cart, addToCart, toggleCartItem, deleteCartItem, loading } = useFridge();
  const [newItem, setNewItem] = useState('');

  const handleAdd = async () => {
    if (!newItem) return;
    await addToCart(newItem);
    setNewItem('');
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>데이터를 불러오는 중...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1>장바구니 🛒</h1>
        <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>떨어지기 전에 미리미리 챙기세요!</p>
      </div>

      <div className="cute-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            className="input-field" 
            style={{ flex: 1 }} 
            placeholder="구매할 품목을 입력하세요" 
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button className="btn btn-primary" onClick={handleAdd}>
            <Plus size={20} /> 추가
          </button>
        </div>
      </div>

      <div className="cute-card" style={{ padding: 0 }}>
        {cart.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <ShoppingBag size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.2 }} />
            <p>장바구니가 비어 있습니다.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {cart.map((item, index) => (
              <div key={item.id} style={{ 
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem 1.5rem',
                borderBottom: index !== cart.length - 1 ? '3px solid var(--border)' : 'none',
                opacity: item.checked ? 0.6 : 1
              }}>
                <button 
                  onClick={() => toggleCartItem(item.id, !item.checked)}
                  style={{ 
                    width: '28px', height: '28px', borderRadius: '8px', 
                    border: '3px solid var(--border)', background: item.checked ? 'var(--primary)' : 'white',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  {item.checked && <CheckCircle2 size={18} color="white" strokeWidth={3} />}
                </button>
                <span style={{ 
                  flex: 1, fontSize: '1.1rem', fontWeight: '700',
                  textDecoration: item.checked ? 'line-through' : 'none',
                  color: item.checked ? 'var(--text-muted)' : 'var(--text-main)'
                }}>
                  {item.name}
                </span>
                <button onClick={() => deleteCartItem(item.id)} className="btn" style={{ padding: '0.5rem', color: 'var(--danger)' }}>
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {cart.some(i => i.checked) && (
        <button 
          className="btn btn-outline" 
          style={{ marginTop: '1.5rem', width: '100%', color: 'var(--danger)', borderColor: 'var(--danger)' }}
          onClick={() => {
            cart.filter(i => i.checked).forEach(i => deleteCartItem(i.id));
          }}
        >
          구매 완료 항목 삭제하기
        </button>
      )}
    </div>
  );
}
