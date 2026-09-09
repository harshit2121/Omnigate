import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';
import voiceAssistant from '../../services/voiceAssistant';

const KIOSK_VIDEOS = [
  {
    src: '/Generate_an_video_for_Medikios.mp4',
    titleHi: 'डिजिटल ओपीडी पंजीकरण एवं केस-टेकिंग प्रणाली',
    titleEn: 'Digital OPD Intake & Case-Taking Terminal'
  },
  {
    src: '/Its_showing_the_Medikiosk_i_ne.mp4',
    titleHi: 'आयुष ओपीडी पंजीकरण व नैदानिक केस-टेकिंग',
    titleEn: 'Ayush OPD Patient Self-Service Terminal'
  }
];

const LANG_TOGGLE = [
  { code: 'hi', native: 'हिंदी' },
  { code: 'en', native: 'English' }
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const listener = (e) => setReduced(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);
  return reduced;
}

export default function KioskAttractMode({ onStart, currentLang = 'hi', setCurrentLang, voiceEnabled, setVoiceEnabled }) {
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);
  const [clock, setClock] = useState(new Date());
  const videoRef = useRef(null);
  const reduceMotion = usePrefersReducedMotion();

  // Seamless switch to next video when current video ends
  const handleVideoEnded = () => {
    setCurrentVideoIdx((prev) => (prev + 1) % KIOSK_VIDEOS.length);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play();
        }
      });
    }
  }, [currentVideoIdx]);

  // Kiosk-realism touch: a live clock in the corner, like real terminal hardware.
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  const handleTapToRegister = () => {
    voiceAssistant.playAudioCue('beep');
    if (voiceEnabled) {
      voiceAssistant.speak(
        currentLang === 'hi'
          ? 'कृपया अपनी भाषा चुनें।'
          : 'Please select your preferred language.',
        { lang: currentLang === 'hi' ? 'hi-IN' : 'en-IN' }
      );
    }
    onStart();
  };

  const handleLangToggle = (code) => {
    voiceAssistant.playAudioCue('beep');
    setCurrentLang?.(code);
  };

  const timeStr = clock.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const video = KIOSK_VIDEOS[currentVideoIdx];

  // Continuous unbroken cursive paths for KioskAttractMode MediKiosk
  const mediPath = "M 55 95 C 55 52, 62 28, 76 28 C 86 28, 92 48, 98 88 L 104 95 C 112 52, 122 28, 134 28 C 145 28, 148 50, 150 78 L 152 95 C 158 97, 170 85, 180 68 C 188 52, 200 52, 200 66 C 200 82, 184 96, 172 96 C 185 96, 204 94, 218 82 C 226 75, 234 62, 246 62 C 258 62, 260 76, 260 95 L 260 22 L 260 95 C 267 97, 278 90, 290 76 L 298 62 L 298 95 C 302 97, 312 95, 322 86";
  const kioskPath = "M 360 22 L 360 95 M 360 32 C 380 18, 400 22, 392 40 C 382 58, 366 68, 385 68 C 400 68, 415 86, 424 95 C 430 97, 440 88, 450 75 L 456 62 L 456 95 C 464 97, 478 97, 488 86 C 498 75, 498 60, 485 60 C 470 60, 466 75, 475 88 C 482 96, 495 94, 506 78 C 514 68, 523 62, 532 62 C 541 62, 542 71, 534 78 C 525 85, 521 89, 528 95 C 535 99, 546 94, 556 82 L 565 62 C 572 44, 577 22, 584 22 C 590 22, 586 44, 582 68 L 579 95 C 586 82, 597 62, 608 62 C 615 62, 613 74, 604 84 C 597 91, 606 95, 616 94 C 628 90, 640 82, 652 70";
  const underlinePath = "M 35 125 C 180 114, 340 112, 480 118 C 540 120, 600 124, 645 112 C 655 110, 648 104, 634 108 C 600 114, 520 124, 440 128";

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none flex flex-col justify-end p-6 sm:p-10 lg:p-14 font-sans">

      {/* 1. FULL-SCREEN BACKGROUND VIDEO LOOP */}
      <video
        ref={videoRef}
        key={video.src}
        src={video.src}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnded}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Cinematic Vignette / Deep Glass Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/10 z-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-transparent z-10 pointer-events-none"></div>

      {/* 2. TOP STATUS BAR */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-start justify-between p-6 sm:p-10 lg:p-14">
        
        {/* Left Side: Cursive MediKiosk Handstroke in Frosted Pill */}
        <div className="flex items-center gap-3">
          <div className="bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-white/40 shadow-2xl flex items-center">
            <svg
              key={currentLang}
              viewBox="0 0 690 145"
              className="h-7 sm:h-8 md:h-9 w-auto overflow-visible drop-shadow-xs"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {currentLang !== 'hi' ? (
                <>
                  <motion.path
                    d={mediPath}
                    stroke="#0B4C8C"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.3, delay: 0.2, ease: [0.38, 0.04, 0.22, 1] }}
                  />
                  <motion.circle
                    cx="298"
                    cy="40"
                    r="5.5"
                    fill="#E2861E"
                    initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.35, delay: 1.45, ease: "backOut" }}
                  />
                  <motion.path
                    d={kioskPath}
                    stroke="#E2861E"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.4, delay: 1.55, ease: [0.38, 0.04, 0.22, 1] }}
                  />
                  <motion.circle
                    cx="456"
                    cy="40"
                    r="5.5"
                    fill="#E2861E"
                    initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.35, delay: 2.9, ease: "backOut" }}
                  />
                </>
              ) : (
                <>
                  <defs>
                    <clipPath id="kioskAttractHindiInk">
                      <motion.rect
                        x="100"
                        y="0"
                        width="500"
                        height="145"
                        initial={reduceMotion ? false : { width: 0 }}
                        animate={{ width: 500 }}
                        transition={{ duration: 1.4, delay: 0.2, ease: [0.38, 0.04, 0.22, 1] }}
                      />
                    </clipPath>
                  </defs>

                  {/* Real-time Ink Writing Reveal */}
                  <g clipPath="url(#kioskAttractHindiInk)">
                    <text
                      x="345"
                      y="88"
                      textAnchor="middle"
                      style={{ fontFamily: "'Kalam', 'Caveat', cursive", fontWeight: 700, fontSize: '88px', letterSpacing: '1px' }}
                    >
                      <tspan fill="#0B4C8C">मेडी</tspan>
                      <tspan fill="#E2861E">कियोस्क</tspan>
                    </text>
                  </g>

                  {/* Animated Calligraphy Writing Nib */}
                  <motion.g
                    initial={reduceMotion ? false : { x: 100, opacity: 0 }}
                    animate={{ 
                      x: [100, 100, 580], 
                      opacity: [0, 1, 1, 0] 
                    }}
                    transition={{ 
                      duration: 1.4, 
                      delay: 0.2, 
                      ease: [0.38, 0.04, 0.22, 1],
                      times: [0, 0.05, 0.95, 1]
                    }}
                  >
                    <circle cx="0" cy="50" r="4" fill="#E2861E" filter="drop-shadow(0 0 5px #E2861E)" />
                    <circle cx="0" cy="50" r="2" fill="#FFFFFF" />
                  </motion.g>
                </>
              )}

              <motion.path
                d={currentLang !== 'hi' ? underlinePath : "M 120 115 C 220 108, 340 106, 460 112 C 505 114, 545 116, 570 108"}
                stroke="#E2861E"
                strokeWidth={currentLang !== 'hi' ? "4" : "5"}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: currentLang !== 'hi' ? 3.0 : 1.6, ease: [0.34, 1.25, 0.64, 1] }}
              />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur-sm">
            {LANG_TOGGLE.map((l) => (
              <button
                key={l.code}
                onClick={() => handleLangToggle(l.code)}
                className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                  currentLang === l.code ? 'bg-[#F2941E] text-[#1A1200]' : 'text-white/80 hover:text-white'
                }`}
              >
                {l.native}
              </button>
            ))}
          </div>

          <span className="text-white/80 text-[14px] font-medium tabular-nums">{timeStr}</span>

          <button
            onClick={() => setVoiceEnabled?.(!voiceEnabled)}
            aria-label={voiceEnabled ? 'Mute voice guidance' : 'Enable voice guidance'}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            {voiceEnabled ? <Volume2 className="h-4.5 w-4.5" /> : <VolumeX className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      {/* 3. REAL PHYSICAL HOSPITAL KIOSK TOUCH ACTION BAR */}
      <div className="relative z-20 w-full max-w-2xl mx-auto flex flex-col items-center">

        {/* Solid Authentic Touch Target Button — now built to feel like live hardware */}
        <motion.button
          onClick={handleTapToRegister}
          whileTap={{ scale: 0.97 }}
          animate={
            reduceMotion
              ? {}
              : {
                  boxShadow: [
                    '0 0 0 0 rgba(242,148,30,0.0), 0 20px 60px -10px rgba(242,148,30,0.45)',
                    '0 0 0 14px rgba(242,148,30,0.12), 0 20px 60px -10px rgba(242,148,30,0.7)',
                    '0 0 0 0 rgba(242,148,30,0.0), 0 20px 60px -10px rgba(242,148,30,0.45)',
                  ],
                }
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-full overflow-hidden bg-[#0B4C8C] hover:bg-[#08355F] text-white rounded-2xl transition-colors duration-150 p-6 sm:p-8 flex items-center justify-between border-4 border-[#F2941E] cursor-pointer"
        >
          {/* sheen sweep — a soft highlight that glides across the surface */}
          {!reduceMotion && (
            <motion.div
              className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-[-20deg]"
              animate={{ left: ['-40%', '120%'] }}
              transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.4, ease: 'easeInOut' }}
            />
          )}

          <div className="relative text-left flex flex-col gap-0.5">
            <span className="text-sm sm:text-base font-bold text-[#F2941E] uppercase tracking-wider">
              {currentLang === 'hi' ? 'ओपीडी पंजीकरण' : 'OPD Registration'}
            </span>
            <div
              className="text-3xl sm:text-5xl font-black tracking-tight leading-tight py-1"
              style={{ fontFamily: currentLang === 'hi' ? "'Mukta', sans-serif" : "'Fraunces', serif" }}
            >
              {currentLang === 'hi' ? 'पंजीकरण शुरू करें' : 'Start Check-in'}
            </div>
            <div
              className="text-base sm:text-xl font-medium text-white/90 tracking-wide"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {currentLang === 'hi' ? 'स्क्रीन पर स्पर्श करके आगे बढ़ें' : 'Tap here to begin self-intake'}
            </div>
          </div>

          <motion.div
            animate={reduceMotion ? {} : { x: [0, 8, 0] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-16 h-16 sm:w-20 sm:h-20 bg-[#F2941E] text-white rounded-xl flex items-center justify-center font-black shadow-md shrink-0 ml-4"
          >
            <ArrowRight size={38} strokeWidth={3} />
          </motion.div>
        </motion.button>

        <p className="text-white/80 text-xs sm:text-sm font-medium mt-3 tracking-wide drop-shadow">
          {currentLang === 'hi' ? 'स्क्रीन पर कहीं भी स्पर्श करें' : 'Touch anywhere on screen to start'}
        </p>

      </div>

    </div>
  );
}
