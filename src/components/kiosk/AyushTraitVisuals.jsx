import React from 'react';
import {
  Scale, User, Ruler, Activity, HeartPulse, Sparkles, Droplets, Flame,
  Scissors, Eye, Utensils, Clock, Moon, Sun, CloudRain, Snowflake, Wind,
  Zap, BatteryLow, BatteryMedium, BatteryFull, Brain, Lightbulb,
  Compass, Anchor, Smile, AlertCircle, MessageSquare, Footprints, Wallet,
  PiggyBank, TrendingUp, Users, Handshake, Heart, Shield, Award, CheckCircle2,
  ShieldCheck
} from 'lucide-react';

/**
 * Renders an anatomically and clinically precise visual graphic tile for each
 * of the 23 CCRAS Prakriti questionnaire options.
 */
export default function AyushTraitVisual({ questionId, optionIndex, optionValue, isSelected }) {
  // Render trait visual by question ID
  switch (questionId) {
    // -------------------------------------------------------------------------
    // 1. Body Frame & Built (ccras_phy_1)
    // -------------------------------------------------------------------------
    case 'ccras_phy_1':
      if (optionIndex === 0 || optionValue === 'apachita') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-sky-50 to-blue-50/60 p-4 flex flex-col items-center justify-between border-b border-slate-200/80 relative overflow-hidden">
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] font-bold tracking-wider text-sky-700 bg-sky-100/90 px-2.5 py-0.5 rounded-full border border-sky-200 font-mono">
                BMI &lt; 18.5
              </span>
              <span className="text-[11px] font-extrabold text-slate-500">अपचित (Thin)</span>
            </div>
            <div className="relative flex items-center justify-center my-auto">
              <svg width="100" height="96" viewBox="0 0 100 100" className="drop-shadow-xs">
                <circle cx="50" cy="18" r="10" fill="#93C5FD" stroke="#1E40AF" strokeWidth="2.2" />
                <path d="M47 28 L47 34 L38 42 L42 66 L46 66 L45 92 L41 92 M53 28 L53 34 L62 42 L58 66 L54 66 L55 92 L59 92" 
                      fill="none" stroke="#1E40AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="44" y1="46" x2="56" y2="46" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="2 2" />
                <line x1="45" y1="52" x2="55" y2="52" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="2 2" />
                <path d="M28 42 L34 42 M72 42 L66 42" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="text-[11px] font-bold text-sky-900 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-xl border border-sky-100 shadow-2xs">
              पतला ढांचा • स्पष्ट कंकाल रचना
            </div>
          </div>
        );
      }
      if (optionIndex === 1 || optionValue === 'sama') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-amber-50/70 to-orange-50/50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80 relative overflow-hidden">
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] font-bold tracking-wider text-amber-700 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-200 font-mono">
                BMI 18.5 - 24.9
              </span>
              <span className="text-[11px] font-extrabold text-slate-500">सम प्रमाण (Athletic)</span>
            </div>
            <div className="relative flex items-center justify-center my-auto">
              <svg width="100" height="96" viewBox="0 0 100 100" className="drop-shadow-xs">
                <circle cx="50" cy="18" r="10.5" fill="#FDE68A" stroke="#B45309" strokeWidth="2.2" />
                <path d="M46 28 L46 34 L32 42 L40 66 L44 66 L43 92 L48 92 M54 28 L54 34 L68 42 L60 66 L56 66 L57 92 L52 92" 
                      fill="#FEF3C7" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M42 46 Q50 50 58 46" stroke="#D97706" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <div className="text-[11px] font-bold text-amber-900 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-xl border border-amber-100 shadow-2xs">
              सुगठित मांसपेशियां • संतुलित भार
            </div>
          </div>
        );
      }
      return (
        <div className="h-44 w-full bg-gradient-to-b from-emerald-50 to-teal-50/60 p-4 flex flex-col items-center justify-between border-b border-slate-200/80 relative overflow-hidden">
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] font-bold tracking-wider text-emerald-700 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-200 font-mono">
              BMI &ge; 25.0
            </span>
            <span className="text-[11px] font-extrabold text-slate-500">उपचित (Broad)</span>
          </div>
          <div className="relative flex items-center justify-center my-auto">
            <svg width="100" height="96" viewBox="0 0 100 100" className="drop-shadow-xs">
              <circle cx="50" cy="18" r="11" fill="#A7F3D0" stroke="#047857" strokeWidth="2.2" />
              <path d="M45 28 L45 34 L26 42 L34 68 L42 68 L41 92 L47 92 M55 28 L55 34 L74 42 L66 68 L58 68 L59 92 L53 92" 
                    fill="#D1FAE5" stroke="#047857" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="33" y1="46" x2="67" y2="46" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="text-[11px] font-bold text-emerald-900 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-xl border border-emerald-100 shadow-2xs">
            चौड़ा सीना • पुष्ट व भारी अस्थियां
          </div>
        </div>
      );

    // -------------------------------------------------------------------------
    // 2. Height & Stature (ccras_phy_2)
    // -------------------------------------------------------------------------
    case 'ccras_phy_2':
      if (optionIndex === 0 || optionValue === 'hrasva') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-blue-50/60 to-indigo-50/50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-mono font-bold text-blue-700">
              <span>&lt; 80 Angula</span>
              <span className="font-sans text-slate-500">ह्रस्वाकृति</span>
            </div>
            <div className="flex items-end gap-3 my-auto h-24">
              <div className="w-10 h-16 bg-blue-400 rounded-t-xl flex items-center justify-center text-white text-xs font-black shadow-xs">
                छोटा
              </div>
              <div className="w-3 h-24 border-r-2 border-dashed border-slate-300"></div>
            </div>
            <span className="text-[11px] font-bold text-slate-700">कम कद • छोटी अंगुलियां</span>
          </div>
        );
      }
      if (optionIndex === 1 || optionValue === 'madhyama') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-amber-50/60 to-orange-50/50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-mono font-bold text-amber-700">
              <span>80 - 88 Angula</span>
              <span className="font-sans text-slate-500">मध्यमाकृति</span>
            </div>
            <div className="flex items-end gap-3 my-auto h-24">
              <div className="w-10 h-20 bg-amber-400 rounded-t-xl flex items-center justify-center text-slate-900 text-xs font-black shadow-xs">
                मध्यम
              </div>
              <div className="w-3 h-24 border-r-2 border-dashed border-slate-300"></div>
            </div>
            <span className="text-[11px] font-bold text-slate-700">सममित व संतुलित कद</span>
          </div>
        );
      }
      return (
        <div className="h-44 w-full bg-gradient-to-b from-emerald-50/60 to-teal-50/50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
          <div className="flex items-center justify-between w-full text-xs font-mono font-bold text-emerald-700">
            <span>&gt; 88 Angula</span>
            <span className="font-sans text-slate-500">दीर्घाकृति</span>
          </div>
          <div className="flex items-end gap-3 my-auto h-24">
            <div className="w-10 h-24 bg-emerald-500 rounded-t-xl flex items-center justify-center text-white text-xs font-black shadow-xs">
              लंबा
            </div>
            <div className="w-3 h-24 border-r-2 border-dashed border-slate-300"></div>
          </div>
          <span className="text-[11px] font-bold text-slate-700">लंबा कद • लंबी अस्थियां</span>
        </div>
      );

    // -------------------------------------------------------------------------
    // 3. Prominence of Veins & Tendons (ccras_phy_3)
    // -------------------------------------------------------------------------
    case 'ccras_phy_3':
      if (optionIndex === 0 || optionValue === 'prominent') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-slate-100 to-blue-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-blue-800">
              <span className="flex items-center gap-1"><Activity size={14} className="text-blue-600" /> बहु शिरा</span>
              <span className="text-[11px] text-slate-500">उभरी नसें</span>
            </div>
            <div className="relative my-auto">
              <svg width="90" height="85" viewBox="0 0 90 85">
                <path d="M25 80 C25 60 20 45 28 35 L34 18 L42 35 L48 12 L54 35 L62 18 L68 38 L74 30 L78 50 C80 65 72 80 68 85 Z" 
                      fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.8" />
                <path d="M48 80 Q45 60 38 48 Q32 40 34 25 M48 80 Q52 58 56 46 Q60 35 62 25 M42 62 Q35 55 30 45" 
                      fill="none" stroke="#2563EB" strokeWidth="2.8" strokeLinecap="round" />
                <line x1="48" y1="75" x2="48" y2="28" stroke="#64748B" strokeWidth="1.2" strokeDasharray="2 2" />
              </svg>
            </div>
            <span className="text-[11px] font-bold text-blue-900 bg-blue-100/80 px-2.5 py-0.5 rounded-lg">
              स्पष्ट नीली नसें व कण्डराएं
            </span>
          </div>
        );
      }
      if (optionIndex === 1 || optionValue === 'moderate') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-amber-50/50 to-orange-50/50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-amber-800">
              <span className="flex items-center gap-1"><HeartPulse size={14} className="text-amber-600" /> मध्यम शिरा</span>
              <span className="text-[11px] text-slate-500">हल्की नसें</span>
            </div>
            <div className="relative my-auto">
              <svg width="90" height="85" viewBox="0 0 90 85">
                <path d="M25 80 C25 60 20 45 28 35 L34 18 L42 35 L48 12 L54 35 L62 18 L68 38 L74 30 L78 50 C80 65 72 80 68 85 Z" 
                      fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.8" />
                <path d="M48 80 Q47 62 42 52 Q38 45 36 32 M48 80 Q51 60 54 50" 
                      fill="none" stroke="#F87171" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[11px] font-bold text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded-lg">
              श्रम/गरमी में हल्की गुलाबी नसें
            </span>
          </div>
        );
      }
      return (
        <div className="h-44 w-full bg-gradient-to-b from-emerald-50/60 to-teal-50/50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
          <div className="flex items-center justify-between w-full text-xs font-bold text-emerald-800">
            <span className="flex items-center gap-1"><Shield size={14} className="text-emerald-600" /> निमग्न शिरा</span>
            <span className="text-[11px] text-slate-500">छिपी नसें</span>
          </div>
          <div className="relative my-auto">
            <svg width="90" height="85" viewBox="0 0 90 85">
              <path d="M25 80 C25 60 20 45 28 35 L34 18 L42 35 L48 12 L54 35 L62 18 L68 38 L74 30 L78 50 C80 65 72 80 68 85 Z" 
                    fill="#D1FAE5" stroke="#10B981" strokeWidth="2.2" />
              <circle cx="48" cy="55" r="8" fill="#A7F3D0" opacity="0.6" />
            </svg>
          </div>
          <span className="text-[11px] font-bold text-emerald-900 bg-emerald-100/80 px-2.5 py-0.5 rounded-lg">
            मांसपेशियों के नीचे ढकी नसें
          </span>
        </div>
      );

    // -------------------------------------------------------------------------
    // 4. Skin Texture, Temperature & Complexion (ccras_phy_4)
    // -------------------------------------------------------------------------
    case 'ccras_phy_4':
      if (optionIndex === 0 || optionValue === 'dry_rough') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-blue-50/60 to-sky-50/50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-mono font-bold text-blue-700">
              <span className="flex items-center gap-1"><Wind size={13} /> रूक्ष (Dry)</span>
              <span>15% Moisture</span>
            </div>
            <div className="relative my-auto flex items-center justify-center">
              <div className="w-18 h-18 rounded-2xl bg-white border-2 border-dashed border-blue-300 flex flex-col items-center justify-center text-blue-600 shadow-2xs">
                <Wind size={32} strokeWidth={2.2} />
                <span className="text-[10px] font-bold text-blue-500 mt-1">खुरदरी / शुष्क</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-700">फटने वाली, सूखी व ठंडी त्वचा</span>
          </div>
        );
      }
      if (optionIndex === 1 || optionValue === 'warm_moles') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-amber-50/60 to-red-50/40 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-mono font-bold text-amber-700">
              <span className="flex items-center gap-1"><Sun size={13} /> उष्ण (Warm)</span>
              <span>लालिमायुक्त</span>
            </div>
            <div className="relative my-auto flex items-center justify-center">
              <div className="w-18 h-18 rounded-2xl bg-amber-100/80 border-2 border-amber-300 flex flex-col items-center justify-center text-amber-700 shadow-2xs relative">
                <Sun size={32} strokeWidth={2.2} />
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-800"></div>
                <div className="absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full bg-amber-800"></div>
                <span className="text-[10px] font-bold text-amber-800 mt-1">तिल-मस्से / धूप संवेदी</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-700">गरम स्पर्श, लालिमा व संवेदनशील</span>
          </div>
        );
      }
      return (
        <div className="h-44 w-full bg-gradient-to-b from-emerald-50/60 to-teal-50/50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
          <div className="flex items-center justify-between w-full text-xs font-mono font-bold text-emerald-700">
            <span className="flex items-center gap-1"><Sparkles size={13} /> स्निग्ध (Smooth)</span>
            <span>90% Glow</span>
          </div>
          <div className="relative my-auto flex items-center justify-center">
            <div className="w-18 h-18 rounded-2xl bg-emerald-100/80 border-2 border-emerald-300 flex flex-col items-center justify-center text-emerald-700 shadow-2xs">
              <Droplets size={32} strokeWidth={2.2} />
              <span className="text-[10px] font-bold text-emerald-800 mt-1">चमकदार / कोमल</span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-slate-700">प्राकृतिक नमी, मुलायम व कांतियुक्त</span>
        </div>
      );

    // -------------------------------------------------------------------------
    // 5. Hair Texture & Volume (ccras_phy_5)
    // -------------------------------------------------------------------------
    case 'ccras_phy_5':
      if (optionIndex === 0 || optionValue === 'dry_thin') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-slate-100 to-sky-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-slate-600">
              <span>रूक्ष केश</span>
              <span className="text-[11px] text-blue-600 font-mono">Dry / Brittle</span>
            </div>
            <div className="relative my-auto flex items-center justify-center">
              <Scissors size={40} className="text-slate-500" strokeWidth={1.8} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">पतले, सूखे, दोमुंहे बाल</span>
          </div>
        );
      }
      if (optionIndex === 1 || optionValue === 'fine_early_grey') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-amber-50/50 to-orange-50/50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-amber-700">
              <span>सूक्ष्म / अकाल पलित</span>
              <span className="text-[11px] text-amber-600 font-mono">Early Grey</span>
            </div>
            <div className="relative my-auto flex items-center justify-center">
              <Sparkles size={40} className="text-amber-500" strokeWidth={1.8} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">मुलायम, भूरे या समय से पहले सफेद</span>
          </div>
        );
      }
      return (
        <div className="h-44 w-full bg-gradient-to-b from-emerald-50/60 to-teal-50/50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
          <div className="flex items-center justify-between w-full text-xs font-bold text-emerald-700">
            <span>स्निग्ध / सघन केश</span>
            <span className="text-[11px] text-emerald-600 font-mono">Thick / Dense</span>
          </div>
          <div className="relative my-auto flex items-center justify-center">
            <ShieldCheck size={40} className="text-emerald-600" strokeWidth={1.8} />
          </div>
          <span className="text-[11px] font-bold text-slate-700">घने, काले, चमकदार व घुंघराले बाल</span>
        </div>
      );

    // -------------------------------------------------------------------------
    // 6. Eyes & Gaze (ccras_phy_6)
    // -------------------------------------------------------------------------
    case 'ccras_phy_6':
      if (optionIndex === 0 || optionValue === 'small_restless') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-slate-100 to-blue-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-blue-800">
              <span>रूक्ष / चंचल दृष्टि</span>
              <span className="text-[11px] text-slate-500 font-mono">Restless</span>
            </div>
            <div className="relative my-auto flex items-center justify-center">
              <Eye size={42} className="text-blue-500" strokeWidth={1.8} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">छोटी, बार-बार झपकने वाली आंखें</span>
          </div>
        );
      }
      if (optionIndex === 1 || optionValue === 'sharp_reddish') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-amber-50/60 to-red-50/50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-amber-800">
              <span>तीक्ष्ण / रक्ताभ</span>
              <span className="text-[11px] text-amber-600 font-mono">Sharp / Reddish</span>
            </div>
            <div className="relative my-auto flex items-center justify-center">
              <Eye size={42} className="text-amber-600" strokeWidth={2.4} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">तेज, तीखी दृष्टि, लालिमायुक्त</span>
          </div>
        );
      }
      return (
        <div className="h-44 w-full bg-gradient-to-b from-emerald-50/60 to-teal-50/50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
          <div className="flex items-center justify-between w-full text-xs font-bold text-emerald-800">
            <span>विशाल / श्वेत स्निग्ध</span>
            <span className="text-[11px] text-emerald-600 font-mono">Large / Serene</span>
          </div>
          <div className="relative my-auto flex items-center justify-center">
            <Eye size={46} className="text-emerald-600" strokeWidth={2} />
          </div>
          <span className="text-[11px] font-bold text-slate-700">बड़ी, कमल जैसी शांत आंखें</span>
        </div>
      );

    // -------------------------------------------------------------------------
    // 7. Agni & Appetite (ccras_physio_1)
    // -------------------------------------------------------------------------
    case 'ccras_physio_1':
      if (optionIndex === 0 || optionValue === 'vishama') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-blue-50 to-indigo-50/50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-blue-800">
              <span>विषमाग्नि (अनियमित)</span>
              <span className="text-[11px] text-blue-600 font-mono">Variable</span>
            </div>
            <div className="relative my-auto flex items-center justify-center">
              <div className="p-3.5 bg-blue-100 rounded-2xl text-blue-600">
                <Flame size={36} strokeWidth={2.2} className="animate-pulse" />
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-700">कभी बहुत भूख, कभी बिल्कुल नहीं</span>
          </div>
        );
      }
      if (optionIndex === 1 || optionValue === 'tikshna') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-amber-50 to-orange-50/60 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-amber-800">
              <span>तीक्ष्णाग्नि (तीव्र भूख)</span>
              <span className="text-[11px] text-amber-600 font-mono">Sharp & Urgent</span>
            </div>
            <div className="relative my-auto flex items-center justify-center">
              <div className="p-3.5 bg-amber-100 rounded-2xl text-amber-600">
                <Flame size={40} strokeWidth={2.6} />
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-700">समय पर भोजन न मिलने पर बेचैनी</span>
          </div>
        );
      }
      return (
        <div className="h-44 w-full bg-gradient-to-b from-emerald-50 to-teal-50/60 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
          <div className="flex items-center justify-between w-full text-xs font-bold text-emerald-800">
            <span>मन्दाग्नि (धीमी भूख)</span>
            <span className="text-[11px] text-emerald-600 font-mono">Slow & Steady</span>
          </div>
          <div className="relative my-auto flex items-center justify-center">
            <div className="p-3.5 bg-emerald-100 rounded-2xl text-emerald-600">
              <Utensils size={36} strokeWidth={2.2} />
            </div>
          </div>
          <span className="text-[11px] font-bold text-slate-700">कम भूख, भोजन छोड़ने पर भी परेशानी नहीं</span>
        </div>
      );

    // -------------------------------------------------------------------------
    // 8. Pipasa & Thirst (ccras_physio_2)
    // -------------------------------------------------------------------------
    case 'ccras_physio_2':
      if (optionIndex === 0 || optionValue === 'low_erratic') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-slate-100 to-blue-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-slate-700">
              <span>अल्प पिपासा (कम प्यास)</span>
              <span className="text-[11px] text-blue-600 font-mono">1-2 Glasses</span>
            </div>
            <div className="my-auto flex items-center gap-1.5">
              <Droplets size={32} className="text-slate-400" />
            </div>
            <span className="text-[11px] font-bold text-slate-700">कम या अनियमित पानी की आवश्यकता</span>
          </div>
        );
      }
      if (optionIndex === 1 || optionValue === 'high_cold') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-amber-50 to-orange-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-amber-800">
              <span>अति पिपासा (अधिक प्यास)</span>
              <span className="text-[11px] text-amber-600 font-mono">8-10+ Glasses</span>
            </div>
            <div className="my-auto flex items-center gap-1">
              <Droplets size={36} className="text-blue-500" />
              <Snowflake size={24} className="text-sky-500" />
            </div>
            <span className="text-[11px] font-bold text-slate-700">बार-बार ठंडा पानी पीने की इच्छा</span>
          </div>
        );
      }
      return (
        <div className="h-44 w-full bg-gradient-to-b from-emerald-50 to-teal-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
          <div className="flex items-center justify-between w-full text-xs font-bold text-emerald-800">
            <span>मध्यम पिपासा (संतुलित)</span>
            <span className="text-[11px] text-emerald-600 font-mono">4-6 Glasses</span>
          </div>
          <div className="my-auto flex items-center gap-1.5">
            <Droplets size={34} className="text-emerald-500" />
          </div>
          <span className="text-[11px] font-bold text-slate-700">नियमित व संतुलित प्यास</span>
        </div>
      );

    // -------------------------------------------------------------------------
    // 9. Kostha & Bowel Habit (ccras_physio_3)
    // -------------------------------------------------------------------------
    case 'ccras_physio_3':
      if (optionIndex === 0 || optionValue === 'krura') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-slate-100 to-sky-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-slate-700">
              <span>क्रूर कोष्ठ (कड़ा मल)</span>
              <span className="text-[11px] text-blue-600 font-mono">Slow Transit</span>
            </div>
            <div className="my-auto p-3 bg-slate-200/80 rounded-2xl text-slate-700">
              <Clock size={34} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">कब्जियत की प्रवृत्ति, कठोर मल</span>
          </div>
        );
      }
      if (optionIndex === 1 || optionValue === 'mridu') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-amber-50 to-orange-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-amber-800">
              <span>मृदु कोष्ठ (नरम मल)</span>
              <span className="text-[11px] text-amber-600 font-mono">Fast Transit</span>
            </div>
            <div className="my-auto p-3 bg-amber-100 rounded-2xl text-amber-700">
              <Activity size={34} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">दूध या घी से भी तुरंत शौच प्रवृत्ति</span>
          </div>
        );
      }
      return (
        <div className="h-44 w-full bg-gradient-to-b from-emerald-50 to-teal-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
          <div className="flex items-center justify-between w-full text-xs font-bold text-emerald-800">
            <span>मध्यम कोष्ठ (नियमित)</span>
            <span className="text-[11px] text-emerald-600 font-mono">Daily Rhythm</span>
          </div>
          <div className="my-auto p-3 bg-emerald-100 rounded-2xl text-emerald-700">
            <CheckCircle2 size={34} />
          </div>
          <span className="text-[11px] font-bold text-slate-700">प्रतिदिन सुबह नियमित व सुगम मलत्याग</span>
        </div>
      );

    // -------------------------------------------------------------------------
    // 10. Sleep & Rest (ccras_physio_4)
    // -------------------------------------------------------------------------
    case 'ccras_physio_4':
      if (optionIndex === 0 || optionValue === 'light_broken') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-slate-100 to-blue-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-blue-800">
              <span>अल्प / खंडित निद्रा</span>
              <span className="text-[11px] text-blue-600 font-mono">&lt; 6 Hours</span>
            </div>
            <div className="my-auto flex items-center justify-center p-3.5 bg-blue-100 rounded-2xl text-blue-600">
              <Moon size={34} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">हल्की आहट से भी नींद खुल जाना</span>
          </div>
        );
      }
      if (optionIndex === 1 || optionValue === 'moderate_sound') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-amber-50 to-orange-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-amber-800">
              <span>मध्यम निद्रा (ताजगीपूर्ण)</span>
              <span className="text-[11px] text-amber-600 font-mono">6 - 8 Hours</span>
            </div>
            <div className="my-auto flex items-center justify-center p-3.5 bg-amber-100 rounded-2xl text-amber-600">
              <Clock size={34} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">गहरी नींद, जागने पर ऊर्जावान</span>
          </div>
        );
      }
      return (
        <div className="h-44 w-full bg-gradient-to-b from-emerald-50 to-teal-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
          <div className="flex items-center justify-between w-full text-xs font-bold text-emerald-800">
            <span>अति निद्रा (गहरी / भारी)</span>
            <span className="text-[11px] text-emerald-600 font-mono">&gt; 8 Hours</span>
          </div>
          <div className="my-auto flex items-center justify-center p-3.5 bg-emerald-100 rounded-2xl text-emerald-600">
            <Moon size={38} className="fill-emerald-200" />
          </div>
          <span className="text-[11px] font-bold text-slate-700">गहरी भारी नींद, सुबह उठने में आलस्य</span>
        </div>
      );

    // -------------------------------------------------------------------------
    // 11. Sveda & Perspiration (ccras_physio_5)
    // -------------------------------------------------------------------------
    case 'ccras_physio_5':
      if (optionIndex === 0 || optionValue === 'scanty') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-slate-100 to-blue-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-slate-700">
              <span>अल्प स्वेद (कम पसीना)</span>
              <span className="text-[11px] text-blue-600 font-mono">Minimal</span>
            </div>
            <div className="my-auto p-3 bg-slate-200 rounded-2xl text-slate-600">
              <Wind size={34} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">गरमी में भी पसीना बहुत कम आना</span>
          </div>
        );
      }
      if (optionIndex === 1 || optionValue === 'profuse') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-amber-50 to-red-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-amber-800">
              <span>अति स्वेद (अधिक पसीना)</span>
              <span className="text-[11px] text-amber-600 font-mono">Profuse</span>
            </div>
            <div className="my-auto p-3 bg-amber-100 rounded-2xl text-amber-600">
              <Droplets size={36} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">जल्दी व प्रचुर मात्रा में पसीना आना</span>
          </div>
        );
      }
      return (
        <div className="h-44 w-full bg-gradient-to-b from-emerald-50 to-teal-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
          <div className="flex items-center justify-between w-full text-xs font-bold text-emerald-800">
            <span>मध्यम स्वेद (संतुलित)</span>
            <span className="text-[11px] text-emerald-600 font-mono">Moderate</span>
          </div>
          <div className="my-auto p-3 bg-emerald-100 rounded-2xl text-emerald-600">
            <Droplets size={32} />
          </div>
          <span className="text-[11px] font-bold text-slate-700">केवल परिश्रम के समय नियंत्रित पसीना</span>
        </div>
      );

    // -------------------------------------------------------------------------
    // 12. Weather Tolerance (ccras_physio_6)
    // -------------------------------------------------------------------------
    case 'ccras_physio_6':
      if (optionIndex === 0 || optionValue === 'cold_intolerant') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-sky-50 to-blue-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-blue-800">
              <span>शीत असहिष्णुता</span>
              <span className="text-[11px] text-blue-600 font-mono">Cold Sensitive</span>
            </div>
            <div className="my-auto p-3.5 bg-blue-100 rounded-2xl text-blue-600">
              <Snowflake size={36} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">ठंड व ठंडी हवाएं बिल्कुल सहन न होना</span>
          </div>
        );
      }
      if (optionIndex === 1 || optionValue === 'heat_intolerant') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-amber-50 to-orange-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-amber-800">
              <span>उष्ण असहिष्णुता</span>
              <span className="text-[11px] text-amber-600 font-mono">Heat Sensitive</span>
            </div>
            <div className="my-auto p-3.5 bg-amber-100 rounded-2xl text-amber-600">
              <Sun size={36} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">धूप व गरमी से जल्दी बेचैनी होना</span>
          </div>
        );
      }
      return (
        <div className="h-44 w-full bg-gradient-to-b from-emerald-50 to-teal-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
          <div className="flex items-center justify-between w-full text-xs font-bold text-emerald-800">
            <span>नमी/सीलन असहिष्णुता</span>
            <span className="text-[11px] text-emerald-600 font-mono">Damp Sensitive</span>
          </div>
          <div className="my-auto p-3.5 bg-emerald-100 rounded-2xl text-emerald-600">
            <CloudRain size={36} />
          </div>
          <span className="text-[11px] font-bold text-slate-700">सर्दी-जुकाम व नम मौसम से परेशानी</span>
        </div>
      );

    // -------------------------------------------------------------------------
    // 13. Physical Stamina & Bala (ccras_physio_7)
    // -------------------------------------------------------------------------
    case 'ccras_physio_7':
      if (optionIndex === 0 || optionValue === 'alpa') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-slate-100 to-blue-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-slate-700">
              <span>अल्प बल (जल्दी थकान)</span>
              <span className="text-[11px] text-blue-600 font-mono">1-Bar Power</span>
            </div>
            <div className="my-auto p-3.5 bg-slate-200 rounded-2xl text-slate-600">
              <BatteryLow size={38} className="text-amber-500" />
            </div>
            <span className="text-[11px] font-bold text-slate-700">थोड़े परिश्रम से भी जल्दी थक जाना</span>
          </div>
        );
      }
      if (optionIndex === 1 || optionValue === 'madhyama_bala') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-amber-50 to-orange-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-amber-800">
              <span>मध्यम बल (सक्रिय)</span>
              <span className="text-[11px] text-amber-600 font-mono">2-Bar Power</span>
            </div>
            <div className="my-auto p-3.5 bg-amber-100 rounded-2xl text-amber-600">
              <BatteryMedium size={38} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">अच्छा उत्साह व मध्यम सहनशक्ति</span>
          </div>
        );
      }
      return (
        <div className="h-44 w-full bg-gradient-to-b from-emerald-50 to-teal-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
          <div className="flex items-center justify-between w-full text-xs font-bold text-emerald-800">
            <span>प्रवर बल (उत्कृष्ट क्षमता)</span>
            <span className="text-[11px] text-emerald-600 font-mono">Full Battery</span>
          </div>
          <div className="my-auto p-3.5 bg-emerald-100 rounded-2xl text-emerald-600">
            <BatteryFull size={38} />
          </div>
          <span className="text-[11px] font-bold text-slate-700">दीर्घकालीन सहनशक्ति व अपार ऊर्जा</span>
        </div>
      );

    // -------------------------------------------------------------------------
    // 14. Grasping Power & Learning (ccras_psy_1)
    // -------------------------------------------------------------------------
    case 'ccras_psy_1':
      if (optionIndex === 0 || optionValue === 'quick_grasp') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-blue-50 to-indigo-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-blue-800">
              <span>शीघ्रग्राही (त्वरित समझ)</span>
              <span className="text-[11px] text-blue-600 font-mono">Instant Spark</span>
            </div>
            <div className="my-auto p-3.5 bg-blue-100 rounded-2xl text-blue-600">
              <Zap size={36} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">किसी भी बात को तुरंत समझ लेना</span>
          </div>
        );
      }
      if (optionIndex === 1 || optionValue === 'analytical') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-amber-50 to-orange-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-amber-800">
              <span>तार्किक (विश्लेषणात्मक)</span>
              <span className="text-[11px] text-amber-600 font-mono">Logic Focus</span>
            </div>
            <div className="my-auto p-3.5 bg-amber-100 rounded-2xl text-amber-600">
              <Brain size={36} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">तर्क और प्रमाण के साथ गहराई से समझना</span>
          </div>
        );
      }
      return (
        <div className="h-44 w-full bg-gradient-to-b from-emerald-50 to-teal-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
          <div className="flex items-center justify-between w-full text-xs font-bold text-emerald-800">
            <span>चिरग्राही (स्थिर समझ)</span>
            <span className="text-[11px] text-emerald-600 font-mono">Solid Base</span>
          </div>
          <div className="my-auto p-3.5 bg-emerald-100 rounded-2xl text-emerald-600">
            <Lightbulb size={36} />
          </div>
          <span className="text-[11px] font-bold text-slate-700">समय लेकर समझना, परंतु पक्की समझ</span>
        </div>
      );

    // -------------------------------------------------------------------------
    // 15. Memory Retention (ccras_psy_2)
    // -------------------------------------------------------------------------
    case 'ccras_psy_2':
      if (optionIndex === 0 || optionValue === 'quick_forget') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-slate-100 to-blue-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-slate-700">
              <span>शीघ्र विस्मरण</span>
              <span className="text-[11px] text-blue-600 font-mono">Quick Decay</span>
            </div>
            <div className="my-auto p-3.5 bg-slate-200 rounded-2xl text-slate-600">
              <Wind size={36} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">जल्दी याद होना, जल्दी भूल जाना</span>
          </div>
        );
      }
      if (optionIndex === 1 || optionValue === 'sharp_memory') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-amber-50 to-orange-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-amber-800">
              <span>तीक्ष्ण स्मृति (सटीक)</span>
              <span className="text-[11px] text-amber-600 font-mono">High Recall</span>
            </div>
            <div className="my-auto p-3.5 bg-amber-100 rounded-2xl text-amber-600">
              <Sparkles size={36} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">तथ्यों और विवरणों की स्पष्ट याददाश्त</span>
          </div>
        );
      }
      return (
        <div className="h-44 w-full bg-gradient-to-b from-emerald-50 to-teal-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
          <div className="flex items-center justify-between w-full text-xs font-bold text-emerald-800">
            <span>दीर्घकालीन स्मृति</span>
            <span className="text-[11px] text-emerald-600 font-mono">Lifelong</span>
          </div>
          <div className="my-auto p-3.5 bg-emerald-100 rounded-2xl text-emerald-600">
            <Award size={36} />
          </div>
          <span className="text-[11px] font-bold text-slate-700">एक बार सीखी बात जीवन भर याद रहना</span>
        </div>
      );

    // -------------------------------------------------------------------------
    // 16. Decision Making (ccras_psy_3)
    // -------------------------------------------------------------------------
    case 'ccras_psy_3':
      if (optionIndex === 0 || optionValue === 'hesitant') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-slate-100 to-blue-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-slate-700">
              <span>अनवस्थित (दुविधा)</span>
              <span className="text-[11px] text-blue-600 font-mono">Hesitant</span>
            </div>
            <div className="my-auto p-3.5 bg-slate-200 rounded-2xl text-slate-600">
              <Compass size={36} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">निर्णय लेने में संशय व बार-बार बदलाव</span>
          </div>
        );
      }
      if (optionIndex === 1 || optionValue === 'decisive') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-amber-50 to-orange-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-amber-800">
              <span>दृढ़ / त्वरित निर्णय</span>
              <span className="text-[11px] text-amber-600 font-mono">Decisive</span>
            </div>
            <div className="my-auto p-3.5 bg-amber-100 rounded-2xl text-amber-600">
              <Zap size={36} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">स्पष्ट व निडरता से तुरंत फैसला लेना</span>
          </div>
        );
      }
      return (
        <div className="h-44 w-full bg-gradient-to-b from-emerald-50 to-teal-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
          <div className="flex items-center justify-between w-full text-xs font-bold text-emerald-800">
            <span>स्थिर / विचारशील</span>
            <span className="text-[11px] text-emerald-600 font-mono">Anchor</span>
          </div>
          <div className="my-auto p-3.5 bg-emerald-100 rounded-2xl text-emerald-600">
            <Anchor size={36} />
          </div>
          <span className="text-[11px] font-bold text-slate-700">धैर्यपूर्वक सोचकर अटल निर्णय लेना</span>
        </div>
      );

    // -------------------------------------------------------------------------
    // 17. Anger & Emotional Response (ccras_psy_4)
    // -------------------------------------------------------------------------
    case 'ccras_psy_4':
      if (optionIndex === 0 || optionValue === 'anxious') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-slate-100 to-blue-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-slate-700">
              <span>चिंता / भयभीत स्वभाव</span>
              <span className="text-[11px] text-blue-600 font-mono">Anxious</span>
            </div>
            <div className="my-auto p-3.5 bg-blue-100 rounded-2xl text-blue-600">
              <AlertCircle size={36} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">जल्दी घबराहट या चिंता होना</span>
          </div>
        );
      }
      if (optionIndex === 1 || optionValue === 'quick_anger') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-amber-50 to-red-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-amber-800">
              <span>क्षिप्रक्रोध (जल्दी गुस्सा)</span>
              <span className="text-[11px] text-amber-600 font-mono">Quick Flare</span>
            </div>
            <div className="my-auto p-3.5 bg-amber-100 rounded-2xl text-amber-600">
              <Flame size={36} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">तुरंत गुस्सा आना और जल्दी शांत होना</span>
          </div>
        );
      }
      return (
        <div className="h-44 w-full bg-gradient-to-b from-emerald-50 to-teal-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
          <div className="flex items-center justify-between w-full text-xs font-bold text-emerald-800">
            <span>शांत / क्षमाशील</span>
            <span className="text-[11px] text-emerald-600 font-mono">Peaceful</span>
          </div>
          <div className="my-auto p-3.5 bg-emerald-100 rounded-2xl text-emerald-600">
            <Smile size={36} />
          </div>
          <span className="text-[11px] font-bold text-slate-700">क्रोध बहुत कम आना, अत्यधिक क्षमाशील</span>
        </div>
      );

    // -------------------------------------------------------------------------
    // 18. Mood & Mental State (ccras_psy_5)
    // -------------------------------------------------------------------------
    case 'ccras_psy_5':
      if (optionIndex === 0 || optionValue === 'fluctuating') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-slate-100 to-blue-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-slate-700">
              <span>परिवर्तनशील मन</span>
              <span className="text-[11px] text-blue-600 font-mono">Shifting Mood</span>
            </div>
            <div className="my-auto p-3.5 bg-slate-200 rounded-2xl text-slate-600">
              <Wind size={36} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">उत्साह और उदासी में तेजी से बदलाव</span>
          </div>
        );
      }
      if (optionIndex === 1 || optionValue === 'passionate') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-amber-50 to-orange-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-amber-800">
              <span>महत्वाकांक्षी (उग्र)</span>
              <span className="text-[11px] text-amber-600 font-mono">Passionate</span>
            </div>
            <div className="my-auto p-3.5 bg-amber-100 rounded-2xl text-amber-600">
              <TrendingUp size={36} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">लक्ष्य के प्रति तीव्र इच्छा व प्रतिस्पर्धा</span>
          </div>
        );
      }
      return (
        <div className="h-44 w-full bg-gradient-to-b from-emerald-50 to-teal-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
          <div className="flex items-center justify-between w-full text-xs font-bold text-emerald-800">
            <span>संतुष्ट / स्थिर चित्त</span>
            <span className="text-[11px] text-emerald-600 font-mono">Contented</span>
          </div>
          <div className="my-auto p-3.5 bg-emerald-100 rounded-2xl text-emerald-600">
            <Heart size={36} />
          </div>
          <span className="text-[11px] font-bold text-slate-700">सदा प्रसन्न, धीर-गंभीर व तनावमुक्त</span>
        </div>
      );

    // -------------------------------------------------------------------------
    // 19. Speech Pattern (ccras_beh_1)
    // -------------------------------------------------------------------------
    case 'ccras_beh_1':
      if (optionIndex === 0 || optionValue === 'fast_chatter') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-slate-100 to-blue-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-slate-700">
              <span>द्रुत संभाषण (तेज बोलना)</span>
              <span className="text-[11px] text-blue-600 font-mono">Rapid Voice</span>
            </div>
            <div className="my-auto p-3.5 bg-blue-100 rounded-2xl text-blue-600">
              <MessageSquare size={36} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">जल्दी-जल्दी व अधिक बात करने की आदत</span>
          </div>
        );
      }
      if (optionIndex === 1 || optionValue === 'sharp_speech') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-amber-50 to-orange-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-amber-800">
              <span>स्पष्ट / प्रभावशाली</span>
              <span className="text-[11px] text-amber-600 font-mono">Sharp & Direct</span>
            </div>
            <div className="my-auto p-3.5 bg-amber-100 rounded-2xl text-amber-600">
              <Sparkles size={36} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">सटीक, तार्किक व नेतृत्वपूर्ण वाणी</span>
          </div>
        );
      }
      return (
        <div className="h-44 w-full bg-gradient-to-b from-emerald-50 to-teal-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
          <div className="flex items-center justify-between w-full text-xs font-bold text-emerald-800">
            <span>गंभीर / मधुर वाणी</span>
            <span className="text-[11px] text-emerald-600 font-mono">Deep & Sweet</span>
          </div>
          <div className="my-auto p-3.5 bg-emerald-100 rounded-2xl text-emerald-600">
            <Smile size={36} />
          </div>
          <span className="text-[11px] font-bold text-slate-700">धीमी, गंभीर, मधुर व नपी-तुली आवाज</span>
        </div>
      );

    // -------------------------------------------------------------------------
    // 20. Walking Speed & Gait (ccras_beh_2)
    // -------------------------------------------------------------------------
    case 'ccras_beh_2':
      if (optionIndex === 0 || optionValue === 'fast_stride') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-slate-100 to-blue-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-slate-700">
              <span>शीघ्र चाल (तेज चलना)</span>
              <span className="text-[11px] text-blue-600 font-mono">Brisk Pace</span>
            </div>
            <div className="my-auto p-3.5 bg-blue-100 rounded-2xl text-blue-600">
              <Footprints size={36} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">हल्के कदमों से जल्दी-जल्दी चलना</span>
          </div>
        );
      }
      if (optionIndex === 1 || optionValue === 'confident_pace') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-amber-50 to-orange-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-amber-800">
              <span>आत्मविश्वासी चाल</span>
              <span className="text-[11px] text-amber-600 font-mono">Confident</span>
            </div>
            <div className="my-auto p-3.5 bg-amber-100 rounded-2xl text-amber-600">
              <Footprints size={36} className="text-amber-600" />
            </div>
            <span className="text-[11px] font-bold text-slate-700">दृढ़, लक्ष्य-केन्द्रित मध्यम चाल</span>
          </div>
        );
      }
      return (
        <div className="h-44 w-full bg-gradient-to-b from-emerald-50 to-teal-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
          <div className="flex items-center justify-between w-full text-xs font-bold text-emerald-800">
            <span>मंद / राजसी चाल</span>
            <span className="text-[11px] text-emerald-600 font-mono">Graceful / Slow</span>
          </div>
          <div className="my-auto p-3.5 bg-emerald-100 rounded-2xl text-emerald-600">
            <Footprints size={38} className="text-emerald-700" />
          </div>
          <span className="text-[11px] font-bold text-slate-700">धीमी, स्थिर, गरिमापूर्ण हाथी जैसी चाल</span>
        </div>
      );

    // -------------------------------------------------------------------------
    // 21. Financial / Spending Habit (ccras_beh_3)
    // -------------------------------------------------------------------------
    case 'ccras_beh_3':
      if (optionIndex === 0 || optionValue === 'impulsive_spend') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-slate-100 to-blue-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-slate-700">
              <span>शीघ्र व्यय (अधिक खर्च)</span>
              <span className="text-[11px] text-blue-600 font-mono">Spender</span>
            </div>
            <div className="my-auto p-3.5 bg-slate-200 rounded-2xl text-slate-600">
              <Wallet size={36} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">पैसा जल्दी खर्च होना, बचत में कठिनाई</span>
          </div>
        );
      }
      if (optionIndex === 1 || optionValue === 'calculated_spend') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-amber-50 to-orange-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-amber-800">
              <span>नियोजित व्यय (गुणवत्ता)</span>
              <span className="text-[11px] text-amber-600 font-mono">Calculated</span>
            </div>
            <div className="my-auto p-3.5 bg-amber-100 rounded-2xl text-amber-600">
              <TrendingUp size={36} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">गुणवत्ता व सम्मान के लिए सोच-समझकर खर्च</span>
          </div>
        );
      }
      return (
        <div className="h-44 w-full bg-gradient-to-b from-emerald-50 to-teal-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
          <div className="flex items-center justify-between w-full text-xs font-bold text-emerald-800">
            <span>मितव्ययी (संचय प्रवृत्ति)</span>
            <span className="text-[11px] text-emerald-600 font-mono">Saver</span>
          </div>
          <div className="my-auto p-3.5 bg-emerald-100 rounded-2xl text-emerald-600">
            <PiggyBank size={36} />
          </div>
          <span className="text-[11px] font-bold text-slate-700">भविष्य के लिए नियमित बचत की आदत</span>
        </div>
      );

    // -------------------------------------------------------------------------
    // 22. Friendship & Social Relations (ccras_beh_4)
    // -------------------------------------------------------------------------
    case 'ccras_beh_4':
      if (optionIndex === 0 || optionValue === 'many_casual') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-slate-100 to-blue-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-slate-700">
              <span>शीघ्र मित्रता (अस्थिर)</span>
              <span className="text-[11px] text-blue-600 font-mono">Casual Circle</span>
            </div>
            <div className="my-auto p-3.5 bg-blue-100 rounded-2xl text-blue-600">
              <Users size={36} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">बहुत जल्दी दोस्त बनना और बदलना</span>
          </div>
        );
      }
      if (optionIndex === 1 || optionValue === 'selective') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-amber-50 to-orange-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-amber-800">
              <span>चुनिंदा मित्रता</span>
              <span className="text-[11px] text-amber-600 font-mono">Selective</span>
            </div>
            <div className="my-auto p-3.5 bg-amber-100 rounded-2xl text-amber-600">
              <Handshake size={36} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">योग्यता व आपसी सम्मान पर आधारित संबंध</span>
          </div>
        );
      }
      return (
        <div className="h-44 w-full bg-gradient-to-b from-emerald-50 to-teal-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
          <div className="flex items-center justify-between w-full text-xs font-bold text-emerald-800">
            <span>प्रगाढ़ / आजीवन मित्रता</span>
            <span className="text-[11px] text-emerald-600 font-mono">Lifelong Bond</span>
          </div>
          <div className="my-auto p-3.5 bg-emerald-100 rounded-2xl text-emerald-600">
            <Heart size={36} />
          </div>
          <span className="text-[11px] font-bold text-slate-700">कम मित्र, परंतु आजीवन अटूट संबंध</span>
        </div>
      );

    // -------------------------------------------------------------------------
    // 23. Enmity & Reconciliation (ccras_beh_5)
    // -------------------------------------------------------------------------
    case 'ccras_beh_5':
      if (optionIndex === 0 || optionValue === 'brief_grudge') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-slate-100 to-blue-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-slate-700">
              <span>क्षणभंगुर वैर</span>
              <span className="text-[11px] text-blue-600 font-mono">Forgiving</span>
            </div>
            <div className="my-auto p-3.5 bg-blue-100 rounded-2xl text-blue-600">
              <Wind size={36} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">मनमुटाव को बहुत जल्दी भूल जाना</span>
          </div>
        );
      }
      if (optionIndex === 1 || optionValue === 'intense_rival') {
        return (
          <div className="h-44 w-full bg-gradient-to-b from-amber-50 to-red-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
            <div className="flex items-center justify-between w-full text-xs font-bold text-amber-800">
              <span>दृढ़ स्वाभिमानी</span>
              <span className="text-[11px] text-amber-600 font-mono">Resolute</span>
            </div>
            <div className="my-auto p-3.5 bg-amber-100 rounded-2xl text-amber-600">
              <Shield size={36} />
            </div>
            <span className="text-[11px] font-bold text-slate-700">अपमान सहन न करना, न्यायप्रिय</span>
          </div>
        );
      }
      return (
        <div className="h-44 w-full bg-gradient-to-b from-emerald-50 to-teal-50 p-4 flex flex-col items-center justify-between border-b border-slate-200/80">
          <div className="flex items-center justify-between w-full text-xs font-bold text-emerald-800">
            <span>अहिंसक / परम शांतिप्रिय</span>
            <span className="text-[11px] text-emerald-600 font-mono">Peace Maker</span>
          </div>
          <div className="my-auto p-3.5 bg-emerald-100 rounded-2xl text-emerald-600">
            <Smile size={36} />
          </div>
          <span className="text-[11px] font-bold text-slate-700">विवाद से दूर रहना, परम क्षमाशील स्वभाव</span>
        </div>
      );

    default:
      return (
        <div className="h-44 w-full bg-slate-100 p-4 flex items-center justify-center text-slate-400">
          <Activity size={32} />
        </div>
      );
  }
}
