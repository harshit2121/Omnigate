import React from 'react';

/**
 * Nidan AI Official Brand Logo
 * Features the signature fusion of:
 * 1. Ayurvedic botanical leaf foundation
 * 2. Clinical Pulse / ECG wave (Teal)
 * 3. Neural clinical intelligence nexus crown (Navy & Gold nodes)
 */
export default function NidanAiLogo({
  size = 'md', // 'xs' (16px), 'sm' (20px), 'md' (28px), 'lg' (36px), 'xl' (48px)
  className = '',
  showText = false,
  textClassName = '',
  variant = 'mark' // 'mark' | 'badge'
}) {
  const sizeMap = {
    xs: 16,
    sm: 20,
    md: 26,
    lg: 34,
    xl: 46
  };

  const px = typeof size === 'number' ? size : (sizeMap[size] || 26);

  const logoGraphic = (
    <svg
      width={px}
      height={px}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform ${className}`}
      aria-label="Nidan AI Logo"
    >
      <defs>
        <linearGradient id="nidanNavyGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0F2B48" />
          <stop offset="100%" stopColor="#0B4C8C" />
        </linearGradient>
        <linearGradient id="nidanTealGrad" x1="0" y1="50" x2="100" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0D9488" />
          <stop offset="100%" stopColor="#14B8A6" />
        </linearGradient>
      </defs>

      {/* 1. Neural Nexus Crown (Top Geometry) */}
      <g stroke="url(#nidanNavyGrad)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Hexagonal Isometric Nexus */}
        <path d="M50 14 L66 23 L66 41 L50 50 L34 41 L34 23 Z" fill="none" opacity="0.9" />
        <line x1="50" y1="14" x2="50" y2="50" />
        <line x1="34" y1="23" x2="66" y2="41" />
        <line x1="66" y1="23" x2="34" y2="41" />
      </g>

      {/* Lateral Satellite Intelligence Nodes */}
      <line x1="34" y1="32" x2="22" y2="32" stroke="#0B4C8C" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="20" cy="32" r="3.2" fill="#0D9488" stroke="#0B4C8C" strokeWidth="1.5" />

      <line x1="66" y1="32" x2="78" y2="32" stroke="#0B4C8C" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="80" cy="32" r="3.2" fill="#0D9488" stroke="#0B4C8C" strokeWidth="1.5" />

      {/* Gold Core Nodes */}
      <circle cx="50" cy="14" r="3" fill="#D97706" />
      <circle cx="50" cy="32" r="3.8" fill="#F59E0B" stroke="#0B4C8C" strokeWidth="1.5" />
      <circle cx="34" cy="23" r="2.8" fill="#0D9488" />
      <circle cx="66" cy="23" r="2.8" fill="#0D9488" />
      <circle cx="34" cy="41" r="2.8" fill="#0D9488" />
      <circle cx="66" cy="41" r="2.8" fill="#0D9488" />

      {/* 2. Ayurvedic Botanical Leaf Contour (Outer Frame & Ribs) */}
      <path
        d="M50 38 C64 45 80 58 76 74 C72 87 56 94 50 96 C44 94 28 87 24 74 C20 58 36 45 50 38 Z"
        fill="none"
        stroke="url(#nidanNavyGrad)"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner Leaf Veins / Rib Curvature */}
      <path
        d="M50 48 C60 56 70 66 68 78"
        fill="none"
        stroke="url(#nidanNavyGrad)"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M50 48 C40 56 30 66 32 78"
        fill="none"
        stroke="url(#nidanNavyGrad)"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Sacred Basal Loop */}
      <path
        d="M50 88 C48 93 45 97 50 97 C55 97 52 93 50 88"
        fill="none"
        stroke="url(#nidanNavyGrad)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* 3. Clinical Pulse Wave (ECG Rhythm across Central Axis) */}
      <path
        d="M12 55 L38 55 L43 51 L47 62 L51 38 L55 65 L58 55 L88 55"
        fill="none"
        stroke="url(#nidanTealGrad)"
        strokeWidth="3.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (variant === 'badge') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 text-white font-black text-xs shadow-xs border border-slate-700/60 ${className}`}>
        {logoGraphic}
        <span className="tracking-wide">Nidan AI</span>
      </span>
    );
  }

  if (showText) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        {logoGraphic}
        <div className="leading-none">
          <span className={`font-black tracking-tight text-slate-900 ${textClassName || 'text-sm sm:text-base'}`}>
            Nidan <span className="text-[#0B4C8C]">AI</span>
          </span>
        </div>
      </div>
    );
  }

  return logoGraphic;
}
