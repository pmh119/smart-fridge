import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Home, Refrigerator, AlertTriangle, MessageSquare, Plus, Utensils, ShoppingBag, Settings } from 'lucide-react';
import { FridgeProvider } from './context/FridgeContext';
import Dashboard from './pages/Dashboard';
import Fridge from './pages/Fridge';
import KakaoGuide from './pages/KakaoGuide';
import Recipes from './pages/Recipes';
import Cart from './pages/Cart';
import SettingsPage from './pages/Settings';

function App() {
  return (
    <FridgeProvider>
      <BrowserRouter>
        <div className="app-container">
          <aside className="sidebar cute-card" style={{ margin: '1rem', height: 'calc(100vh - 2rem)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem' }}>
              <img src="/hero.png" alt="Logo" style={{ width: '48px', height: '48px', borderRadius: '16px', objectFit: 'cover', border: '3px solid #ff5c8a' }} />
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>냉장고 요정</h2>
            </div>
            
            <nav className="nav-menu">
              <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
                <Home size={20} strokeWidth={2.5} />
                대시보드
              </NavLink>
              <NavLink to="/fridge" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
                <Refrigerator size={20} strokeWidth={2.5} />
                나의 냉장고
              </NavLink>
              <NavLink to="/recipes" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
                <Utensils size={20} strokeWidth={2.5} />
                레시피 추천
              </NavLink>
              <NavLink to="/cart" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
                <ShoppingBag size={20} strokeWidth={2.5} />
                장바구니
              </NavLink>
              <NavLink to="/kakao" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
                <MessageSquare size={20} strokeWidth={2.5} />
                카카오봇
              </NavLink>
              <NavLink to="/settings" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
                <Settings size={20} strokeWidth={2.5} />
                설정
              </NavLink>
            </nav>
            
            <div style={{ marginTop: 'auto', textAlign: 'center' }}>
              <div className="cute-card" style={{ padding: '1rem', background: 'var(--bg-color)', border: '2px dashed var(--primary)', boxShadow: 'none' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>가족 초대하기</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>초대 링크로 공유하세요!</p>
                <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.9rem', padding: '0.5rem' }}>
                  <Plus size={16} strokeWidth={3} /> 링크 복사
                </button>
              </div>
            </div>
          </aside>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/fridge" element={<Fridge />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/kakao" element={<KakaoGuide />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </FridgeProvider>
  );
}

export default App;
