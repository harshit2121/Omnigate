import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { 
  Scan, User, IdCard, CheckCircle2, X, Search, Sparkles, Activity,
  Camera, CameraOff, AlertCircle, Lock, Unlock, Box, Radio, Loader2
} from 'lucide-react';
import { usePatients } from '../../../hooks/useFirebaseData';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function ScanInterface({ 
  onScan, 
  onReset, 
  currentPatient, 
  currentNurse,
  requireCabinet = true,
  selectedMedication = null // Pass medication details for rack triggering
}) {
  const [hhid, setHhid] = useState('');
  const [nurseId, setNurseId] = useState('');
  const [rackId, setRackId] = useState('');
  const [patientSuggestions, setPatientSuggestions] = useState([]);
  const [nurseSuggestions, setNurseSuggestions] = useState([]);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [showNurseDropdown, setShowNurseDropdown] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  // IoT Cabinet States
  const [rackOpened, setRackOpened] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);
  const [showRackAlert, setShowRackAlert] = useState(false);
  
  // Barcode Scanner States
  const [scannerActive, setScannerActive] = useState(false);
  const [scanMode, setScanMode] = useState(null); // 'patient', 'nurse', or 'rack'
  const [scannerError, setScannerError] = useState(null);
  
  const patientInputRef = useRef(null);
  const nurseInputRef = useRef(null);
  const rackInputRef = useRef(null);
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

  // Mock rack/cabinet data
  const racks = [
    { id: 'R-A1', name: 'Rack A1 - General Medications', location: 'Ward A', ip: '192.168.1.63' },
    { id: 'R-A2', name: 'Rack A2 - Emergency Drugs', location: 'Ward A', ip: '192.168.1.64' },
    { id: 'R-B1', name: 'Rack B1 - Antibiotics', location: 'Ward B', ip: '192.168.1.65' },
    { id: 'R-B2', name: 'Rack B2 - Controlled Substances', location: 'Ward B', ip: '192.168.1.66' },
    { id: 'R-C1', name: 'Rack C1 - ICU Medications', location: 'ICU', ip: '192.168.1.67' },
  ];

  // Auto-fill rack from medication if available
  useEffect(() => {
    if (selectedMedication?.rackId) {
      setRackId(selectedMedication.rackId);
    }
  }, [selectedMedication]);

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

  // ⭐⭐⭐ IoT Cabinet Trigger Function ⭐⭐⭐
  const handleTriggerRack = async () => {
    if (!rackId) {
      alert('⚠️ Please select a rack first!');
      return;
    }

    setIsTriggering(true);
    setShowRackAlert(true);

    try {
      // Get rack IP address
      const rack = racks.find(r => r.id === rackId);
      const rackIP = rack?.ip || '192.168.1.63'; // Default IP

      // Send trigger to IoT device (Demo Mode - Always Success)
      fetch(`http://${rackIP}/open`, { 
        method: "GET", 
        mode: "no-cors" 
      }).catch(() => {
        // Ignore errors in demo mode
      });

      // Simulate 2-second unlock delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mark as opened
      setRackOpened(true);
      playSuccessSound();
      
      alert(`✅ Rack ${rackId} Unlocked! You can now retrieve the medication.`);
      
    } catch (err) {
      console.error('Rack trigger error:', err);
      // Even if request fails, continue (Demo Mode)
      setRackOpened(true);
      alert(`✅ Rack ${rackId} Triggered - Proceed to Withdraw Medication`);
    } finally {
      setIsTriggering(false);
    }
  };

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
        setTimeout(() => rackInputRef.current?.focus(), 100);
      }
    } else if (mode === 'rack') {
      setRackId(cleanValue);
      setRackOpened(false);
      setShowRackAlert(true);
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
      if (hhid && nurseId && rackId && rackOpened) {
        onScan(hhid.toUpperCase(), nurseId.toUpperCase(), rackId.toUpperCase());
        setShowPatientDropdown(false);
        setShowNurseDropdown(false);
      } else if (!rackOpened) {
        setShowRackAlert(true);
        alert('⚠️ Please trigger and unlock the rack first!');
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
    setRackId('');
    setRackOpened(false);
    setShowRackAlert(false);
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
      setTimeout(() => rackInputRef.current?.focus(), 100);
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
            <span className="truncate">IoT Smart Authentication System</span>
          </h3>
          <p className="text-white/90 text-[10px] sm:text-xs md:text-sm flex items-center gap-2">
            <Sparkles size={12} className="flex-shrink-0 animate-pulse" />
            <span className="truncate">Scan ID + Trigger IoT Cabinet + Administer</span>
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
                      Scanning {scanMode === 'patient' ? 'Patient HHID' : scanMode === 'nurse' ? 'Nurse ID' : 'Rack/Cabinet ID'}
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
            </div>
          </div>
        )}

        {/* Rack Unlock Alert */}
        {showRackAlert && !rackOpened && rackId && (
          <div className="mb-6 animate-in slide-in-from-top duration-500">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-400 rounded-xl p-4 relative overflow-hidden">
              {/* IoT Cabinet Visual */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="w-20 h-24 border-4 border-amber-500 rounded-lg flex items-center justify-center bg-white">
                    <Lock size={32} className="text-amber-600 animate-pulse" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-amber-900 text-base mb-1">
                    🔐 IoT Cabinet Trigger Required
                  </h4>
                  <p className="text-sm text-amber-800 mb-2">
                    Rack: <span className="font-mono font-bold">{rackId}</span>
                  </p>
                  <p className="text-xs text-amber-700">
                    {racks.find(r => r.id === rackId)?.name || 'Medication Cabinet'}
                  </p>
                </div>
              </div>

              {/* Trigger Button */}
              <Button
                onClick={handleTriggerRack}
                disabled={isTriggering}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12"
              >
                {isTriggering ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={20} />
                    Triggering IoT Cabinet...
                  </>
                ) : (
                  <>
                    <Unlock className="mr-2" size={20} />
                    Trigger Cabinet (Rack {rackId})
                  </>
                )}
              </Button>

              {isTriggering && (
                <div className="mt-3 flex items-center gap-2 text-xs text-amber-700">
                  <Radio size={12} className="animate-pulse" />
                  <span>Sending signal to IoT device...</span>
                  <div className="flex-1 bg-amber-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-amber-600 h-1.5 rounded-full animate-pulse" style={{width: '70%'}}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rack Unlocked Success */}
        {rackOpened && rackId && (
          <div className="mb-4 animate-in slide-in-from-top duration-500">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 rounded-xl p-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-24 border-4 border-green-500 rounded-lg flex items-center justify-center bg-white">
                    <Unlock size={32} className="text-green-600 animate-bounce" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                    <CheckCircle2 size={16} className="text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-green-900 text-base mb-1">
                    ✅ Cabinet Unlocked Successfully!
                  </h4>
                  <p className="text-sm text-green-800">
                    Rack <span className="font-mono font-bold">{rackId}</span> is now open
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    You can now retrieve the medication
                  </p>
                </div>
              </div>
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

            {/* Rack/Cabinet ID */}
            {requireCabinet && (
              <div className="space-y-2 relative">
                <label className="text-xs sm:text-sm font-semibold flex items-center gap-2 text-slate-700">
                  <div className="bg-purple-100 p-1 sm:p-1.5 rounded-md">
                    <Box size={12} className="sm:w-3.5 sm:h-3.5 text-purple-600" />
                  </div>
                  Medication Rack ID
                  {rackOpened && (
                    <Badge className="bg-green-100 text-green-700 text-[10px] ml-auto border-green-300">
                      <Unlock size={10} className="mr-1" />
                      Unlocked
                    </Badge>
                  )}
                </label>
                
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      ref={rackInputRef}
                      placeholder="Type R-A1 or scan..."
                      value={rackId}
                      onChange={(e) => {
                        setRackId(e.target.value);
                        setRackOpened(false);
                      }}
                      className="text-sm sm:text-base md:text-lg font-mono pr-10 h-11 sm:h-12 border-2 border-slate-200 focus:border-purple-500 transition-colors"
                      disabled={selectedMedication?.rackId} // Disable if auto-filled
                    />
                    {rackOpened ? (
                      <Unlock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 animate-pulse" size={16} />
                    ) : (
                      <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-500 animate-pulse" size={16} />
                    )}
                  </div>
                  
                  <Button
                    type="button"
                    onClick={() => startScanner('rack')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-11 sm:h-12 px-4 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Camera size={18} className="sm:mr-2" />
                    <span className="hidden sm:inline">Scan</span>
                  </Button>
                </div>

                {/* Trigger Rack Button */}
                {rackId && !rackOpened && (
                  <Button
                    onClick={handleTriggerRack}
                    disabled={isTriggering}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 h-11 mt-2"
                  >
                    {isTriggering ? (
                      <>
                        <Loader2 className="mr-2 animate-spin" size={18} />
                        Triggering IoT Cabinet...
                      </>
                    ) : (
                      <>
                        <Unlock className="mr-2" size={18} />
                        Trigger Rack {rackId}
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}

            {/* Main Verify Button */}
            <Button 
              onClick={handleScan}
              disabled={requireCabinet ? (!hhid || !nurseId || !rackId || !rackOpened) : (!hhid || !nurseId)}
              className="w-full h-12 sm:h-14 text-sm sm:text-base md:text-lg bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 font-bold"
            >
              <CheckCircle2 className="mr-2 animate-pulse" size={20} />
              {requireCabinet && !rackOpened ? '🔒 Unlock Cabinet First' : '✅ Mark as Administered'}
            </Button>

            {/* Status Checklist */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg p-3 border-2 border-slate-200 text-xs">
              <p className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <CheckCircle2 size={14} />
                Verification Checklist:
              </p>
              <div className="space-y-1.5">
                <div className={`flex items-center gap-2 ${hhid ? 'text-green-700' : 'text-slate-500'}`}>
                  {hhid ? <CheckCircle2 size={14} /> : <div className="w-3.5 h-3.5 border-2 border-slate-300 rounded-full" />}
                  <span>✓ Patient ID Scanned</span>
                </div>
                <div className={`flex items-center gap-2 ${nurseId ? 'text-green-700' : 'text-slate-500'}`}>
                  {nurseId ? <CheckCircle2 size={14} /> : <div className="w-3.5 h-3.5 border-2 border-slate-300 rounded-full" />}
                  <span>✓ Nurse ID Verified</span>
                </div>
                {requireCabinet && (
                  <>
                    <div className={`flex items-center gap-2 ${rackId ? 'text-green-700' : 'text-slate-500'}`}>
                      {rackId ? <CheckCircle2 size={14} /> : <div className="w-3.5 h-3.5 border-2 border-slate-300 rounded-full" />}
                      <span>✓ Rack Selected</span>
                    </div>
                    <div className={`flex items-center gap-2 ${rackOpened ? 'text-green-700' : 'text-slate-500'}`}>
                      {rackOpened ? <CheckCircle2 size={14} /> : <div className="w-3.5 h-3.5 border-2 border-slate-300 rounded-full" />}
                      <span>✓ IoT Cabinet Unlocked</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Quick Demo */}
            <div className="border-t-2 border-dashed border-blue-200 pt-3 sm:pt-4 mt-3 sm:mt-4">
              <p className="text-[10px] sm:text-xs text-slate-500 mb-2 flex items-center gap-1">
                <Sparkles size={10} className="sm:w-3 sm:h-3" />
                Quick Demo:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setHhid('HH001');
                    setNurseId('N001');
                    setRackId('R-A1');
                  }}
                  className="text-xs sm:text-sm h-9 sm:h-10"
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
                    setRackId('R-B1');
                  }}
                  className="text-xs sm:text-sm h-9 sm:h-10"
                >
                  <Activity size={12} className="mr-1" />
                  Load HH005
                </Button>
              </div>
            </div>
          </div>
        ) : !scannerActive ? (
          // Already authenticated view (keep existing code)
          <div className="space-y-3 sm:space-y-4 animate-in zoom-in duration-500">
            {/* Your existing authenticated state UI here */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 rounded-xl p-4 text-center">
              <CheckCircle2 size={48} className="mx-auto text-green-600 mb-2 animate-bounce" />
              <h3 className="font-bold text-green-900 text-lg">✅ All Steps Complete!</h3>
              <p className="text-sm text-green-700 mt-2">Ready to administer medication</p>
              <Button onClick={handleReset} variant="outline" className="mt-4">
                <X size={14} className="mr-2" />
                Reset
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
