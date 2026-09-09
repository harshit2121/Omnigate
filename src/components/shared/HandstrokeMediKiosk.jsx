import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * HandstrokeMediKiosk - Continuous Connected Cursive Signature Engine
 * 
 * Features:
 * - Fluid connected cursive ligatures (M -> e -> d -> i, K -> i -> o -> s -> k)
 * - Zero letter collisions, zero overlapping, perfect natural calligraphy rhythm
 * - Real vector stroke drawing animation (pathLength: [0, 1])
 * - Vibrant duo-tone: Clinical Royal Blue (#0B4C8C) + Warm Ayurvedic Saffron (#E2861E)
 * - Underline swoosh flourish with terminal golden star sparkle
 */

export default function HandstrokeMediKiosk({ className = "", currentLang = "en" }) {
  const shouldReduceMotion = useReducedMotion();
  const [playCount, setPlayCount] = useState(0);
  const isHi = currentLang === "hi";

  // Play exactly twice (initial play + 1 replay after a brief resting pause)
  useEffect(() => {
    if (shouldReduceMotion) return;
    if (playCount >= 1) return; // Stop after 2nd play completes

    const timer = setTimeout(() => {
      setPlayCount((prev) => prev + 1);
    }, 5400);

    return () => clearTimeout(timer);
  }, [playCount, shouldReduceMotion]);

  // English Cursive Paths
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
    <div className={`relative flex w-full flex-col items-center justify-center py-4 select-none ${className}`}>
      
      {/* Background Soft Radiant Bloom */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className="w-[85%] max-w-2xl h-32 bg-gradient-to-r from-blue-500/10 via-amber-500/15 to-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* SVG Canvas for Continuous Cursive Handwriting Strokes */}
      <div className="w-full max-w-lg sm:max-w-2xl md:max-w-3xl lg:max-w-4xl px-2 flex justify-center">
        <svg
          key={`${currentLang}-${playCount}`}
          viewBox="0 0 690 145"
          className="w-full h-auto max-h-40 sm:max-h-52 md:max-h-60 overflow-visible drop-shadow-[0_8px_20px_rgba(11,76,140,0.18)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {!isHi ? (
            /* ================= ENGLISH HANDWRITTEN CURSIVE SIGNATURE (MediKiosk) ================= */
            <>
              {/* "Medi" */}
              <motion.path
                d={mediPath}
                stroke="#0B4C8C"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.4, delay: 0.1, ease: [0.38, 0.04, 0.22, 1] }}
              />

              {/* 'i' Dot for Medi */}
              <motion.circle
                cx="298"
                cy="40"
                r="5.5"
                fill="#E2861E"
                initial={shouldReduceMotion ? false : { scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.45, ease: "backOut" }}
              />

              {/* "Kiosk" */}
              <motion.path
                d={kioskPath}
                stroke="#E2861E"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 1.55, ease: [0.38, 0.04, 0.22, 1] }}
              />

              {/* 'i' Dot for Kiosk */}
              <motion.circle
                cx="456"
                cy="40"
                r="5.5"
                fill="#E2861E"
                initial={shouldReduceMotion ? false : { scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 3.0, ease: "backOut" }}
              />

              {/* Underline Flourish */}
              <motion.path
                d={underlinePath}
                stroke="#E2861E"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.9, delay: 3.1, ease: [0.34, 1.25, 0.64, 1] }}
              />

              {/* Terminal Star Sparkle */}
              <motion.circle
                cx="645"
                cy="112"
                r="3.5"
                fill="#E2861E"
                initial={shouldReduceMotion ? false : { scale: 0, opacity: 0 }}
                animate={{ scale: 1.35, opacity: 1 }}
                transition={{ duration: 0.4, delay: 3.7, ease: "backOut" }}
              />
            </>
          ) : (
            /* ================= AUTHENTIC DEVANAGARI HINDI CALLIGRAPHY ================= */
            <>
              <defs>
                <clipPath id={`hindiInkReveal-${playCount}`}>
                  <motion.rect
                    x="100"
                    y="0"
                    width="500"
                    height="145"
                    initial={shouldReduceMotion ? false : { width: 0 }}
                    animate={{ width: 500 }}
                    transition={{ duration: 1.6, delay: 0.1, ease: [0.38, 0.04, 0.22, 1] }}
                  />
                </clipPath>
              </defs>

              {/* Real-time Ink Writing Reveal */}
              <g clipPath={`url(#hindiInkReveal-${playCount})`}>
                <text
                  x="345"
                  y="85"
                  textAnchor="middle"
                  style={{ fontFamily: "'Kalam', 'Caveat', cursive", fontWeight: 700, fontSize: '88px', letterSpacing: '1px' }}
                >
                  <tspan fill="#0B4C8C">मेडी</tspan>
                  <tspan fill="#E2861E">कियोस्क</tspan>
                </text>
              </g>

              {/* Animated Calligraphy Writing Nib / Sparkle */}
              <motion.g
                initial={shouldReduceMotion ? false : { x: 100, opacity: 0 }}
                animate={{ 
                  x: [100, 100, 580], 
                  opacity: [0, 1, 1, 0] 
                }}
                transition={{ 
                  duration: 1.6, 
                  delay: 0.1, 
                  ease: [0.38, 0.04, 0.22, 1],
                  times: [0, 0.05, 0.95, 1]
                }}
              >
                <circle cx="0" cy="50" r="4" fill="#E2861E" filter="drop-shadow(0 0 6px #E2861E)" />
                <circle cx="0" cy="50" r="2" fill="#FFFFFF" />
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
                transition={{ duration: 0.9, delay: 1.7, ease: [0.34, 1.25, 0.64, 1] }}
              />

              {/* Terminal Star Sparkle */}
              <motion.circle
                cx="572"
                cy="108"
                r="3.5"
                fill="#E2861E"
                initial={shouldReduceMotion ? false : { scale: 0, opacity: 0 }}
                animate={{ scale: 1.35, opacity: 1 }}
                transition={{ duration: 0.4, delay: 2.5, ease: "backOut" }}
              />
            </>
          )}

        </svg>
      </div>

    </div>
  );
}
