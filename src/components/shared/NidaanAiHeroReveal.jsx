import React, { useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function NidaanAiHeroReveal({ className = '' }) {
  const shouldReduceMotion = useReducedMotion();
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.warn('Autoplay prevented or interrupted:', err);
      });
    }
  }, []);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none pt-1 pb-3 px-4 ${className}`}>
      
      {/* HEROIC NIDAAN AI ANIMATED VIDEO REVEAL */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1]
        }}
        className="relative z-10 w-full max-w-[320px] sm:max-w-[440px] md:max-w-[520px] lg:max-w-[580px] flex flex-col items-center justify-center cursor-default"
      >
        <div className="relative w-full overflow-hidden flex items-center justify-center">
          <video
            ref={videoRef}
            src="/nidaanai.mp4"
            poster="/nidaan_ai_full.png"
            autoPlay
            muted
            playsInline
            loop={false}
            onEnded={() => {
              if (videoRef.current) {
                videoRef.current.pause();
              }
            }}
            className="w-full h-auto object-contain block mix-blend-multiply"
          />
        </div>
      </motion.div>

    </div>
  );
}
