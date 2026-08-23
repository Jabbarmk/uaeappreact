import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api';

const FALLBACK_SLIDES = [
  { id: -1, imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&fit=crop' },
  { id: -2, imageUrl: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200&fit=crop' },
];

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: ['welcome'],
    queryFn: () => api.get('/welcome').then((r) => r.data),
    staleTime: 5 * 60_000,
  });

  const slides: any[] = data?.slides?.length ? data.slides : FALLBACK_SLIDES;
  const settings = { timer: 4, radius: 24, padding: 16, style: 'fade', ...(data?.settings || {}) };
  const [cur, setCur] = useState(0);
  const total = slides.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (total <= 1) return;
    timerRef.current = setInterval(() => setCur((c) => (c + 1) % total), Math.max(1, Number(settings.timer) || 4) * 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [total, settings.timer]);

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      {/* Top half — full-image slider */}
      <div style={{ flex: '1 1 50%', minHeight: 0, padding: settings.padding, boxSizing: 'border-box' }}>
        <div style={{
          position: 'relative', width: '100%', height: '100%',
          borderRadius: settings.radius, overflow: 'hidden', background: '#111',
        }}>
          {slides.map((s, i) => (
            <img key={s.id ?? i} src={s.imageUrl} alt=""
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                opacity: settings.style === 'fade' ? (i === cur ? 1 : 0) : 1,
                transform: settings.style === 'slide' ? `translateX(${(i - cur) * 100}%)` : 'none',
                transition: settings.style === 'fade' ? 'opacity 0.7s ease' : 'transform 0.6s ease',
              }} />
          ))}
          {total > 1 && (
            <div style={{ position: 'absolute', bottom: 14, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6 }}>
              {slides.map((s, i) => (
                <span key={s.id ?? i} style={{
                  width: i === cur ? 20 : 6, height: 6, borderRadius: 3,
                  background: i === cur ? '#fff' : 'rgba(255,255,255,0.5)', transition: 'width 0.3s ease',
                }} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom half — brand + Explore */}
      <div style={{
        flex: '1 1 50%', minHeight: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 22, padding: '0 32px', textAlign: 'center',
      }}>
        <img src="/assets/images/smatuae.png" alt="SmartUAE" style={{ height: 44, objectFit: 'contain' }} />
        <div>
          <h1 style={{ color: 'var(--dark, #0D1B2A)', fontSize: 24, fontWeight: 800, margin: '0 0 6px' }}>Welcome to SmartUAE</h1>
          <p style={{ color: '#666', fontSize: 14, margin: 0 }}>
            Businesses, offers, jobs, real estate &amp; more — all in one place.
          </p>
        </div>
        <button onClick={() => navigate('/home')}
          style={{
            padding: '13px 46px', borderRadius: 999, border: 'none', cursor: 'pointer',
            background: 'var(--primary, #6C4CE0)', color: '#fff', fontSize: 15, fontWeight: 700,
            boxShadow: '0 8px 24px rgba(var(--primary-rgb, 108,76,224), 0.35)',
          }}>
          Explore <i className="fas fa-arrow-right" style={{ marginLeft: 8 }} />
        </button>
      </div>
    </div>
  );
}
