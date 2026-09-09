import React from 'react';

/**
 * HealthIcon - Official Health Icons renderer with dynamic currentColor support.
 * Uses CSS mask to allow Tailwind text color classes (text-slate-800, text-white, text-blue-900, etc.)
 */
export default function HealthIcon({
  name,
  category = 'specialties',
  variant = 'filled',
  size = 28,
  className = '',
  alt = 'Medical Icon',
  style = {}
}) {
  const iconPath = `/icons/icons/svg/${variant}/${category}/${name}.svg`;

  return (
    <span
      className={`inline-block shrink-0 bg-current transition-colors ${className}`}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
        maskImage: `url("${iconPath}")`,
        WebkitMaskImage: `url("${iconPath}")`,
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        ...style
      }}
      role="img"
      aria-label={alt}
    />
  );
}
