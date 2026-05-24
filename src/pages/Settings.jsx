import React, { useState } from 'react';
import { useFridge } from '../context/FridgeContext';
import { Plus, Edit2, Trash2, Home, UserPlus, Key } from 'lucide-react';

export default function SettingsPage() {
  const { fridges, addFridge, loading, familyCode } = useFridge();
  const [newFridgeName, setNewFridgeName] = useState('');
  const [code, setCode] = useState(familyCode || '5688');

  const handleSaveCode = () => {
    if (!code) return;
    localStorage.setItem('family_sync_code', code.trim());
    alert(`공유 코드가 '${code.trim()}'(으)로 변경되었습니다. 실시간 동기화를 적용하기 위해 페이지가 새로고침됩니다.`);
    window.location.reload();
  };

  const handleAddFridge = async () => {
    if (!newFridgeName) return;
    await addFridge(newFridgeName);
    setNewFridgeName('');
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>데이터를 불러오는 중...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1>설정 ⚙️</h1>
        <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>냉장고 관리 및 공유 설정</p>
      </div>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Home size={24} /> 냉장고 관리
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {fridges.map((fridge) => (
            <div key={fridge.id} className="cute-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '2rem', background: 'var(--bg-color)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid var(--border)' }}>
                {fridge.icon || '🧊'}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.1rem' }}>{fridge.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ID: {fridge.id}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.2rem' }}>
                <button className="btn" style={{ padding: '0.5rem', color: 'var(--text-muted)' }}>
                  <Edit2 size={18} />
                </button>
                <button className="btn" style={{ padding: '0.5rem', color: 'var(--danger)' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          <div className="cute-card" style={{ borderStyle: 'dashed', background: 'transparent', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="새 냉장고 이름" 
              value={newFridgeName}
              onChange={(e) => setNewFridgeName(e.target.value)}
            />
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleAddFridge}>
              <Plus size={20} /> 냉장고 추가하기
            </button>
          </div>
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserPlus size={24} /> 팀원 및 공유
        </h2>
        
        <div className="cute-card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Key size={18} style={{ color: 'var(--primary)' }} /> 가족 실시간 공유 코드
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
            사모님과 동일한 공유 코드를 입력하면 냉장고 식재료 현황 및 장바구니가 실시간으로 안전하게 동기화됩니다. 기본 코드는 <strong>5688</strong>입니다.
          </p>
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <input 
              type="text" 
              className="input-field" 
              style={{ flex: 1, padding: '0.6rem 1rem', fontSize: '1rem' }}
              placeholder="공유 코드 입력 (예: 5688)" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }} onClick={handleSaveCode}>
              코드 저장 및 새로고침
            </button>
          </div>
        </div>

        <div className="cute-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>현재 참여 중인 멤버</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>가족 공유 코드를 통해 실시간 연동 중인 멤버 목록입니다.</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['나 (마스터)', '배우자 (사모님)'].map((member, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem', background: 'var(--bg-color)', borderRadius: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: i === 0 ? 'var(--primary)' : '#8b5cf6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                  {i === 0 ? '나' : '배'}
                </div>
                <span style={{ fontWeight: '700' }}>{member}</span>
                {i === 0 && <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>관리자</span>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
