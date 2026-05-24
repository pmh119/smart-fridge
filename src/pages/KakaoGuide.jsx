import React from 'react';
import { MessageCircle, Code, Copy, CheckCircle2 } from 'lucide-react';

export default function KakaoGuide() {
  const webhookUrl = "https://your-domain.com/api/kakao-webhook"; // Mock URL

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '0.5rem' }}>카카오톡 봇 연동 안내 💬</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontWeight: '600' }}>
        카카오톡에서 `/입고`, `/출고` 명령어로 냉장고를 관리하세요!
      </p>

      <div className="cute-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <MessageCircle /> 1. 카카오 i 오픈빌더 설정
        </h3>
        <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
          카카오톡 채널을 생성하고 카카오 i 오픈빌더에서 스킬을 생성해야 합니다.<br/>
          아래의 웹훅(Webhook) URL을 스킬 서버 정보에 등록해주세요.
        </p>
        <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '3px solid var(--border)' }}>
          <code style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: '700' }}>{webhookUrl}</code>
          <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
            <Copy size={16} /> 복사
          </button>
        </div>
      </div>

      <div className="cute-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Code /> 2. 봇 명령어 사용법
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ background: '#fff0f5', padding: '1.5rem', borderRadius: '16px', border: '3px solid #ffd1dc' }}>
            <h4 style={{ color: '#ff5c8a', marginBottom: '0.5rem' }}>입고하기</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '1rem' }}>채팅창에 아래와 같이 입력하세요.</p>
            <div style={{ background: '#fff', padding: '1rem', borderRadius: '12px', border: '2px dashed #ff5c8a', fontWeight: '700' }}>
              /입고 양파 3개 냉장<br/>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>(입고일/유통기한은 자동 설정됩니다)</span>
            </div>
          </div>
          
          <div style={{ background: '#e0fbfc', padding: '1.5rem', borderRadius: '16px', border: '3px solid #90e0ef' }}>
            <h4 style={{ color: '#0077b6', marginBottom: '0.5rem' }}>출고하기</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '1rem' }}>일부 또는 전체 출고가 가능합니다.</p>
            <div style={{ background: '#fff', padding: '1rem', borderRadius: '12px', border: '2px dashed #0077b6', fontWeight: '700' }}>
              /출고 계란 2개<br/>
              /출고 우유 전부
            </div>
          </div>
        </div>
      </div>

      <div className="cute-card" style={{ background: 'var(--primary)', color: 'white', borderColor: '#ff5c8a' }}>
        <h3 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <CheckCircle2 color="white" /> 백엔드 API (Node.js) 제공 완료
        </h3>
        <p style={{ fontWeight: '500' }}>
          실제 카카오 서버와 통신할 수 있는 <code style={{ background: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.5rem', borderRadius: '8px' }}>server.js</code> 코드가 프로젝트 내 `server` 폴더에 준비되어 있습니다. Node.js 환경에서 실행하여 연동하실 수 있습니다.
        </p>
      </div>
    </div>
  );
}
