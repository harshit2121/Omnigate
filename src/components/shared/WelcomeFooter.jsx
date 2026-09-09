import { Link } from 'react-router-dom';
import { 
  Heart, Building2, PhoneCall, ExternalLink, Stethoscope, 
  Activity, FileText, Monitor, CheckCircle2, Sparkles, ArrowRight,
  Shield, Globe, Award
} from 'lucide-react';

export default function WelcomeFooter({ currentLang }) {
  const isHi = currentLang === 'hi';

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#08172E] text-white border-t-4 border-[#E2861E] relative overflow-hidden font-sans">
      
      {/* BACKGROUND ACCENTS */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-[#0B4C8C]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-[#E2861E]/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP CALLOUT BANNER */}
      <div className="border-b border-slate-800 bg-[#0B2040]/70 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E2861E]/20 text-[#E2861E] flex items-center justify-center font-bold">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-extrabold text-white">
                {isHi ? 'आयुष स्वास्थ्य केंद्रों के लिए अगली पीढ़ी का डिजिटल समाधान' : 'Next-Generation Digital Infrastructure for Ayush Clinics'}
              </h4>
              <p className="text-xs text-slate-300">
                {isHi ? 'ओपीडी प्रतीक्षा समय में 78% कमी और शत-प्रतिशत केस हिस्ट्री कवरेज' : 'Empowering doctors with pre-consultation Prakriti & clinical case history.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/kiosk"
              className="bg-[#E2861E] hover:bg-[#C2410C] text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md"
            >
              <Monitor size={14} />
              <span>{isHi ? 'कियोस्क अनुभव करें' : 'Try MediKiosk Live'}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER BODY */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mb-12 text-xs text-slate-300">
          
          {/* Column 1: Brand & Initiative (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0B4C8C] to-[#1E6BB8] p-2.5 flex items-center justify-center shadow-lg shadow-blue-900/20">
                <Monitor className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-lg font-black text-white tracking-tight">
                  OmniGate <span className="text-[#E2861E]">MediKiosk</span>
                </span>
                <p className="text-[11px] font-semibold text-blue-200">
                  {isHi ? 'डिजिटल आयुष ओपीडी प्लेटफॉर्म' : 'Digital Ayush OPD Platform'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {isHi
                ? 'मेडीकियोस्क पारंपरिक आयुष पद्धतियों (आयुर्वेद, सिद्ध, यूनानी, होम्योपैथी) और आधुनिक डिजिटल स्वास्थ्य तकनीकों का संगम है। यह मरीजों को मातृभाषा में अपनी समस्या साझा करने और चिकित्सकों को पूर्ण नैदानिक विवरण उपलब्ध कराने का माध्यम है।'
                : 'MediKiosk bridges traditional Ayush wisdom with modern digital healthcare. It gives patients a voice in their preferred language while equipping doctors with structured Dashavidha pariksha, timeline summaries, and instant case sheets.'}
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 text-slate-300 px-3 py-1 rounded-lg text-[11px] font-semibold">
                <Award size={13} className="text-[#E2861E]" />
                {isHi ? 'दशविध परीक्षा अनुकूलित' : 'Dashavidha Pariksha Ready'}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 text-slate-300 px-3 py-1 rounded-lg text-[11px] font-semibold">
                <Globe size={13} className="text-blue-400" />
                {isHi ? 'द्विभाषी आवाज व टच' : 'Bilingual Voice & Touch'}
              </span>
            </div>
          </div>

          {/* Column 2: Platform Navigation (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="w-1.5 h-3.5 bg-[#E2861E] rounded-full"></span>
              <span>{isHi ? 'प्लेटफॉर्म व विवरण' : 'Platform & Features'}</span>
            </h5>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a href="#overview" onClick={(e) => scrollToSection(e, '#overview')} className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span>{isHi ? 'मंच अवलोकन' : 'Platform Overview'}</span>
                </a>
              </li>
              <li>
                <a href="#impact-data" onClick={(e) => scrollToSection(e, '#impact-data')} className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span>{isHi ? 'लाइव आंकड़े व रोगी संख्या' : 'Live Patient Metrics & Data'}</span>
                </a>
              </li>
              <li>
                <a href="#how-it-works" onClick={(e) => scrollToSection(e, '#how-it-works')} className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span>{isHi ? '5-चरणीय कार्यप्रणाली' : 'How the Kiosk Works'}</span>
                </a>
              </li>
              <li>
                <a href="#benefits" onClick={(e) => scrollToSection(e, '#benefits')} className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span>{isHi ? 'रोगी एवं डॉक्टर के लाभ' : 'Doctor & Patient Benefits'}</span>
                </a>
              </li>
              <li>
                <a href="#use-cases" onClick={(e) => scrollToSection(e, '#use-cases')} className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span>{isHi ? 'क्लिनिकल उपयोग परिदृश्य' : 'Clinical OPD Use Cases'}</span>
                </a>
              </li>
              <li>
                <a href="#reviews" onClick={(e) => scrollToSection(e, '#reviews')} className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span>{isHi ? 'समीक्षाएं व प्रशंसापत्र' : 'Doctor & Patient Reviews'}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Clinical & Portal Apps (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="w-1.5 h-3.5 bg-blue-500 rounded-full"></span>
              <span>{isHi ? 'अस्पताल एवं ओपीडी पोर्टल्स' : 'Clinical Portals'}</span>
            </h5>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link to="/kiosk" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <Monitor size={14} className="text-[#E2861E]" />
                  <span>{isHi ? 'मरीज सेल्फ-सर्विस कियोस्क' : 'Patient Self-Service Kiosk'}</span>
                </Link>
              </li>
              <li>
                <Link to="/ayush-opd" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <Stethoscope size={14} className="text-blue-400" />
                  <span>{isHi ? 'आयुष चिकित्सक परामर्श कक्ष' : 'Physician OPD Consultation'}</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <Activity size={14} className="text-emerald-400" />
                  <span>{isHi ? 'अस्पताल प्रबंधन डैशबोर्ड' : 'Hospital HMS Dashboard'}</span>
                </Link>
              </li>
              <li>
                <Link to="/patient-records" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <FileText size={14} className="text-purple-400" />
                  <span>{isHi ? 'मरीज स्वास्थ्य रिकॉर्ड (EHR)' : 'Electronic Health Records'}</span>
                </Link>
              </li>
              <li>
                <Link to="/doctor-prescription" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <FileText size={14} className="text-teal-400" />
                  <span>{isHi ? 'ई-पर्चा व औषधि मॉड्यूल' : 'Ayush E-Prescription'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Helplines & Support (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="w-1.5 h-3.5 bg-emerald-500 rounded-full"></span>
              <span>{isHi ? 'सहायता व हेल्पलाइन' : '24x7 Support'}</span>
            </h5>
            <div className="space-y-2.5">
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-[#E2861E] font-bold text-[11px]">
                  <PhoneCall size={13} />
                  <span>{isHi ? 'आयुष हेल्पलाइन:' : 'Ayush Helpline:'}</span>
                </div>
                <p className="text-white font-black text-sm tracking-wide">14477</p>
                <p className="text-[10px] text-slate-400">1800-11-22-02 (Toll Free)</p>
              </div>

              <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 space-y-0.5">
                <p className="text-[10px] text-slate-400 font-semibold">{isHi ? 'अस्पताल हेल्पडेस्क:' : 'Hospital Helpdesk:'}</p>
                <p className="text-white font-bold text-xs">Room 01, Ground Floor</p>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM INTELLECTUAL PROPERTY & LINKS BAR */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span>© {new Date().getFullYear()} <b>OmniGate MediKiosk</b> • {isHi ? 'आयुष क्लिनिकल इनटेक नवाचार पहल' : 'Ayush Clinical Intake & Health Innovation'}.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="hover:text-white transition-colors cursor-pointer">{isHi ? 'नियम व शर्तें' : 'Terms & Conditions'}</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">{isHi ? 'गोपनीयता नीति' : 'Privacy Policy'}</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">{isHi ? 'उपयोगकर्ता सहायता' : 'Help & Support'}</span>
          </div>
        </div>

      </div>

    </footer>
  );
}
