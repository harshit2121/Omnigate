import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white py-8 mt-auto border-t-4 border-blue-500 shadow-2xl relative overflow-hidden">
      
      {/* Animated Background Blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-6">
          
          {/* Left: Made with Love in India */}
          <div className="flex flex-col items-center lg:items-start gap-3">
            <div className="flex items-center gap-3 text-base sm:text-lg">
              <span className="text-slate-300 font-medium">Made with</span>
              <Heart className="text-red-500 fill-red-500 animate-pulse" size={22} />
              <span className="text-slate-300 font-medium">in</span>
              
              {/* Indian Flag SVG with Ashoka Chakra */}
              <div className="relative group cursor-pointer">
                <svg 
                  width="48" 
                  height="32" 
                  viewBox="0 0 48 32" 
                  className="rounded shadow-lg hover:shadow-xl transition-all hover:scale-110 transform duration-300"
                >
                  {/* Saffron Band */}
                  <rect width="48" height="10.67" fill="#FF9933"/>
                  
                  {/* White Band */}
                  <rect y="10.67" width="48" height="10.67" fill="#FFFFFF"/>
                  
                  {/* Green Band */}
                  <rect y="21.33" width="48" height="10.67" fill="#138808"/>
                  
                  {/* Ashoka Chakra - Outer Circle */}
                  <circle cx="24" cy="16" r="4.5" fill="none" stroke="#000080" strokeWidth="0.5"/>
                  
                  {/* Ashoka Chakra - Inner Circle */}
                  <circle cx="24" cy="16" r="3" fill="none" stroke="#000080" strokeWidth="0.4"/>
                  
                  {/* Ashoka Chakra - 24 Spokes */}
                  {[...Array(24)].map((_, i) => {
                    const angle = (i * 15 * Math.PI) / 180;
                    const x1 = 24 + 3 * Math.cos(angle);
                    const y1 = 16 + 3 * Math.sin(angle);
                    const x2 = 24 + 4.5 * Math.cos(angle);
                    const y2 = 16 + 4.5 * Math.sin(angle);
                    return (
                      <line 
                        key={i} 
                        x1={x1} 
                        y1={y1} 
                        x2={x2} 
                        y2={y2} 
                        stroke="#000080" 
                        strokeWidth="0.4"
                      />
                    );
                  })}
                  
                  {/* Center dot */}
                  <circle cx="24" cy="16" r="0.8" fill="#000080"/>
                </svg>
                
                {/* Tooltip */}
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-slate-700 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none">
                  Proudly Made in India 🇮🇳
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-700 rotate-45"></div>
                </div>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-400 text-center lg:text-left">
              Empowering healthcare with IoT technology
            </p>
          </div>

          {/* Center: Creator Info */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-col sm:flex-row items-center gap-2 text-sm sm:text-base">
              <span className="text-slate-400">Created by</span>
              <a 
                href="https://github.com/harshitpamar" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-bold text-blue-400 hover:text-blue-300 transition-colors hover:underline flex items-center gap-2"
              >
                {/* GitHub Icon SVG */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                Harshit Parmar
              </a>
            </div>
            
            {/* Social Links SVG */}
            <div className="flex items-center gap-4">
              {/* GitHub */}
              <a 
                href="https://github.com/harshit21pamar" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-all hover:scale-110 transform"
                aria-label="GitHub"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              
              {/* LinkedIn */}
              <a 
                href="https://linkedin.com/in/harshitpamar" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-400 transition-all hover:scale-110 transform"
                aria-label="LinkedIn"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              
              {/* Email */}
              <a 
                href="mailto:harshit@example.com" 
                className="text-slate-400 hover:text-red-400 transition-all hover:scale-110 transform"
                aria-label="Email"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right: IVAO Logo SVG */}
          <div className="flex flex-col items-center lg:items-end gap-3">
            <span className="text-xs sm:text-sm text-slate-400">In association with</span>
            
            <a 
              href="https://in.ivao.aero" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative"
            >
              {/* IVAO Logo Badge */}
              <div className="bg-white rounded-xl p-3 shadow-lg hover:shadow-2xl transition-all hover:scale-110 transform duration-300">
                <svg width="120" height="48" viewBox="0 0 120 48" className="drop-shadow-md">
                  {/* Background Shield */}
                  <defs>
                    <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#0066CC"/>
                      <stop offset="100%" stopColor="#004999"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Shield Shape */}
                  <path 
                    d="M60 4 L20 12 L20 24 C20 38 28 42 60 44 C92 42 100 38 100 24 L100 12 Z" 
                    fill="url(#shieldGradient)"
                    stroke="#003366"
                    strokeWidth="1"
                  />
                  
                  {/* IVAO Text */}
                  <text 
                    x="60" 
                    y="32" 
                    fill="white" 
                    fontSize="20" 
                    fontWeight="bold" 
                    fontFamily="Arial, sans-serif" 
                    textAnchor="middle"
                    letterSpacing="1"
                  >
                    IVAO
                  </text>
                  
                  {/* Airplane Icon */}
                  <g transform="translate(60, 12)">
                    {/* Fuselage */}
                    <path 
                      d="M0,-4 L-1,-2 L-1,2 L0,4 L1,2 L1,-2 Z" 
                      fill="white"
                    />
                    {/* Main Wings */}
                    <path 
                      d="M-8,-1 L0,-2 L0,0 L-8,1 Z" 
                      fill="white"
                    />
                    <path 
                      d="M8,-1 L0,-2 L0,0 L8,1 Z" 
                      fill="white"
                    />
                    {/* Tail */}
                    <path 
                      d="M-3,2 L0,2 L0,5 L-3,4 Z" 
                      fill="white"
                    />
                    <path 
                      d="M3,2 L0,2 L0,5 L3,4 Z" 
                      fill="white"
                    />
                    {/* Vertical Stabilizer */}
                    <path 
                      d="M-0.5,4 L0.5,4 L0.5,7 L-0.5,7 Z" 
                      fill="white"
                    />
                  </g>
                </svg>
              </div>
              
              {/* Tooltip */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-slate-700 text-white text-xs px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none z-50">
                International Virtual Aviation Organisation
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-700 rotate-45"></div>
              </div>
            </a>
            
            <p className="text-xs text-slate-400 text-center lg:text-right">
              Virtual Aviation Network
            </p>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-slate-700 mb-4"></div>

        {/* Bottom: Copyright & Project Info */}
        <div className="text-center space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-slate-400">
            <span>© {new Date().getFullYear()}</span>
            <span className="font-bold text-blue-400">OmniGate Hospital</span>
            <span className="hidden sm:inline">•</span>
            <span>IoT-Enabled Bedside Guardian</span>
            <span className="hidden sm:inline">•</span>
            <span>All Rights Reserved</span>
          </div>
          
          <p className="text-xs text-slate-500">
            Built by Team OmniGate • Made for Healthcare Excellence
          </p>
        </div>
      </div>
    </footer>
  );
}
