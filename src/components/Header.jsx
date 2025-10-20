// src/components/Header.jsx
export default function Header() {
  return (
    <header className="app-header">
      <div className="brand">
        {/* Logo SVG minimalista (gráfico subindo) */}
        <svg className="brand-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 18V6M7 18v-5M11 18V9M15 18v-7M19 18V4" strokeLinecap="round"/>
          <polyline points="3,12 7,13 11,10 15,12 19,8" fill="none"/>
        </svg>
        <span className="brand-name">FinScope</span>
      </div>
    </header>
  );
}
