import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, Monitor, Stethoscope, Users, Pill, Shield, 
  Activity, Menu, X, Globe, PhoneCall, ShieldCheck, 
  BarChart3, FileText, ChevronRight
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export default function GovtTopbar({ currentLang, onLangChange }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState(() => currentLang || localStorage.getItem('app_lang') || 'en');

  useEffect(() => {
    if (currentLang) {
      setLang(currentLang);
    }
  }, [currentLang]);

  const handleToggleLang = () => {
    const nextLang = lang === 'hi' ? 'en' : 'hi';
    setLang(nextLang);
    localStorage.setItem('app_lang', nextLang);
    if (onLangChange) {
      onLangChange(nextLang);
    }
  };

  // Continuous unbroken cursive paths for compact Topbar MediKiosk
  const mediPath = "M 55 95 C 55 52, 62 28, 76 28 C 86 28, 92 48, 98 88 L 104 95 C 112 52, 122 28, 134 28 C 145 28, 148 50, 150 78 L 152 95 C 158 97, 170 85, 180 68 C 188 52, 200 52, 200 66 C 200 82, 184 96, 172 96 C 185 96, 204 94, 218 82 C 226 75, 234 62, 246 62 C 258 62, 260 76, 260 95 L 260 22 L 260 95 C 267 97, 278 90, 290 76 L 298 62 L 298 95 C 302 97, 312 95, 322 86";
  const kioskPath = "M 360 22 L 360 95 M 360 32 C 380 18, 400 22, 392 40 C 382 58, 366 68, 385 68 C 400 68, 415 86, 424 95 C 430 97, 440 88, 450 75 L 456 62 L 456 95 C 464 97, 478 97, 488 86 C 498 75, 498 60, 485 60 C 470 60, 466 75, 475 88 C 482 96, 495 94, 506 78 C 514 68, 523 62, 532 62 C 541 62, 542 71, 534 78 C 525 85, 521 89, 528 95 C 535 99, 546 94, 556 82 L 565 62 C 572 44, 577 22, 584 22 C 590 22, 586 44, 582 68 L 579 95 C 586 82, 597 62, 608 62 C 615 62, 613 74, 604 84 C 597 91, 606 95, 616 94 C 628 90, 640 82, 652 70";
  const underlinePath = "M 35 125 C 180 114, 340 112, 480 118 C 540 120, 600 124, 645 112 C 655 110, 648 104, 634 108 C 600 114, 520 124, 440 128";

  const navLinks = [
    { labelEn: 'Home', labelHi: 'मुख्य पृष्ठ', path: '/', icon: Home },
    { labelEn: 'MediKiosk Intake', labelHi: 'मेडी-कियोस्क', path: '/kiosk', icon: Monitor, badge: lang === 'hi' ? 'रोगी' : 'Patient' },
    { labelEn: 'Ayush OPD Room', labelHi: 'आयुष ओपीडी', path: '/ayush-opd', icon: Stethoscope, badge: lang === 'hi' ? 'डॉक्टर' : 'Doctor' },
    { labelEn: 'OPD TV Display', labelHi: 'प्रतीक्षा टीवी', path: '/opd-display', icon: Monitor, badge: 'Live' },
    { labelEn: 'HMS Dashboard', labelHi: 'डैशबोर्ड', path: '/dashboard', icon: BarChart3 },
    { labelEn: 'Patient Records', labelHi: 'मरीज रिकॉर्ड', path: '/patient-records', icon: Users },
    { labelEn: 'E-Prescription', labelHi: 'ई-पर्चा', path: '/doctor-prescription', icon: FileText },
    { labelEn: 'Audit Log', labelHi: 'ऑडिट लॉग', path: '/audit-log', icon: Shield },
  ];

  return (
    <header className="bg-white border-b border-[#DCE3EC] sticky top-0 z-50 shadow-xs font-sans">
      
      {/* 1. TOP UTILITY STRIP */}
      <div className="bg-[#0B2A4A] text-[#C9D6E6] text-xs px-4 sm:px-8 py-1.5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs">
          <span className="text-white font-extrabold">{lang === 'hi' ? 'भारत सरकार' : 'Government of India'}</span>
          <span className="text-white/40">|</span>
          <span className="hidden md:inline text-[#F2941E] font-bold">
            {lang === 'hi' ? 'आयुष मंत्रालय' : 'Ministry of Ayush'}
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-6 text-[11px]">
          <div className="hidden lg:flex items-center gap-1.5 text-[#C9D6E6]">
            <PhoneCall size={12} className="text-[#F2941E]" />
            <span>{lang === 'hi' ? 'टोल-फ्री हेल्पलाइन:' : 'Toll-Free Helpline:'} <b className="text-white font-bold">14477 / 1800-11-22-02</b></span>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-2">
            <button 
              onClick={handleToggleLang}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-0.5 rounded text-white font-bold text-[11px] transition-colors cursor-pointer"
            >
              <Globe size={12} className="text-[#F2941E]" />
              <span>{lang === 'hi' ? 'English' : 'हिंदी'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN BRAND HEADER */}
      <div className="relative w-full px-4 sm:px-8 lg:px-12 py-2.5 flex items-center justify-between bg-white">
        
        {/* Left: Official Emblem and Ayush Ministry branding */}
        <Link to="/" className="flex items-center gap-3 sm:gap-4 group shrink-0 z-20">
          <img 
            src="/Emblem_of_India.svg" 
            alt="National Emblem of India" 
            className="h-12 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105" 
          />
          <div className="border-l border-[#DCE3EC] pl-3">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-black text-[#E2861E] tracking-tight leading-none">
                {lang === 'hi' ? 'आयुष मंत्रालय' : 'Ministry of Ayush'} <span className="text-slate-300 font-normal">|</span> <span className="text-[#0B4C8C]">{lang === 'hi' ? 'भारत सरकार' : 'Govt. of India'}</span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#16213A] mt-0.5">
              {lang === 'hi' ? 'अखिल भारतीय आयुर्वेद संस्थान (AIIA)' : 'All India Institute of Ayurveda (AIIA)'}
            </p>
            <p className="text-[11px] font-semibold text-[#0B4C8C] hidden md:block">
              {lang === 'hi' ? 'आयुष्मान भारत डिजिटल मिशन (ABDM) • आयुष ओपीडी क्लिनिकल वर्कस्टेशन' : 'Ayushman Bharat Digital Mission (ABDM) • Ayush OPD Clinical Workstation'}
            </p>
          </div>
        </Link>

        {/* ================= TRUE GEOMETRIC CENTER BRANDING ================= */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-auto items-center justify-center z-10">
          {location.pathname.includes('physician') || location.pathname.includes('ayush-opd') ? (
            /* Ayush OPD Signature Branding on Physician Workstation */
            <Link to="/ayush-opd" className="flex flex-col items-center hover:opacity-90 transition-opacity">
              <svg
                key={`physician-${lang}`}
                viewBox="0 0 690 145"
                className="h-8 sm:h-9 md:h-10 lg:h-11 w-auto overflow-visible drop-shadow-[0_4px_12px_rgba(11,76,140,0.15)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {lang !== 'hi' ? (
                  <>
                    <defs>
                      <clipPath id="govtTopbarEnglishInk">
                        <motion.rect
                          x="50"
                          y="0"
                          width="590"
                          height="145"
                          initial={{ width: 0 }}
                          animate={{ width: 590 }}
                          transition={{ duration: 1.2, delay: 0.1, ease: [0.38, 0.04, 0.22, 1] }}
                        />
                      </clipPath>
                    </defs>

                    <g clipPath="url(#govtTopbarEnglishInk)">
                      <text
                        x="345"
                        y="92"
                        textAnchor="middle"
                        style={{ fontFamily: "'Fraunces', 'Cinzel', serif", fontWeight: 900, fontSize: '84px', letterSpacing: '2px' }}
                      >
                        <tspan fill="#0B4C8C">Ayush </tspan>
                        <tspan fill="#E2861E">OPD</tspan>
                      </text>
                    </g>
                  </>
                ) : (
                  <>
                    <defs>
                      <clipPath id="govtTopbarHindiInk">
                        <motion.rect
                          x="80"
                          y="0"
                          width="540"
                          height="145"
                          initial={{ width: 0 }}
                          animate={{ width: 540 }}
                          transition={{ duration: 1.2, delay: 0.1, ease: [0.38, 0.04, 0.22, 1] }}
                        />
                      </clipPath>
                    </defs>

                    <g clipPath="url(#govtTopbarHindiInk)">
                      <text
                        x="345"
                        y="90"
                        textAnchor="middle"
                        style={{ fontFamily: "'Kalam', 'Noto Sans Devanagari', sans-serif", fontWeight: 900, fontSize: '82px', letterSpacing: '1px' }}
                      >
                        <tspan fill="#0B4C8C">आयुष </tspan>
                        <tspan fill="#E2861E">ओपीडी</tspan>
                      </text>
                    </g>
                  </>
                )}

                {/* Underline */}
                <motion.path
                  d="M 140 115 C 240 108, 360 106, 480 112 C 515 114, 545 116, 560 108"
                  stroke="#E2861E"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.3, ease: [0.34, 1.25, 0.64, 1] }}
                />
              </svg>
              <span className="text-[9.5px] font-bold tracking-wider text-slate-500 uppercase -mt-0.5">
                {lang === 'hi' ? 'आयुष ओपीडी क्लिनिकल वर्कस्टेशन' : 'Ayush OPD Clinical Workstation'}
              </span>
            </Link>
          ) : (
            /* MediKiosk Branding on General / Kiosk / Other Pages */
            <Link to="/" className="flex flex-col items-center hover:opacity-90 transition-opacity">
              <svg
                key={`kiosk-${lang}`}
                viewBox="0 0 690 145"
                className="h-8 sm:h-9 md:h-10 lg:h-11 w-auto overflow-visible drop-shadow-[0_4px_12px_rgba(11,76,140,0.15)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {lang !== 'hi' ? (
                  <>
                    <motion.path
                      d={mediPath}
                      stroke="#0B4C8C"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={false}
                      animate={{ pathLength: 1, opacity: 1 }}
                    />
                    <circle cx="298" cy="40" r="6" fill="#E2861E" />
                    <motion.path
                      d={kioskPath}
                      stroke="#E2861E"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={false}
                      animate={{ pathLength: 1, opacity: 1 }}
                    />
                    <circle cx="456" cy="40" r="6" fill="#E2861E" />
                    <motion.path
                      d={underlinePath}
                      stroke="#E2861E"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={false}
                      animate={{ pathLength: 1, opacity: 1 }}
                    />
                    <circle cx="645" cy="112" r="3.5" fill="#E2861E" />
                  </>
                ) : (
                  <>
                    <defs>
                      <clipPath id="govtTopbarKioskHindiInk">
                        <motion.rect
                          x="80"
                          y="0"
                          width="540"
                          height="145"
                          initial={{ width: 0 }}
                          animate={{ width: 540 }}
                          transition={{ duration: 1.2, delay: 0.1, ease: [0.38, 0.04, 0.22, 1] }}
                        />
                      </clipPath>
                    </defs>

                    <g clipPath="url(#govtTopbarKioskHindiInk)">
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
                    <motion.path
                      d="M 120 115 C 220 108, 340 106, 460 112 C 505 114, 545 116, 570 108"
                      stroke="#E2861E"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={false}
                      animate={{ pathLength: 1, opacity: 1 }}
                    />
                    <circle cx="572" cy="108" r="3.5" fill="#E2861E" />
                  </>
                )}
              </svg>
              <span className="text-[9.5px] font-bold tracking-wider text-slate-500 uppercase -mt-0.5">
                {lang === 'hi' ? 'डिजिटल स्वास्थ्य कियोस्क प्रणाली' : 'Digital Health Kiosk System'}
              </span>
            </Link>
          )}
        </div>

        {/* Right: Action CTAs & Mobile Toggle */}
        <div className="flex items-center gap-2.5 z-20">
          <div className="hidden lg:flex items-center gap-2">
            <Button
              onClick={() => navigate('/kiosk')}
              className="bg-[#0B4C8C] hover:bg-[#08355F] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Monitor size={14} />
              <span>{lang === 'hi' ? 'रोगी मेडी-कियोस्क' : 'Patient MediKiosk'}</span>
            </Button>

            <Button
              onClick={() => navigate('/ayush-opd')}
              className="bg-[#E2861E] hover:bg-[#C2410C] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Stethoscope size={14} />
              <span>{lang === 'hi' ? 'चिकित्सक ओपीडी' : 'Physician OPD'}</span>
            </Button>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* 3. NATIONAL NAVY BLUE NAVIGATION BAR */}
      <nav className="bg-[#0B4C8C] text-white hidden lg:block shadow-xs">
        <div className="w-full px-4 sm:px-8 lg:px-12 flex items-center justify-between">
          <div className="flex items-center space-x-0.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap border-b-2 ${
                    isActive
                      ? 'bg-[#08355F] text-white border-[#E2861E] font-extrabold'
                      : 'text-blue-100 hover:bg-[#08355F]/60 hover:text-white border-transparent'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-[#F2941E]' : 'text-blue-200'} />
                  <span>{lang === 'hi' ? link.labelHi : link.labelEn}</span>
                  {link.badge && (
                    <Badge className={`text-[9px] px-1.5 py-0 font-extrabold ${
                      isActive ? 'bg-[#E2861E] text-white' : 'bg-[#0B2A4A] text-blue-100'
                    }`}>
                      {link.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 4. MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B4C8C] text-white p-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full p-2.5 rounded-lg text-xs font-bold flex items-center justify-between ${
                  isActive ? 'bg-[#08355F] text-white border-l-4 border-[#E2861E]' : 'text-blue-100 hover:bg-[#08355F]/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={15} className={isActive ? 'text-[#F2941E]' : 'text-blue-200'} />
                  <span>{lang === 'hi' ? link.labelHi : link.labelEn}</span>
                </div>
                {link.badge && (
                  <Badge className="bg-[#E2861E] text-white text-[10px]">
                    {link.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>
      )}

    </header>
  );
}
