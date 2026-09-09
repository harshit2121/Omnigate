import { Heart, Building2, ShieldCheck, PhoneCall, Globe, ExternalLink, Stethoscope, Activity, FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0B132B] text-white mt-auto border-t-4 border-[#EA580C] relative overflow-hidden font-sans">
      
      {/* MAIN FOOTER BODY */}
      <div className="w-full px-4 sm:px-8 lg:px-12 py-10 sm:py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mb-10 text-xs text-slate-300">
          
          {/* Column 1: Ministry Emblem & Institute Details (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-start gap-4">
              
              {/* High-Contrast White Background Badge for SVG Emblem */}
              <div className="bg-white p-2.5 rounded-2xl shadow-md border-2 border-slate-200 flex items-center justify-center shrink-0">
                <img 
                  src="/Emblem_of_India.svg" 
                  alt="National Emblem of India" 
                  className="h-14 sm:h-16 w-auto object-contain" 
                />
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 bg-[#1E40AF]/40 border border-blue-400/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-blue-200">
                  <span>भारत सरकार • Government of India</span>
                </div>
                <h5 className="font-black text-white text-base sm:text-lg leading-tight">
                  अखिल भारतीय आयुर्वेद संस्थान (AIIA)
                </h5>
                <p className="text-xs font-bold text-[#EA580C]">
                  All India Institute of Ayurveda • Ministry of Ayush
                </p>
                <p className="text-[11px] text-slate-400">
                  Gautampuri, Sarita Vihar, Mathura Road, New Delhi, Delhi - 110076
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-xl font-medium pt-1">
              <b>MediKiosk</b> is the digital clinical intake & case-taking kiosk terminal deployed for Ayush OPD departments. Generates bilingual clinical case sheets, Prakriti dosha assessments, and OCR prescription conversions.
            </p>
          </div>

          {/* Column 2: Clinical Portals (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="w-1.5 h-3.5 bg-[#EA580C] rounded-full"></span>
              <span>Clinical Modules & Portals</span>
            </h5>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link to="/kiosk" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <Building2 size={14} className="text-[#EA580C]" />
                  <span>Patient MediKiosk Self-Service</span>
                </Link>
              </li>
              <li>
                <Link to="/ayush-opd" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <Stethoscope size={14} className="text-[#1E40AF]" />
                  <span>Physician OPD Consultation Room</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <Activity size={14} className="text-emerald-400" />
                  <span>OmniGate HMS Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/patient-records" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <FileText size={14} className="text-purple-400" />
                  <span>Patient Health Records (EHR)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: National Portals & Standards (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="w-1.5 h-3.5 bg-blue-500 rounded-full"></span>
              <span>National Health Links</span>
            </h5>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a href="https://ayush.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ExternalLink size={12} className="text-slate-400" />
                  <span>Ministry of Ayush</span>
                </a>
              </li>
              <li>
                <a href="https://aiia.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ExternalLink size={12} className="text-slate-400" />
                  <span>AIIA Official Portal</span>
                </a>
              </li>
              <li>
                <a href="https://abdm.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ExternalLink size={12} className="text-slate-400" />
                  <span>ABDM Sandbox (NHA)</span>
                </a>
              </li>
              <li>
                <a href="https://nhp.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ExternalLink size={12} className="text-slate-400" />
                  <span>National Health Portal</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: 24x7 Helplines & Emergency (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="w-1.5 h-3.5 bg-emerald-500 rounded-full"></span>
              <span>24x7 Helplines</span>
            </h5>
            <div className="space-y-2.5">
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
                  <PhoneCall size={13} />
                  <span>Ayush Toll-Free:</span>
                </div>
                <p className="text-white font-black text-sm tracking-wide">14477</p>
                <p className="text-[10px] text-slate-400">1800-11-22-02 (Toll Free)</p>
              </div>

              <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 space-y-0.5">
                <p className="text-[10px] text-slate-400 font-semibold">National Health Authority:</p>
                <p className="text-white font-bold text-xs">14415</p>
              </div>
            </div>
          </div>

        </div>

        {/* 3. BOTTOM INTELLECTUAL PROPERTY & CITIZEN CHARTER BAR */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span>© {new Date().getFullYear()} <b>Ministry of Ayush</b> • All India Institute of Ayurveda (AIIA). All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="hover:text-white transition-colors cursor-pointer">Terms & Conditions</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy (DPDP 2023)</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">Hyperlinking Policy</span>
          </div>
        </div>

      </div>

    </footer>
  );
}
