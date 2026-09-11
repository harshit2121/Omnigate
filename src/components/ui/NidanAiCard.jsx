import { Sparkles } from 'lucide-react';

export default function NidanAiCard({
  title,
  subtitle,
  badge = 'Nidan AI™',
  icon: Icon = Sparkles,
  headerRight,
  children,
  className = '',
  innerClassName = 'p-5'
}) {
  return (
    <div className={`nidan-ai-card ${className}`}>
      <div className={`nidan-ai-inner ${innerClassName} relative overflow-hidden`}>
        {/* Subtle background glow effect */}
        <div className="absolute -right-12 -top-12 w-36 h-36 bg-gradient-to-br from-indigo-200/30 to-emerald-200/30 rounded-full blur-2xl pointer-events-none" />

        {/* Optional Header */}
        {(title || badge) && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100/80 pb-3 mb-4 relative z-10">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-cyan-600 text-white flex items-center justify-center font-bold shadow-sm shadow-indigo-500/20 shrink-0">
                <Icon size={16} className="animate-pulse" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black text-slate-900 tracking-wide">
                    {title}
                  </h3>
                  {badge && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-2xs">
                      ✨ {badge}
                    </span>
                  )}
                </div>
                {subtitle && (
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
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
