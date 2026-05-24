import React from 'react';
import { useFridge } from '../context/FridgeContext';
import { AlertCircle, Trash2, CheckCircle2 } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

export default function Dashboard() {
  const { items, deleteItem, loading } = useFridge();

  const getDaysLeft = (dateString) => {
    if (!dateString) return 0;
    const days = differenceInDays(parseISO(dateString), new Date());
    return days;
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>데이터를 불러오는 중...</div>;

  const expiredItems = items.filter(item => getDaysLeft(item.expDate) < 0);
  const warningItems = items.filter(item => getDaysLeft(item.expDate) >= 0 && getDaysLeft(item.expDate) <= 3);

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '0.5rem' }}>안녕하세요! 삐약이님 👋</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontWeight: '600' }}>오늘도 냉장고 평화 유지 완료!</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div className="cute-card" style={{ background: 'var(--primary)', color: 'white', borderColor: '#ff5c8a' }}>
          <h3 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle /> 유통기한 주의!
          </h3>
          <p style={{ fontSize: '3rem', fontWeight: '800', marginTop: '1rem', textShadow: '0 4px 0 #ff5c8a' }}>
            {warningItems.length + expiredItems.length} <span style={{ fontSize: '1.2rem', fontWeight: '600', textShadow: 'none' }}>건</span>
          </p>
        </div>
        <div className="cute-card" style={{ background: 'var(--success)', color: '#007f5f', borderColor: '#007f5f' }}>
          <h3 style={{ color: '#007f5f', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 /> 신선한 식재료
          </h3>
          <p style={{ fontSize: '3rem', fontWeight: '800', marginTop: '1rem', textShadow: '0 4px 0 #007f5f' }}>
            {items.length - warningItems.length - expiredItems.length} <span style={{ fontSize: '1.2rem', fontWeight: '600', textShadow: 'none' }}>개</span>
          </p>
        </div>
      </div>

      <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        ⚠️ 구출 작전이 시급해요! (폐기/임박)
      </h2>
      <div className="cute-card" style={{ padding: '0' }}>
        {expiredItems.length === 0 && warningItems.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>모두 신선합니다! 대단해요 🎉</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[...expiredItems, ...warningItems].map((item, index) => {
              const days = getDaysLeft(item.expDate);
              const isExpired = days < 0;
              return (
                <div key={item.id} style={{ 
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem',
                  borderBottom: index !== expiredItems.length + warningItems.length - 1 ? '3px solid var(--border)' : 'none'
                }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--border)', overflow: 'hidden' }}>
                    {item.icon ? <img src={item.icon} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🥩'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ color: 'var(--text-main)', fontSize: '1.2rem' }}>{item.name}</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>보관: {item.category}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge ${isExpired ? 'badge-danger' : 'badge-warning'}`} style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                      {isExpired ? `D+${Math.abs(days)} (지남)` : `D-${days}`}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => deleteItem(item.id)} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'var(--danger)', boxShadow: '0 3px 0 var(--danger)' }}>
                        <Trash2 size={14} /> 폐기하기
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
