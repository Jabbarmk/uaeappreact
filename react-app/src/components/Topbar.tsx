import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

export default function Topbar() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const topbar = document.querySelector('.topbar') as HTMLElement | null;
    if (!topbar) return;
    const onScroll = () => {
      topbar.style.boxShadow = window.scrollY > 40 ? '0 4px 20px rgba(108,92,231,0.08)' : 'none';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const q = (e.target as HTMLInputElement).value.trim();
      if (q) navigate(`/categories?search=${encodeURIComponent(q)}`);
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="logo">
          <span className="logo-icon"><i className="fas fa-bolt"></i></span>
          <span className="logo-text">SMART<span>UAE</span></span>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search anything..." id="globalSearch" ref={inputRef} onKeyPress={handleSearch} />
          <button className="search-btn" onClick={() => {
            const q = inputRef.current?.value.trim();
            if (q) navigate(`/categories?search=${encodeURIComponent(q)}`);
          }}>
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
