import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { 
  Scan, User, IdCard, CheckCircle2, X, Search, Sparkles, Activity,
  Camera, CameraOff, Zap, AlertCircle, Lock, Unlock, Box, Radio
} from 'lucide-react';
import { usePatients } from '../../../hooks/useFirebaseData';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function ScanInterface({ onScan, onReset, currentPatient, currentNurse, requireCabinet = true }) {
  const [hhid, setHhid] = useState('');
  const [nurseId, setNurseId] = useState('');
  const [cabinetId, setCabinetId] = useState('');
  const [patientSuggestions, setPatientSuggestions] = useState([]);
  const [nurseSuggestions, setNurseSuggestions] = useState([]);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [showNurseDropdown, setShowNurseDropdown] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  // Cabinet States
  const [cabinetUnlocked, setCabinetUnlocked] = useState(false);
  const [showCabinetAlert, setShowCabinetAlert] = useState(false);
  
  // Barcode Scanner States
  const [scannerActive, setScannerActive] = useState(false);
  const [scanMode, setScanMode] = useState(null); // 'patient', 'nurse', or 'cabinet'
  const [scannerError, setScannerError] = useState(null);
  
  const patientInputRef = useRef(null);
  const nurseInputRef = useRef(null);
  const cabinetInputRef = useRef(null);
  const scannerRef = useRef(null);
  const html5QrcodeScannerRef = useRef(null);

  // Get patients from Firebase
  const { patients } = usePatients();

  // Mock nurse data
  const nurses = [
    { id: 'N001', name: 'Sister Anita Kumar' },
    { id: 'N002', name: 'Nurse Priya Sharma' },
    { id: 'N003', name: 'Nurse Rajesh Patel' },
    { id: 'N004', name: 'Sister Meera Singh' }
  ];

  // Mock cabinet/rack data
  const cabinets = [
    { id: 'CAB-A1', name: 'Cabinet A1 - General Meds', location: 'Ward A' },
    { id: 'CAB-A2', name: 'Cabinet A2 - Emergency', location: 'Ward A' },
    { id: 'CAB-B1', name: 'Cabinet B1 - Antibiotics', location: 'Ward B' },
    { id: 'CAB-B2', name: 'Cabinet B2 - Controlled Substances', location: 'Ward B' },
    { id: 'CAB-C1', name: 'Cabinet C1 - ICU Medications', location: 'ICU' },
  ];

  // Filter patient suggestions
  useEffect(() => {
    if (hhid.length >= 1) {
      const filtered = patients.filter(p => 
        p.hhid.toLowerCase().includes(hhid.toLowerCase()) ||
        p.name.toLowerCase().includes(hhid.toLowerCase())
      ).slice(0, 5);
      setPatientSuggestions(filtered);
      setShowPatientDropdown(filtered.length > 0);
    } else {
      setPatientSuggestions([]);
      setShowPatientDropdown(false);
    }
  }, [hhid, patients]);

  // Filter nurse suggestions
  useEffect(() => {
    if (nurseId.length >= 1) {
      const filtered = nurses.filter(n => 
        n.id.toLowerCase().includes(nurseId.toLowerCase()) ||
        n.name.toLowerCase().includes(nurseId.toLowerCase())
      ).slice(0, 5);
      setNurseSuggestions(filtered);
      setShowNurseDropdown(filtered.length > 0);
    } else {
      setNurseSuggestions([]);
      setShowNurseDropdown(false);
    }
  }, [nurseId]);

  // Simulate IoT Cabinet Lock Status (Replace with real IoT integration)
  useEffect(() => {
    if (cabinetId) {
      // Simulate checking if cabinet is physically unlocked
      const checkCabinetStatus = setInterval(() => {
        // In production, this would check actual IoT lock status via MQTT/WebSocket
        // For demo, we'll simulate unlock after 2 seconds
        const isValidCabinet = cabinets.some(cab => cab.id === cabinetId.toUpperCase());
        if (isValidCabinet && !cabinetUnlocked) {
          setTimeout(() => {
            setCabinetUnlocked(true);
            playSuccessSound();
          }, 2000);
        }
      }, 500);

      return () => clearInterval(checkCabinetStatus);
    }
  }, [cabinetId]);

  // Initialize Barcode Scanner
  const startScanner = (mode) => {
    setScanMode(mode);
    setScannerActive(true);
    setScannerError(null);

    setTimeout(() => {
      try {
        const config = {
          fps: 10,
          qrbox: { width: 250, height: 150 },
          aspectRatio: 1.0,
          rememberLastUsedCamera: true,
          supportedScanTypes: [0, 1, 2, 3, 4, 5, 6, 7]
        };

        html5QrcodeScannerRef.current = new Html5QrcodeScanner(
          "barcode-scanner-container",
          config,
          false
        );

        html5QrcodeScannerRef.current.render(
          (decodedText) => {
            handleBarcodeScan(decodedText, mode);
          },
          (error) => {
            console.log('Scan error (normal):', error);
          }
        );
      } catch (error) {
        console.error('Scanner initialization error:', error);
        setScannerError('Failed to start camera. Please check permissions.');
        stopScanner();
      }
    }, 100);
  };

  // Stop Scanner
  const stopScanner = () => {
    if (html5QrcodeScannerRef.current) {
      try {
        html5QrcodeScannerRef.current.clear();
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
      html5QrcodeScannerRef.current = null;
    }
    setScannerActive(false);
    setScanMode(null);
    setScannerError(null);
  };

  // Handle Barcode Scan Result
  const handleBarcodeScan = (scannedValue, mode) => {
    const cleanValue = scannedValue.trim().toUpperCase();
    
    if (mode === 'patient') {
      setHhid(cleanValue);
      setTimeout(() => nurseInputRef.current?.focus(), 100);
    } else if (mode === 'nurse') {
      setNurseId(cleanValue);
      if (requireCabinet) {
        setTimeout(() => cabinetInputRef.current?.focus(), 100);
      }
    } else if (mode === 'cabinet') {
      setCabinetId(cleanValue);
      setCabinetUnlocked(false);
      setShowCabinetAlert(true);
    }

    stopScanner();
    playSuccessSound();
  };

  // Play Success Sound
  const playSuccessSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const handleScan = () => {
    if (requireCabinet) {
      if (hhid && nurseId && cabinetId && cabinetUnlocked) {
        onScan(hhid.toUpperCase(), nurseId.toUpperCase(), cabinetId.toUpperCase());
        setShowPatientDropdown(false);
        setShowNurseDropdown(false);
      } else if (!cabinetUnlocked) {
        setShowCabinetAlert(true);
      }
    } else {
      if (hhid && nurseId) {
        onScan(hhid.toUpperCase(), nurseId.toUpperCase());
        setShowPatientDropdown(false);
        setShowNurseDropdown(false);
      }
    }
  };

  const handleReset = () => {
    setHhid('');
    setNurseId('');
    setCabinetId('');
    setCabinetUnlocked(false);
    setShowCabinetAlert(false);
    setPatientSuggestions([]);
    setNurseSuggestions([]);
    setShowPatientDropdown(false);
    setShowNurseDropdown(false);
    stopScanner();
    onReset();
  };

  const selectPatient = (patient) => {
    setHhid(patient.hhid);
    setShowPatientDropdown(false);
    nurseInputRef.current?.focus();
  };

  const selectNurse = (nurse) => {
    setNurseId(nurse.id);
    setShowNurseDropdown(false);
    if (requireCabinet) {
      setTimeout(() => cabinetInputRef.current?.focus(), 100);
    }
  };

  const handlePatientKeyDown = (e) => {
    if (!showPatientDropdown) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => Math.min(prev + 1, patientSuggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault();
      selectPatient(patientSuggestions[focusedIndex]);
      setFocusedIndex(-1);
    } else if (e.key === 'Escape') {
      setShowPatientDropdown(false);
      setFocusedIndex(-1);
    }
  };

  // Manual Cabinet Unlock (for demo purposes)
  const handleManualUnlock = () => {
    setCabinetUnlocked(true);
    setShowCabinetAlert(false);
    playSuccessSound();
  };

  return (
    <Card className="border-2 border-blue-200 shadow-xl sm:shadow-2xl overflow-hidden relative group">
      
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Custom Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-3 sm:p-4 md:p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-white/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="relative z-10">
          <h3 className="flex items-center gap-2 text-sm sm:text-base md:text-lg font-bold mb-1">
            <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg backdrop-blur-sm animate-bounce">
              <Scan size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
            <span className="truncate">
              {requireCabinet ? 'Smart Authentication System' : 'Patient & Nurse Verification'}
            </span>
          </h3>
          <p className="text-white/90 text-[10px] sm:text-xs md:text-sm flex items-center gap-2">
            <Sparkles size={12} className="flex-shrink-0 animate-pulse" />
            <span className="truncate">
              {requireCabinet ? 'Scan ID + Unlock Cabinet' : 'Scan barcode or type to search'}
            </span>
          </p>
        </div>
      </div>

      <CardContent className="p-3 sm:p-4 md:p-6 relative z-10">
        
        {/* Barcode Scanner View */}
        {scannerActive && (
          <div className="mb-6 animate-in slide-in-from-top duration-500">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-4 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 p-2 rounded-lg animate-pulse">
                    <Camera size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      Scanning {scanMode === 'patient' ? 'Patient HHID' : scanMode === 'nurse' ? 'Nurse ID' : 'Cabinet ID'}
                    </h4>
                    <p className="text-xs text-slate-600">Position barcode within frame</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={stopScanner}
                  className="border-red-300 hover:bg-red-50 hover:border-red-500"
                >
                  <CameraOff size={14} className="mr-1" />
                  Stop
                </Button>
              </div>

              <div 
                id="barcode-scanner-container"
                ref={scannerRef}
                className="rounded-lg overflow-hidden bg-black/5"
              />

              {scannerError && (
                <div className="mt-4 bg-red-50 border-2 border-red-300 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900 text-sm">Camera Error</p>
                    <p className="text-xs text-red-700 mt-1">{scannerError}</p>
                  </div>
                </div>
              )}

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-white rounded-lg p-2 border border-blue-200">
                  <p className="font-semibold text-blue-900">📱 Hold Steady</p>
                  <p className="text-slate-600 text-[10px]">Keep device stable</p>
                </div>
                <div className="bg-white rounded-lg p-2 border border-blue-200">
                  <p className="font-semibold text-blue-900">💡 Good Light</p>
                  <p className="text-slate-600 text-[10px]">Ensure proper lighting</p>
                </div>
                <div className="bg-white rounded-lg p-2 border border-blue-200">
                  <p className="font-semibold text-blue-900">🎯 Center Code</p>
                  <p className="text-slate-600 text-[10px]">Align within box</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cabinet Lock Alert */}
        {showCabinetAlert && !cabinetUnlocked && cabinetId && (
          <div className="mb-6 animate-in slide-in-from-top duration-500">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-400 rounded-xl p-4 relative overflow-hidden">
              <div className="flex items-start gap-3">
                <div className="bg-amber-500 p-2 rounded-lg animate-pulse flex-shrink-0">
                  <Lock size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-amber-900 text-sm sm:text-base mb-2">
                    🔐 Cabinet Access Required
                  </h4>
                  <p className="text-xs sm:text-sm text-amber-800 mb-3">
                    Please physically unlock <span className="font-mono font-bold">{cabinetId}</span> to proceed with medication administration.
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 bg-white rounded-lg p-2 border border-amber-300">
                      <p className="text-xs text-slate-600">Waiting for IoT signal...</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Radio size={12} className="text-amber-600 animate-pulse" />
                        <div className="flex-1 bg-amber-100 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-amber-500 h-1.5 rounded-full animate-pulse" style={{width: '70%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Manual unlock for demo */}
                  <Button
                    size="sm"
                    onClick={handleManualUnlock}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Unlock size={14} className="mr-2" />
                    Simulate Cabinet Unlock (Demo)
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cabinet Unlocked Success */}
        {cabinetUnlocked && cabinetId && (
          <div className="mb-4 animate-in slide-in-from-top duration-500">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 rounded-xl p-3 flex items-center gap-3">
              <div className="bg-green-500 p-2 rounded-lg animate-bounce">
                <Unlock size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-green-900 text-sm">✅ Cabinet Unlocked!</p>
                <p className="text-xs text-green-700">
                  <span className="font-mono font-bold">{cabinetId}</span> is now accessible
                </p>
              </div>
              <CheckCircle2 size={20} className="text-green-600" />
            </div>
          </div>
        )}

        {!currentPatient && !scannerActive ? (
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            
            {/* Patient HHID */}
            <div className="space-y-2 relative">
              <label className="text-xs sm:text-sm font-semibold flex items-center gap-2 text-slate-700">
                <div className="bg-blue-100 p-1 sm:p-1.5 rounded-md">
                  <User size={12} className="sm:w-3.5 sm:h-3.5 text-blue-600" />
                </div>
                Patient HHID / Name
              </label>
              
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    ref={patientInputRef}
                    placeholder="Type HH001 or name..."
                    value={hhid}
                    onChange={(e) => setHhid(e.target.value)}
                    onKeyDown={handlePatientKeyDown}
                    onFocus={() => hhid && setShowPatientDropdown(patientSuggestions.length > 0)}
                    className="text-sm sm:text-base md:text-lg font-mono pr-10 h-11 sm:h-12 border-2 border-slate-200 focus:border-blue-500 transition-colors"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 animate-pulse" size={16} />
                </div>
                
                <Button
                  type="button"
                  onClick={() => startScanner('patient')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-11 sm:h-12 px-4 shadow-lg hover:shadow-xl transition-all"
                >
                  <Camera size={18} className="sm:mr-2" />
                  <span className="hidden sm:inline">Scan</span>
                </Button>
              </div>
              
              {showPatientDropdown && patientSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white border-2 border-blue-200 rounded-lg sm:rounded-xl shadow-2xl max-h-56 sm:max-h-64 overflow-y-auto animate-in slide-in-from-top duration-300">
                  {patientSuggestions.map((patient, index) => (
                    <div
                      key={patient.hhid}
                      onClick={() => selectPatient(patient)}
                      className={`p-2.5 sm:p-3 cursor-pointer transition-all duration-200 border-b border-slate-100 last:border-0 active:bg-blue-100
                        ${focusedIndex === index ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-blue-50'}
                      `}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm sm:text-base text-slate-900 truncate">{patient.name}</p>
                          <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 items-center">
                            <Badge variant="outline" className="text-[10px] sm:text-xs font-mono bg-blue-50 border-blue-300">
                              {patient.hhid}
                            </Badge>
                            <span className="text-[10px] sm:text-xs text-slate-500 truncate">
                              {patient.age}Y • {patient.sex} • {patient.ward}
                            </span>
                          </div>
                        </div>
                        {patient.status === 'critical' && (
                          <Badge variant="destructive" className="text-[10px] sm:text-xs flex-shrink-0">Critical</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {hhid && !showPatientDropdown && patientSuggestions.length === 0 && (
                <p className="text-[10px] sm:text-xs text-amber-600 flex items-center gap-1 mt-1">
                  ⚠️ No patient found. Try different search.
                </p>
              )}
            </div>

            {/* Nurse ID */}
            <div className="space-y-2 relative">
              <label className="text-xs sm:text-sm font-semibold flex items-center gap-2 text-slate-700">
                <div className="bg-blue-100 p-1 sm:p-1.5 rounded-md">
                  <IdCard size={12} className="sm:w-3.5 sm:h-3.5 text-blue-600" />
                </div>
                Nurse ID / Name
              </label>
              
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    ref={nurseInputRef}
                    placeholder="Type N001 or name..."
                    value={nurseId}
                    onChange={(e) => setNurseId(e.target.value)}
                    onFocus={() => nurseId && setShowNurseDropdown(nurseSuggestions.length > 0)}
                    className="text-sm sm:text-base md:text-lg font-mono pr-10 h-11 sm:h-12 border-2 border-slate-200 focus:border-blue-500 transition-colors"
                    onKeyPress={(e) => e.key === 'Enter' && !requireCabinet && handleScan()}
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 animate-pulse" size={16} />
                </div>
                
                <Button
                  type="button"
                  onClick={() => startScanner('nurse')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 h-11 sm:h-12 px-4 shadow-lg hover:shadow-xl transition-all"
                >
                  <Camera size={18} className="sm:mr-2" />
                  <span className="hidden sm:inline">Scan</span>
                </Button>
              </div>
              
              {showNurseDropdown && nurseSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white border-2 border-blue-200 rounded-lg sm:rounded-xl shadow-2xl max-h-44 sm:max-h-48 overflow-y-auto animate-in slide-in-from-top duration-300">
                  {nurseSuggestions.map((nurse) => (
                    <div
                      key={nurse.id}
                      onClick={() => selectNurse(nurse)}
                      className="p-2.5 sm:p-3 cursor-pointer hover:bg-blue-50 active:bg-blue-100 transition-all duration-200 border-b border-slate-100 last:border-0"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                          <IdCard size={14} className="sm:w-4 sm:h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm sm:text-base text-slate-900 truncate">{nurse.name}</p>
                          <Badge variant="outline" className="text-[10px] sm:text-xs font-mono mt-1 bg-blue-50 border-blue-300">
                            {nurse.id}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cabinet/Rack ID (Only if required) */}
            {requireCabinet && (
              <div className="space-y-2 relative">
                <label className="text-xs sm:text-sm font-semibold flex items-center gap-2 text-slate-700">
                  <div className="bg-purple-100 p-1 sm:p-1.5 rounded-md">
                    <Box size={12} className="sm:w-3.5 sm:h-3.5 text-purple-600" />
                  </div>
                  Cabinet / Rack ID
                  {cabinetUnlocked && (
                    <Badge className="bg-green-100 text-green-700 text-[10px] ml-auto">
                      <Unlock size={10} className="mr-1" />
                      Unlocked
                    </Badge>
                  )}
                </label>
                
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      ref={cabinetInputRef}
                      placeholder="Type CAB-A1 or scan..."
                      value={cabinetId}
                      onChange={(e) => {
                        setCabinetId(e.target.value);
                        setCabinetUnlocked(false);
                      }}
                      className="text-sm sm:text-base md:text-lg font-mono pr-10 h-11 sm:h-12 border-2 border-slate-200 focus:border-purple-500 transition-colors"
                      onKeyPress={(e) => e.key === 'Enter' && handleScan()}
                    />
                    {cabinetUnlocked ? (
                      <Unlock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 animate-pulse" size={16} />
                    ) : (
                      <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-500 animate-pulse" size={16} />
                    )}
                  </div>
                  
                  <Button
                    type="button"
                    onClick={() => startScanner('cabinet')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-11 sm:h-12 px-4 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Camera size={18} className="sm:mr-2" />
                    <span className="hidden sm:inline">Scan</span>
                  </Button>
                </div>
                
                {/* Cabinet List */}
                {cabinetId && (
                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-200 text-xs">
                    <p className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Box size={12} />
                      Available Cabinets:
                    </p>
                    <div className="space-y-1">
                      {cabinets
                        .filter(cab => cab.id.toLowerCase().includes(cabinetId.toLowerCase()))
                        .slice(0, 3)
                        .map(cab => (
                          <div
                            key={cab.id}
                            onClick={() => {
                              setCabinetId(cab.id);
                              setCabinetUnlocked(false);
                              setShowCabinetAlert(true);
                            }}
                            className="p-2 bg-white rounded border border-slate-200 hover:border-purple-400 hover:bg-purple-50 cursor-pointer transition-all"
                          >
                            <p className="font-mono font-bold text-slate-900">{cab.id}</p>
                            <p className="text-[10px] text-slate-600">{cab.name} • {cab.location}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Verify Button */}
            <Button 
              onClick={handleScan}
              disabled={requireCabinet ? (!hhid || !nurseId || !cabinetId || !cabinetUnlocked) : (!hhid || !nurseId)}
              className="w-full h-12 sm:h-14 text-sm sm:text-base md:text-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 disabled:opacity-50 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 font-bold"
            >
              <CheckCircle2 className="mr-2 animate-pulse" size={20} />
              {requireCabinet && !cabinetUnlocked ? 'Unlock Cabinet First' : 'Verify & Authenticate'}
            </Button>

            {/* Status Checklist */}
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs">
              <p className="font-semibold text-slate-700 mb-2">Authentication Checklist:</p>
              <div className="space-y-1.5">
                <div className={`flex items-center gap-2 ${hhid ? 'text-green-700' : 'text-slate-500'}`}>
                  {hhid ? <CheckCircle2 size={14} /> : <div className="w-3.5 h-3.5 border-2 border-slate-300 rounded-full" />}
                  <span>Patient ID Scanned</span>
                </div>
                <div className={`flex items-center gap-2 ${nurseId ? 'text-green-700' : 'text-slate-500'}`}>
                  {nurseId ? <CheckCircle2 size={14} /> : <div className="w-3.5 h-3.5 border-2 border-slate-300 rounded-full" />}
                  <span>Nurse ID Verified</span>
                </div>
                {requireCabinet && (
                  <>
                    <div className={`flex items-center gap-2 ${cabinetId ? 'text-green-700' : 'text-slate-500'}`}>
                      {cabinetId ? <CheckCircle2 size={14} /> : <div className="w-3.5 h-3.5 border-2 border-slate-300 rounded-full" />}
                      <span>Cabinet Selected</span>
                    </div>
                    <div className={`flex items-center gap-2 ${cabinetUnlocked ? 'text-green-700' : 'text-slate-500'}`}>
                      {cabinetUnlocked ? <CheckCircle2 size={14} /> : <div className="w-3.5 h-3.5 border-2 border-slate-300 rounded-full" />}
                      <span>Cabinet Unlocked</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Quick Test Buttons */}
            <div className="border-t-2 border-dashed border-blue-200 pt-3 sm:pt-4 mt-3 sm:mt-4">
              <p className="text-[10px] sm:text-xs text-slate-500 mb-2 flex items-center gap-1">
                <Sparkles size={10} className="sm:w-3 sm:h-3" />
                Quick Demo Access:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setHhid('HH001');
                    setNurseId('N001');
                    if (requireCabinet) {
                      setCabinetId('CAB-A1');
                    }
                  }}
                  className="text-xs sm:text-sm h-9 sm:h-10 hover:bg-blue-50 hover:border-blue-400 active:bg-blue-100 transition-all border-blue-200"
                >
                  <Activity size={12} className="mr-1" />
                  Load HH001
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setHhid('HH005');
                    setNurseId('N001');
                    if (requireCabinet) {
                      setCabinetId('CAB-B1');
                    }
                  }}
                  className="text-xs sm:text-sm h-9 sm:h-10 hover:bg-blue-50 hover:border-blue-400 active:bg-blue-100 transition-all border-blue-200"
                >
                  <Activity size={12} className="mr-1" />
                  Load HH005
                </Button>
              </div>
            </div>
          </div>
        ) : !scannerActive ? (
          // Authenticated State (keep your existing authenticated UI)
          <div className="space-y-3 sm:space-y-4 animate-in zoom-in duration-500">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 relative overflow-hidden">
              
              <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
              
              <div className="flex items-center justify-between mb-3 sm:mb-4 relative z-10 gap-2">
                <div className="flex items-center gap-2 sm:gap-3 text-blue-700 flex-1 min-w-0">
                  <div className="bg-blue-500 p-1.5 sm:p-2 rounded-full animate-bounce flex-shrink-0">
                    <CheckCircle2 size={18} className="sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-sm sm:text-base md:text-lg block truncate">
                      ✅ {requireCabinet ? 'Full Authentication Success!' : 'Authentication Success!'}
                    </span>
                    <span className="text-[10px] sm:text-xs text-blue-600 block truncate">
                      {requireCabinet ? 'Cabinet unlocked • Access granted' : 'Access granted'}
                    </span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleReset}
                  className="h-8 sm:h-9 px-2 sm:px-3 border-red-300 hover:bg-red-50 hover:border-red-500 active:bg-red-100 transition-all flex-shrink-0"
                >
                  <X size={14} className="sm:mr-1" />
                  <span className="hidden sm:inline">Clear</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 relative z-10">
                
                {/* Patient Info Card */}
                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md border-l-4 border-l-blue-500 hover:shadow-lg active:shadow-xl transition-shadow">
                  <p className="text-[10px] sm:text-xs text-slate-500 uppercase font-bold mb-1.5 sm:mb-2 flex items-center gap-1">
                    <User size={10} className="sm:w-3 sm:h-3" />
                    Patient
                  </p>
                  <p className="font-bold text-base sm:text-lg md:text-xl mb-2 text-slate-900 truncate">{currentPatient.name}</p>
                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
                    <Badge variant="outline" className="text-[10px] sm:text-xs font-mono bg-blue-50 border-blue-300">
                      {currentPatient.hhid}
                    </Badge>
                    <Badge 
                      variant={currentPatient.status === 'critical' ? 'destructive' : 'default'} 
                      className="text-[10px] sm:text-xs animate-pulse"
                    >
                      {currentPatient.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-600 space-y-1 bg-slate-50 p-2 rounded-md">
                    <p className="flex items-center justify-between gap-2">
                      <span>Age / Sex:</span>
                      <span className="font-semibold">{currentPatient.age}Y • {currentPatient.sex}</span>
                    </p>
                    <p className="flex items-center justify-between gap-2">
                      <span>Ward / Bed:</span>
                      <span className="font-semibold truncate">{currentPatient.ward} - {currentPatient.bed}</span>
                    </p>
                    <p className="flex items-center justify-between gap-2">
                      <span>Weight:</span>
                      <span className="font-semibold">{currentPatient.weight} kg</span>
                    </p>
                  </div>
                </div>

                {/* Nurse Info Card */}
                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md border-l-4 border-l-blue-600 hover:shadow-lg active:shadow-xl transition-shadow">
                  <p className="text-[10px] sm:text-xs text-slate-500 uppercase font-bold mb-1.5 sm:mb-2 flex items-center gap-1">
                    <IdCard size={10} className="sm:w-3 sm:h-3" />
                    Nurse
                  </p>
                  <p className="font-bold text-base sm:text-lg md:text-xl mb-2 text-slate-900 truncate">{currentNurse.name}</p>
                  <Badge variant="outline" className="text-[10px] sm:text-xs font-mono mb-2 sm:mb-3 bg-blue-50 border-blue-300">
                    {currentNurse.id}
                  </Badge>
                  <div className="text-[10px] sm:text-xs text-slate-600 space-y-1 bg-slate-50 p-2 rounded-md">
                    <p className="flex items-center justify-between gap-2">
                      <span>Role:</span>
                      <span className="font-semibold">Staff Nurse</span>
                    </p>
                    <p className="flex items-center justify-between gap-2">
                      <span>Time:</span>
                      <span className="font-semibold">{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </p>
                    <p className="text-blue-600 font-bold flex items-center gap-1">
                      <CheckCircle2 size={10} className="sm:w-3 sm:h-3" />
                      Access Granted
                    </p>
                  </div>
                </div>
              </div>

              {/* Cabinet Info (if applicable) */}
              {requireCabinet && cabinetId && (
                <div className="mt-3 sm:mt-4 bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md border-l-4 border-l-green-500 relative z-10">
                  <p className="text-[10px] sm:text-xs text-slate-500 uppercase font-bold mb-1.5 sm:mb-2 flex items-center gap-1">
                    <Box size={10} className="sm:w-3 sm:h-3" />
                    Cabinet Access
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-bold text-base sm:text-lg text-slate-900 font-mono">{cabinetId}</p>
                      <p className="text-[10px] sm:text-xs text-slate-600 mt-1">
                        {cabinets.find(c => c.id === cabinetId)?.name || 'Medication Cabinet'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Unlock size={20} className="text-green-600 animate-pulse" />
                      <Badge className="bg-green-100 text-green-700">
                        Unlocked
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
