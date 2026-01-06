import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Activity, ChevronRight, Sparkles, Shield, Brain, 
  Zap, Target, Heart, Award, TrendingUp, CheckCircle2,
  Rocket, Star, Lock
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export default function Welcome() {
  const navigate = useNavigate();
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [featureIndex, setFeatureIndex] = useState(0);

  // Bilingual texts - English and Hindi alternating
  const texts = [
    { text: 'Welcome to', lang: 'en' },
    { text: 'स्वागतम्', lang: 'hi' },
  ];

  // Rotating features with icons
  const features = [
    { text: 'AI-Powered Clinical Insights', icon: Brain },
    { text: 'Real-time Patient Monitoring', icon: Activity },
    { text: 'Smart Medication Management', icon: Zap },
    { text: 'Automated Drug Interaction Detection Possible', icon: Shield },
    { text: 'Advanced Lab Analysis', icon: Target },
    { text: 'Predictive Risk Assessment', icon: TrendingUp },
    { text: 'Pending Compliant', icon: Lock },
    { text: 'IoT-Enabled Bedside Guardian', icon: Heart },
    { text: 'Clinical Decision Support', icon: CheckCircle2 },
    { text: 'Multi-lingual Support', icon: Star },
  ];

  // Typewriter effect for welcome text
  useEffect(() => {
    const currentText = texts[textIndex].text;
    const typingSpeed = isDeleting ? 50 : 150;
    const pauseDuration = isDeleting ? 500 : 2000;

    if (!isDeleting && displayText === currentText) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayText((prev) => {
        if (isDeleting) {
          return currentText.substring(0, prev.length - 1);
        }
        return currentText.substring(0, prev.length + 1);
      });
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, textIndex, isDeleting]);

  // Rotate features every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFeatureIndex((prev) => (prev + 1) % features.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 overflow-hidden relative">
      
      {/* Animated Moving Light Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0, -100, 0],
            y: [0, -100, -200, -100, 0],
            scale: [1, 1.2, 1, 0.8, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: '10%', left: '70%' }}
        />
        
        <motion.div
          className="absolute w-[500px] h-[500px] bg-gradient-to-r from-purple-400/25 to-pink-400/25 rounded-full blur-3xl"
          animate={{
            x: [0, -150, 0, 150, 0],
            y: [0, 100, 0, -50, 0],
            scale: [1, 0.8, 1.2, 1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          style={{ bottom: '10%', left: '5%' }}
        />
        
        <motion.div
          className="absolute w-[450px] h-[450px] bg-gradient-to-r from-indigo-400/30 to-blue-400/30 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0, 80, 0],
            y: [0, 150, 0, -150, 0],
            scale: [1, 1.3, 1, 1.1, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        />
        
        <motion.div
          className="absolute w-[380px] h-[380px] bg-gradient-to-r from-cyan-400/20 to-teal-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, 120, 0, -120, 0],
            y: [0, -80, 0, 80, 0],
            scale: [1, 1.1, 1, 0.9, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          style={{ top: '20%', left: '10%' }}
        />
        
        <motion.div
          className="absolute w-[420px] h-[420px] bg-gradient-to-r from-rose-400/25 to-orange-400/25 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0, 100, 0],
            y: [0, 120, 0, -120, 0],
            scale: [1, 0.9, 1.2, 1, 1],
          }}
          transition={{
            duration: 23,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 7,
          }}
          style={{ bottom: '20%', right: '10%' }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Header */}
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="p-4 sm:p-6"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 sm:p-3 rounded-xl shadow-lg"
                animate={{
                  boxShadow: [
                    '0 10px 30px rgba(59, 130, 246, 0.3)',
                    '0 10px 40px rgba(99, 102, 241, 0.5)',
                    '0 10px 30px rgba(59, 130, 246, 0.3)',
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Activity className="text-white" size={28} />
              </motion.div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">OmniGate</h1>
                <p className="text-xs sm:text-sm text-slate-600">IoT Hospital Management</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="border-2 hover:bg-white/80 backdrop-blur-sm transition-all"
            >
              About
            </Button>
          </div>
        </motion.header>

        {/* Main Content - Centered */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
          <div className="max-w-5xl w-full">
            
            {/* Hero Section */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              {/* Certification Badges */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-3 mb-8"
              >
                <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 text-xs flex items-center gap-2 shadow-lg">
                  <Shield size={14} />
                  Self Compliant
                </Badge>
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 text-xs flex items-center gap-2 shadow-lg">
                  <Award size={14} />
                  Self Accredited
                </Badge>
                <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 text-xs flex items-center gap-2 shadow-lg">
                  <Brain size={14} />
                  AI-Powered
                </Badge>
              </motion.div>

              {/* Main Heading with Bilingual Typewriter */}
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6"
              >
                <motion.span 
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent inline-block"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    backgroundSize: '200% 200%',
                  }}
                >
                  {displayText}
                  <motion.span
                    className="inline-block w-1 h-14 sm:h-20 md:h-24 bg-gradient-to-r from-blue-600 to-indigo-600 ml-2"
                    animate={{
                      opacity: [1, 0, 1],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.span>
                <br />
                <span className="text-slate-900">OmniGate Hospital</span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto px-4 mb-8"
              >
                Next-Generation Hospital Management System
                <br className="hidden sm:block" />
                <span className="text-slate-500 text-base">Powered by IoT, AI & Cloud Technology</span>
              </motion.p>

              {/* Rotating Feature Tagline */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-12"
              >
                <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-2xl border-2 border-white/50 min-h-[80px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={featureIndex}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex items-center gap-3"
                    >
                      <motion.div
                        className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-xl"
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        {(() => {
                          const Icon = features[featureIndex].icon;
                          return <Icon className="text-blue-600" size={24} />;
                        })()}
                      </motion.div>
                      <div className="text-left">
                        <p className="text-xs text-slate-500 font-semibold mb-1">Featured Capability</p>
                        <p className="text-lg font-bold text-slate-900">
                          {features[featureIndex].text}
                        </p>
                      </div>
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Sparkles className="text-yellow-500" size={20} />
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Get Started Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-12 py-8 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
                >
                  <Rocket size={28} className="mr-3 group-hover:animate-bounce" />
                  Get Started
                  <ChevronRight size={28} className="ml-3 group-hover:translate-x-2 transition-transform" />
                </Button>
                
                <p className="text-sm text-slate-500 mt-4">
                  No registration required • Instant access
                </p>
              </motion.div>

              {/* Feature Grid - Compact */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
              >
                <FeatureCard icon={Activity} text="Real-time Monitoring" color="from-blue-500 to-cyan-500" />
                <FeatureCard icon={Brain} text="AI Clinical Insights" color="from-purple-500 to-pink-500" />
                <FeatureCard icon={Shield} text="Drug Safety" color="from-green-500 to-emerald-500" />
                <FeatureCard icon={Target} text="Lab Analysis" color="from-orange-500 to-red-500" />
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="mt-12 flex items-center justify-center gap-8 text-slate-600"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-green-600" size={20} />
                  <span className="text-sm font-semibold">Secure & Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-green-600" size={20} />
                  <span className="text-sm font-semibold">24/7 Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-green-600" size={20} />
                  <span className="text-sm font-semibold">Cloud-Based</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="p-6 text-center text-slate-500 text-sm"
        >
          <p>© 2026 OmniGate Hospital Management System • Made in India 🇮🇳</p>
        </motion.footer>
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon: Icon, text, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg hover:shadow-2xl transition-all border border-white/50"
    >
      <div className={`bg-gradient-to-br ${color} w-12 h-12 rounded-lg flex items-center justify-center mb-3 mx-auto`}>
        <Icon className="text-white" size={24} />
      </div>
      <p className="text-xs font-semibold text-slate-700">{text}</p>
    </motion.div>
  );
}
