import { Link, useNavigate } from 'react-router-dom';
import { Monitor, ArrowRight, PhoneCall } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export default function WelcomeNavbar({ currentLang, onLangChange }) {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const isHi = currentLang === 'hi';

  // Continuous unbroken cursive paths for compact Navbar MediKiosk
  const mediPath = "M 55 95 C 55 52, 62 28, 76 28 C 86 28, 92 48, 98 88 L 104 95 C 112 52, 122 28, 134 28 C 145 28, 148 50, 150 78 L 152 95 C 158 97, 170 85, 180 68 C 188 52, 200 52, 200 66 C 200 82, 184 96, 172 96 C 185 96, 204 94, 218 82 C 226 75, 234 62, 246 62 C 258 62, 260 76, 260 95 L 260 22 L 260 95 C 267 97, 278 90, 290 76 L 298 62 L 298 95 C 302 97, 312 95, 322 86";
  const kioskPath = "M 360 22 L 360 95 M 360 32 C 380 18, 400 22, 392 40 C 382 58, 366 68, 385 68 C 400 68, 415 86, 424 95 C 430 97, 440 88, 450 75 L 456 62 L 456 95 C 464 97, 478 97, 488 86 C 498 75, 498 60, 485 60 C 470 60, 466 75, 475 88 C 482 96, 495 94, 506 78 C 514 68, 523 62, 532 62 C 541 62, 542 71, 534 78 C 525 85, 521 89, 528 95 C 535 99, 546 94, 556 82 L 565 62 C 572 44, 577 22, 584 22 C 590 22, 586 44, 582 68 L 579 95 C 586 82, 597 62, 608 62 C 615 62, 613 74, 604 84 C 597 91, 606 95, 616 94 C 628 90, 640 82, 652 70";
  const underlinePath = "M 35 125 C 180 114, 340 112, 480 118 C 540 120, 600 124, 645 112 C 655 110, 648 104, 634 108 C 600 114, 520 124, 440 128";

  // Devanagari Hindi Calligraphy Paths for "मेडी-कियोस्क"
  const hiMediMatra = "M 85 45 C 85 24, 64 12, 76 10 C 88 8, 98 28, 106 45";
  const hiMediMa = "M 76 45 L 76 78 C 76 92, 50 92, 50 78 C 50 64, 74 64, 82 66 L 126 66 M 126 45 L 126 102";
  const hiMediDa = "M 175 45 L 175 56 C 152 56, 144 72, 168 82 C 194 92, 180 104, 154 104";
  const hiMediDiMatra = "M 172 45 C 172 14, 222 14, 222 45 L 222 102";
  const hiShirorekha1 = "M 38 45 L 235 45";

  const hiKioskKiMatra = "M 280 45 L 280 102 M 280 45 C 280 14, 330 14, 330 45";
  const hiKioskKa = "M 330 45 L 330 102 M 330 65 C 300 65, 300 87, 330 87 C 330 68, 356 68, 364 85 C 364 92, 364 98, 364 98";
  const hiKioskYa = "M 405 58 C 386 58, 386 78, 402 84 C 424 88, 424 98, 444 98 L 444 45 M 444 45 L 444 102";
  const hiKioskOMatra = "M 470 45 L 470 102 M 470 45 C 470 22, 450 12, 462 10 C 474 8, 484 26, 484 45";
  const hiKioskSa = "M 524 58 C 508 58, 508 78, 524 84 L 510 102 M 522 80 L 550 80";
  const hiKioskKa2 = "M 574 45 L 574 102 M 574 65 C 544 65, 544 87, 574 87 C 574 68, 600 68, 608 85 C 608 92, 608 98, 608 98";
  const hiShirorekha2 = "M 268 45 L 620 45";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs font-sans transition-all">
      
      {/* 1. TOP NATIONAL UTILITY STRIP WITH TRICOLOR ACCENT */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
      
      <div className="bg-[#0A192F] text-slate-300 text-xs px-4 sm:px-8 py-1.5 flex items-center justify-between border-b border-white/10">
        
        {/* Left: Official Government Affiliation */}
        <div className="flex items-center gap-2 text-[11px] sm:text-xs">
          <span className="text-white font-extrabold tracking-wide">{isHi ? 'भारत सरकार' : 'Government of India'}</span>
          <span className="text-white/30">•</span>
          <span className="text-[#FF9933] font-bold">
            {isHi ? 'आयुष मंत्रालय' : 'Ministry of Ayush'}
          </span>
        </div>

        {/* Right: National Helpline & Language Switcher */}
        <div className="flex items-center gap-3 sm:gap-4 text-[11px]">
          {/* Toll-Free Helpline */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
            <PhoneCall size={11} className="text-[#FF9933]" />
            <span className="text-[11px]">{isHi ? 'हेल्पलाइन:' : 'Toll-Free:'} <b className="text-white font-bold tracking-wide">14477</b></span>
          </div>

          {/* Segmented Language Switcher */}
          <div className="inline-flex items-center bg-white/10 p-0.5 rounded-lg border border-white/15 backdrop-blur-xs">
            <button
              onClick={() => onLangChange?.('en')}
              className={`px-2.5 py-0.5 rounded-md text-[10.5px] font-bold transition-all ${
                !isHi ? 'bg-white text-[#0A192F] shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => onLangChange?.('hi')}
              className={`px-2.5 py-0.5 rounded-md text-[10.5px] font-bold transition-all ${
                isHi ? 'bg-[#FF9933] text-black shadow-xs font-black' : 'text-slate-300 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN BRAND HEADER BAR */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        
        {/* ================= LEFT SIDE: STATE EMBLEM & TYPOGRAPHY ================= */}
        <Link to="/" className="relative z-20 flex items-center gap-3 sm:gap-3.5 group shrink-0 focus:outline-hidden">
          <img 
            src="/Emblem_of_India.svg" 
            alt="National Emblem of India" 
            className="h-11 sm:h-13 md:h-14 w-auto object-contain drop-shadow-xs transition-transform group-hover:scale-[1.02]" 
          />

          <div className="flex flex-col justify-center select-none">
            <span className="text-xs sm:text-sm md:text-[14px] font-medium text-slate-600 tracking-tight leading-tight">
              {isHi ? 'भारत सरकार' : 'Government of India'}
            </span>
            <span className="text-sm sm:text-base md:text-[18px] font-bold text-slate-900 tracking-tight leading-tight group-hover:text-[#0B4C8C] transition-colors">
              {isHi ? 'आयुष मंत्रालय' : 'Ministry of Ayush'}
            </span>
          </div>
        </Link>

        {/* ================= TRUE GEOMETRIC CENTER: MEDIKIOSK BRANDING ================= */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-auto items-center justify-center z-10">
          <Link to="/" className="flex flex-col items-center hover:opacity-90 transition-opacity">
            <svg
              key={currentLang}
              viewBox="0 0 690 145"
              className="h-8 sm:h-9 md:h-10 lg:h-11 w-auto overflow-visible drop-shadow-[0_4px_12px_rgba(11,76,140,0.15)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {!isHi ? (
                <>
                  {/* "Medi" */}
                  <motion.path
                    d={mediPath}
                    stroke="#0B4C8C"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.1, delay: 0.1, ease: [0.38, 0.04, 0.22, 1] }}
                  />

                  {/* 'i' Dot for Medi */}
                  <motion.circle
                    cx="298"
                    cy="40"
                    r="6"
                    fill="#E2861E"
                    initial={shouldReduceMotion ? false : { scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 1.15, ease: "backOut" }}
                  />

                  {/* "Kiosk" */}
                  <motion.path
                    d={kioskPath}
                    stroke="#E2861E"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 1.2, ease: [0.38, 0.04, 0.22, 1] }}
                  />

                  {/* 'i' Dot for Kiosk */}
                  <motion.circle
                    cx="456"
                    cy="40"
                    r="6"
                    fill="#E2861E"
                    initial={shouldReduceMotion ? false : { scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 2.35, ease: "backOut" }}
                  />

                  {/* Underline Flourish */}
                  <motion.path
                    d={underlinePath}
                    stroke="#E2861E"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 2.45, ease: [0.34, 1.25, 0.64, 1] }}
                  />

                  {/* Terminal Star Sparkle */}
                  <motion.circle
                    cx="645"
                    cy="112"
                    r="3.5"
                    fill="#E2861E"
                    initial={shouldReduceMotion ? false : { scale: 0, opacity: 0 }}
                    animate={{ scale: 1.35, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 2.9, ease: "backOut" }}
                  />
                </>
              ) : (
                <>
                  <defs>
                    <clipPath id="welcomeNavbarHindiInk">
                      <motion.rect
                        x="80"
                        y="0"
                        width="540"
                        height="145"
                        initial={shouldReduceMotion ? false : { width: 0 }}
                        animate={{ width: 540 }}
                        transition={{ duration: 1.2, delay: 0.1, ease: [0.38, 0.04, 0.22, 1] }}
                      />
                    </clipPath>
                  </defs>

                  {/* Real-time Ink Writing Reveal */}
                  <g clipPath="url(#welcomeNavbarHindiInk)">
                    <text
                      x="345"
                      y="90"
                      textAnchor="middle"
                      style={{ fontFamily: "'Kalam', 'Noto Sans Devanagari', sans-serif", fontWeight: 700, fontSize: '82px', letterSpacing: '1px' }}
                    >
                      <tspan fill="#0B4C8C">मेडी</tspan>
                      <tspan fill="#E2861E">कियोस्क</tspan>
                    </text>
                  </g>

                  {/* Animated Calligraphy Writing Nib */}
                  <motion.g
                    initial={shouldReduceMotion ? false : { x: 140, opacity: 0 }}
                    animate={{ 
                      x: [140, 140, 540], 
                      opacity: [0, 1, 1, 0] 
                    }}
                    transition={{ 
                      duration: 1.2, 
                      delay: 0.1, 
                      ease: [0.38, 0.04, 0.22, 1],
                      times: [0, 0.05, 0.95, 1]
                    }}
                  >
                    <circle cx="0" cy="55" r="4" fill="#E2861E" filter="drop-shadow(0 0 5px #E2861E)" />
                    <circle cx="0" cy="55" r="2" fill="#FFFFFF" />
                  </motion.g>

                  {/* Dynamic Saffron Underline Sweep */}
                  <motion.path
                    d="M 120 115 C 220 108, 340 106, 460 112 C 505 114, 545 116, 570 108"
                    stroke="#E2861E"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.3, ease: [0.34, 1.25, 0.64, 1] }}
                  />

                  {/* Terminal Star Sparkle */}
                  <motion.circle
                    cx="572"
                    cy="108"
                    r="3.5"
                    fill="#E2861E"
                    initial={shouldReduceMotion ? false : { scale: 0, opacity: 0 }}
                    animate={{ scale: 1.35, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 1.9, ease: "backOut" }}
                  />
                </>
              )}
            </svg>
            <span className="text-[9.5px] font-bold tracking-wider text-slate-500 uppercase -mt-0.5">
              {isHi ? 'डिजिटल स्वास्थ्य कियोस्क प्रणाली' : 'Digital Health Kiosk System'}
            </span>
          </Link>
        </div>

        {/* ================= RIGHT SIDE: CLEAN THEME-MATCHED OPEN MEDIKIOSK CTA ================= */}
        <div className="relative z-20 flex items-center shrink-0">
          <button
            onClick={() => navigate('/kiosk')}
            className="group relative inline-flex items-center gap-2.5 px-5 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0B4C8C] via-[#105AA6] to-[#0B4C8C] hover:from-[#08355F] hover:via-[#0B4C8C] hover:to-[#08355F] text-white font-bold text-xs sm:text-sm shadow-[0_4px_14px_rgba(11,76,140,0.25)] hover:shadow-[0_6px_20px_rgba(11,76,140,0.38)] transition-all hover:-translate-y-0.5 active:translate-y-0 border-t border-white/25 cursor-pointer overflow-hidden"
          >
            {/* Subtle sheen reflection sweep */}
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />

            <div className="w-6 h-6 rounded-lg bg-white/15 flex items-center justify-center text-white backdrop-blur-xs">
              <Monitor size={14} />
            </div>

            <span className="font-extrabold tracking-tight">
              {isHi ? 'कियोस्क शुरू करें' : 'Open MediKiosk'}
            </span>

            <ArrowRight size={14} className="text-[#E2861E] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>

    </header>
  );
}

