import React, { useState, useEffect } from 'react';
import { useFridge } from '../context/FridgeContext';
import { ChefHat, Timer, Flame } from 'lucide-react';

const MOCK_RECIPES = [
  {
    id: 1,
    title: '고소한 계란말이',
    ingredients: ['계란', '우유'],
    time: '15분',
    difficulty: '쉬움',
    image: 'https://images.unsplash.com/photo-1510629954389-c1e0da47d414?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 2,
    title: '사과 샐러드',
    ingredients: ['사과'],
    time: '10분',
    difficulty: '매우 쉬움',
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 3,
    title: '밀크 쉐이크',
    ingredients: ['우유'],
    time: '5분',
    difficulty: '매우 쉬움',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400'
  }
];

export default function Recipes() {
  const { items, loading } = useFridge();
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    if (loading) return;
    const fridgeItems = items.map(i => i.name);
    const filtered = MOCK_RECIPES.filter(recipe => 
      recipe.ingredients.some(ing => fridgeItems.includes(ing))
    );
    setRecommended(filtered);
  }, [items, loading]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>데이터를 불러오는 중...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1>오늘 뭐 해먹지? 🍳</h1>
        <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>냉장고 속 재료로 만들 수 있는 맛있는 요리들</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {recommended.map((recipe) => (
          <div key={recipe.id} className="cute-card" style={{ padding: 0, overflow: 'hidden' }}>
            <img src={recipe.image} alt={recipe.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.8rem' }}>{recipe.title}</h3>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.2rem' }}>
                <span style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)' }}>
                  <Timer size={16} /> {recipe.time}
                </span>
                <span style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)' }}>
                  <Flame size={16} /> {recipe.difficulty}
                </span>
              </div>
              <div style={{ marginBottom: '1.2rem' }}>
                <p style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>사용되는 재료:</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {recipe.ingredients.map(ing => (
                    <span key={ing} className={`badge ${items.some(i => i.name === ing) ? 'badge-primary' : 'badge-outline'}`} style={{ border: items.some(i => i.name === ing) ? '' : '2px solid var(--border)', color: items.some(i => i.name === ing) ? '' : 'var(--text-muted)' }}>
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
              <button className="btn btn-outline" style={{ width: '100%' }}>
                레시피 보기
              </button>
            </div>
          </div>
        ))}
      </div>

      {recommended.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '32px', border: '3px dashed var(--border)' }}>
          <ChefHat size={64} style={{ marginBottom: '1rem', opacity: 0.3 }} />
          <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>앗! 지금 있는 재료로는 추천할 레시피가 없어요 😭</p>
          <button className="btn btn-primary" style={{ marginTop: '1.5rem' }}>재료 사러가기</button>
        </div>
      )}
    </div>
  );
}
