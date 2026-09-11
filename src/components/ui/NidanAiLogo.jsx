import React from 'react';

/**
 * NIDAAN AI Official Brand Logo
 * Features the official lotus + neural clinical intelligence emblem:
 * "NIDAAN AI - Caring Intelligence. Transforming Diagnostics."
 */
export default function NidanAiLogo({
  size = 'md', // 'xs' (18px), 'sm' (24px), 'md' (32px), 'lg' (44px), 'xl' (56px)
  className = '',
  showText = false,
  textClassName = '',
  variant = 'mark' // 'mark' | 'badge' | 'full'
}) {
  const sizeMap = {
    xs: 18,
    sm: 24,
    md: 32,
    lg: 44,
    xl: 56
  };

  const px = typeof size === 'number' ? size : (sizeMap[size] || 32);
  const imgSrc = variant === 'full' ? '/nidaan_ai_full.png' : '/nidaan_ai_mark.png';

  const logoGraphic = (
    <img
      src={imgSrc}
      alt="NIDAAN AI"
      style={{ width: `${px}px`, height: 'auto', maxHeight: `${px}px` }}
      className={`object-contain shrink-0 transition-transform ${className}`}
      onError={(e) => {
        if (!e.currentTarget.src.includes('nidaan_ai_logo.png')) {
          e.currentTarget.src = '/nidaan_ai_logo.png';
        }
      }}
    />
  );

  if (variant === 'badge') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 text-white font-black text-xs shadow-xs border border-slate-700/60 ${className}`}>
        {logoGraphic}
        <span className="tracking-wide">NIDAAN AI</span>
      </span>
    );
  }

  if (showText) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        {logoGraphic}
        <div className="leading-none">
          <span className={`font-black tracking-tight text-slate-900 ${textClassName || 'text-sm sm:text-base'}`}>
            NIDAAN <span className="text-[#0B4C8C]">AI</span>
          </span>
        </div>
      </div>
    );
  }

  return logoGraphic;
}


