import NidanAiLogo from './NidanAiLogo';

export default function NidanAiCard({
  title,
  subtitle,
  badge = 'NIDAAN AI',
  showLogo = true,
  logoSize = 'md',
  headerRight,
  children,
  className = '',
  innerClassName = 'p-5',
  variant = 'default' // 'default' | 'subtle'
}) {
  return (
    <div className={`nidan-ai-card ${className}`}>
      <div className={`nidan-ai-inner ${innerClassName} relative overflow-hidden`}>
        {/* Soft, calm medical aura in background */}
        <div className="absolute -right-10 -top-10 w-44 h-44 bg-gradient-to-br from-blue-100/25 via-teal-100/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Clinical Header */}
        {(title || badge) && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3 mb-4 relative z-10">
            <div className="flex items-center gap-3">
              {showLogo && (
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center shrink-0 p-1">
                  <NidanAiLogo size={logoSize} />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  {title && (
                    <h3 className="text-xs font-black text-slate-900 tracking-tight">
                      {title}
                    </h3>
                  )}
                  {badge && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-sky-50 text-[#0B4C8C] border border-sky-200/80 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] animate-pulse" />
                      <span>{badge}</span>
                    </span>
                  )}
                </div>
                {subtitle && (
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {headerRight && (
              <div className="flex items-center gap-2 shrink-0">
                {headerRight}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
