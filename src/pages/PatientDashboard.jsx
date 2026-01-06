import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { 
  ArrowLeft, User, Calendar, Stethoscope, Save, Loader2, 
  CheckCircle2, AlertTriangle, UserPlus, FileText, Printer, 
  Download, QrCode, Camera, Phone, Mail, MapPin, Home, Heart, 
  Pill, Shield, Clock, Sparkles, Activity, Building2, Briefcase,
  Users, Copy, X as CloseIcon, Plus, Eye, RefreshCw, Image as ImageIcon
} from 'lucide-react';
import { addPatient } from '../services/firebasePatients';
import { useReactToPrint } from 'react-to-print';
import QRCode from 'qrcode';

export default function PatientRegistration() {
  const navigate = useNavigate();
  const printRef = useRef();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredPatient, setRegisteredPatient] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [generatedHHID, setGeneratedHHID] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    dateOfBirth: '',
    bloodGroup: '',
    phone: '',
    email: '',
    emergencyContact: '',
    emergencyRelation: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    weight: '',
    height: '',
    bmi: '',
    bloodPressure: '',
    pulse: '',
    temperature: '',
    spo2: '',
    diagnosis: '',
    provisionalDiagnosis: '',
    chiefComplaints: '',
    allergies: '',
    currentMedications: '',
    pastMedicalHistory: '',
    surgicalHistory: '',
    familyHistory: '',
    ward: '',
    bed: '',
    status: 'stable',
    admissionDate: new Date().toISOString().split('T')[0],
    referringDoctor: '',
    consultingDoctor: '',
    insuranceProvider: '',
    insuranceNumber: '',
    paymentMethod: 'Cash',
    occupation: '',
    maritalStatus: 'Single',
    nationality: 'Indian',
    notes: '',
  });

  // Calculate BMI
  const calculateBMI = (weight, height) => {
    if (weight && height) {
      const heightInMeters = height / 100;
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      return bmi;
    }
    return '';
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    if (name === 'weight' || name === 'height') {
      updatedData.bmi = calculateBMI(
        name === 'weight' ? value : formData.weight,
        name === 'height' ? value : formData.height
      );
    }

    setFormData(updatedData);
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: null });
    }
  };

  // Validation
  const validateStep = (step) => {
    const errors = {};
    if (step === 1) {
      if (!formData.name.trim()) errors.name = 'Name is required';
      if (!formData.age) errors.age = 'Age is required';
      if (!formData.phone) errors.phone = 'Phone number is required';
      if (formData.phone && formData.phone.length !== 10) errors.phone = 'Invalid phone number';
    }
    if (step === 3) {
      if (!formData.ward) errors.ward = 'Ward is required';
      if (!formData.bed) errors.bed = 'Bed number is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Navigation
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  // Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Generate HHID
  const generateHHID = () => {
    const prefix = 'HH';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  };

  // Generate QR Code
  const generateQRCode = async (hhid) => {
    try {
      const qrData = JSON.stringify({
        hhid: hhid,
        name: formData.name,
        age: formData.age,
        bloodGroup: formData.bloodGroup,
        allergies: formData.allergies,
        ward: formData.ward,
        bed: formData.bed,
      });
      const qrUrl = await QRCode.toDataURL(qrData, { width: 300, margin: 2 });
      setQrCodeUrl(qrUrl);
      return qrUrl;
    } catch (error) {
      console.error('QR Code generation error:', error);
      return '';
    }
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      const hhid = generateHHID();
      setGeneratedHHID(hhid);
      await generateQRCode(hhid);

      const patientData = {
        hhid,
        ...formData,
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight) || 0,
        height: parseFloat(formData.height) || 0,
        bmi: parseFloat(formData.bmi) || 0,
        profilePhoto,
        registeredAt: new Date().toISOString(),
        isActive: true,
      };

      const result = await addPatient(patientData);

      if (result.success) {
        setRegisteredPatient({ ...patientData, id: result.patientId });
        setShowSuccessModal(true);
      } else {
        alert(`❌ Registration Failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('❌ An error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Print Handler
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Patient_Registration_${generatedHHID}`,
    pageStyle: `
      @page { size: A4; margin: 15mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `,
  });

  const steps = [
    { number: 1, title: 'Basic Info', icon: User },
    { number: 2, title: 'Medical', icon: Stethoscope },
    { number: 3, title: 'Hospital', icon: Building2 },
    { number: 4, title: 'Review', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/dashboard')} size="sm">
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-lg">
                  <UserPlus size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Patient Registration</h1>
                  <p className="text-sm text-slate-600">New patient admission</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-green-600 to-emerald-600">
                <Shield size={12} className="mr-1" />
                Secure
              </Badge>
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">
                <Sparkles size={12} className="mr-1" />
                Smart
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        
        {/* Progress Stepper */}
        <Card className="border-2 border-blue-200 shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 -z-10">
                <motion.div
                  className="h-full bg-blue-600"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {steps.map((step) => (
                <div key={step.number} className="flex flex-col items-center flex-1">
                  <div className={`w-14 h-14 rounded-full ${
                    step.number < currentStep ? 'bg-green-500' :
                    step.number === currentStep ? 'bg-blue-600' : 'bg-slate-300'
                  } flex items-center justify-center text-white font-bold shadow-lg transition-all relative z-10`}>
                    {step.number < currentStep ? <CheckCircle2 size={24} /> : <step.icon size={24} />}
                  </div>
                  <p className="text-xs font-semibold mt-2 text-slate-700">{step.title}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form Card */}
        <form onSubmit={handleSubmit}>
          <Card className="border border-slate-200 shadow-lg">
            <CardContent className="p-8">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  
                  {/* STEP 1: Basic Info */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="bg-blue-100 p-3 rounded-xl">
                          <User size={28} className="text-blue-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-slate-900">Basic Information</h2>
                          <p className="text-sm text-slate-600">Patient demographics and contact details</p>
                        </div>
                      </div>

                      {/* Profile Photo */}
                      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                        <div className="relative">
                          {profilePhoto ? (
                            <img src={profilePhoto} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" />
                          ) : (
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center border-4 border-white shadow-lg">
                              <User size={48} className="text-blue-600" />
                            </div>
                          )}
                          <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-lg">
                            <Camera size={20} />
                            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                          </label>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 mb-1">Upload Profile Photo</p>
                          <p className="text-xs text-slate-600">JPG, PNG or GIF (max 5MB)</p>
                        </div>
                      </div>

                      {/* Personal Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-semibold mb-2 block">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter full name"
                            className={`h-11 ${validationErrors.name ? 'border-red-500' : ''}`}
                          />
                          {validationErrors.name && (
                            <p className="text-xs text-red-500 mt-1">{validationErrors.name}</p>
                          )}
                        </div>

                        <div>
                          <label className="text-sm font-semibold mb-2 block">
                            Age <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder="Enter age"
                            className={`h-11 ${validationErrors.age ? 'border-red-500' : ''}`}
                          />
                          {validationErrors.age && (
                            <p className="text-xs text-red-500 mt-1">{validationErrors.age}</p>
                          )}
                        </div>

                        <div>
                          <label className="text-sm font-semibold mb-2 block">Gender</label>
                          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full h-11 border border-slate-200 rounded-md px-3 outline-none focus:border-blue-500">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-semibold mb-2 block">Date of Birth</label>
                          <Input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="h-11" />
                        </div>

                        <div>
                          <label className="text-sm font-semibold mb-2 block">Blood Group</label>
                          <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full h-11 border border-slate-200 rounded-md px-3 outline-none focus:border-blue-500">
                            <option value="">Select</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-semibold mb-2 block">Marital Status</label>
                          <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full h-11 border border-slate-200 rounded-md px-3 outline-none focus:border-blue-500">
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Widowed">Widowed</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-semibold mb-2 block">Occupation</label>
                          <Input name="occupation" value={formData.occupation} onChange={handleChange} placeholder="Enter occupation" className="h-11" />
                        </div>

                        <div>
                          <label className="text-sm font-semibold mb-2 block">Nationality</label>
                          <Input name="nationality" value={formData.nationality} onChange={handleChange} placeholder="Enter nationality" className="h-11" />
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="pt-6 border-t border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <Phone size={20} className="text-blue-600" />
                          Contact Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-semibold mb-2 block">
                              Phone Number <span className="text-red-500">*</span>
                            </label>
                            <Input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="10-digit mobile number"
                              maxLength={10}
                              className={`h-11 ${validationErrors.phone ? 'border-red-500' : ''}`}
                            />
                            {validationErrors.phone && (
                              <p className="text-xs text-red-500 mt-1">{validationErrors.phone}</p>
                            )}
                          </div>

                          <div>
                            <label className="text-sm font-semibold mb-2 block">Email Address</label>
                            <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" className="h-11" />
                          </div>

                          <div>
                            <label className="text-sm font-semibold mb-2 block">Emergency Contact</label>
                            <Input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} placeholder="Emergency contact number" className="h-11" />
                          </div>

                          <div>
                            <label className="text-sm font-semibold mb-2 block">Relation</label>
                            <Input name="emergencyRelation" value={formData.emergencyRelation} onChange={handleChange} placeholder="e.g., Father, Mother" className="h-11" />
                          </div>

                          <div className="md:col-span-2">
                            <label className="text-sm font-semibold mb-2 block">Address</label>
                            <Textarea name="address" value={formData.address} onChange={handleChange} placeholder="Complete residential address" rows={2} />
                          </div>

                          <div>
                            <label className="text-sm font-semibold mb-2 block">City</label>
                            <Input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="h-11" />
                          </div>

                          <div>
                            <label className="text-sm font-semibold mb-2 block">State</label>
                            <Input name="state" value={formData.state} onChange={handleChange} placeholder="State" className="h-11" />
                          </div>

                          <div>
                            <label className="text-sm font-semibold mb-2 block">PIN Code</label>
                            <Input name="pincode" value={formData.pincode} onChange={handleChange} placeholder="6-digit PIN" maxLength={6} className="h-11" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Medical Info */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="bg-green-100 p-3 rounded-xl">
                          <Stethoscope size={28} className="text-green-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-slate-900">Medical Information</h2>
                          <p className="text-sm text-slate-600">Health metrics and medical history</p>
                        </div>
                      </div>

                      {/* Vital Signs */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <Activity size={20} className="text-green-600" />
                          Vital Signs
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <label className="text-xs font-semibold mb-1 block">Weight (kg)</label>
                            <Input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="kg" step="0.1" className="h-10" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold mb-1 block">Height (cm)</label>
                            <Input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="cm" step="0.1" className="h-10" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold mb-1 block">BMI</label>
                            <Input type="text" name="bmi" value={formData.bmi} readOnly placeholder="Auto" className="h-10 bg-slate-100" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold mb-1 block">BP (mmHg)</label>
                            <Input name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} placeholder="120/80" className="h-10" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold mb-1 block">Pulse (bpm)</label>
                            <Input type="number" name="pulse" value={formData.pulse} onChange={handleChange} placeholder="72" className="h-10" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold mb-1 block">Temp (°F)</label>
                            <Input type="number" name="temperature" value={formData.temperature} onChange={handleChange} placeholder="98.6" step="0.1" className="h-10" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold mb-1 block">SpO2 (%)</label>
                            <Input type="number" name="spo2" value={formData.spo2} onChange={handleChange} placeholder="98" className="h-10" />
                          </div>
                        </div>
                      </div>

                      {/* Clinical Information */}
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                            <FileText size={16} className="text-blue-600" />
                            Chief Complaints
                          </label>
                          <Textarea name="chiefComplaints" value={formData.chiefComplaints} onChange={handleChange} placeholder="Main symptoms" rows={3} />
                        </div>

                        <div>
                          <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                            <Stethoscope size={16} className="text-green-600" />
                            Provisional Diagnosis
                          </label>
                          <Input name="provisionalDiagnosis" value={formData.provisionalDiagnosis} onChange={handleChange} placeholder="Preliminary diagnosis" className="h-11" />
                        </div>

                        <div>
                          <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                            <Heart size={16} className="text-red-600" />
                            Final Diagnosis
                          </label>
                          <Input name="diagnosis" value={formData.diagnosis} onChange={handleChange} placeholder="Confirmed diagnosis" className="h-11" />
                        </div>

                        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
                          <label className="text-sm font-semibold mb-2 block flex items-center gap-2 text-red-900">
                            <AlertTriangle size={16} className="text-red-600" />
                            ⚠️ Allergies (Critical Information)
                          </label>
                          <Input name="allergies" value={formData.allergies} onChange={handleChange} placeholder="List all known allergies" className="h-11 border-red-300" />
                        </div>

                        <div>
                          <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                            <Pill size={16} className="text-purple-600" />
                            Current Medications
                          </label>
                          <Textarea name="currentMedications" value={formData.currentMedications} onChange={handleChange} placeholder="List medications" rows={2} />
                        </div>

                        <div>
                          <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                            <Clock size={16} className="text-amber-600" />
                            Past Medical History
                          </label>
                          <Textarea name="pastMedicalHistory" value={formData.pastMedicalHistory} onChange={handleChange} placeholder="Previous illnesses" rows={2} />
                        </div>

                        <div>
                          <label className="text-sm font-semibold mb-2 block">Surgical History</label>
                          <Textarea name="surgicalHistory" value={formData.surgicalHistory} onChange={handleChange} placeholder="Previous surgeries" rows={2} />
                        </div>

                        <div>
                          <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                            <Users size={16} className="text-indigo-600" />
                            Family History
                          </label>
                          <Textarea name="familyHistory" value={formData.familyHistory} onChange={handleChange} placeholder="Family medical history" rows={2} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Hospital Info */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="bg-purple-100 p-3 rounded-xl">
                          <Building2 size={28} className="text-purple-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-slate-900">Hospital & Admission</h2>
                          <p className="text-sm text-slate-600">Ward assignment and details</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-semibold mb-2 block">
                            Ward <span className="text-red-500">*</span>
                          </label>
                          <select name="ward" value={formData.ward} onChange={handleChange} className={`w-full h-11 border rounded-md px-3 outline-none focus:border-blue-500 ${validationErrors.ward ? 'border-red-500' : 'border-slate-200'}`}>
                            <option value="">Select Ward</option>
                            <option value="General Ward">General Ward</option>
                            <option value="ICU">ICU</option>
                            <option value="Emergency">Emergency</option>
                            <option value="Pediatrics">Pediatrics</option>
                            <option value="Maternity">Maternity</option>
                            <option value="Surgery">Surgery</option>
                            <option value="Cardiology">Cardiology</option>
                            <option value="Private Room">Private Room</option>
                          </select>
                          {validationErrors.ward && (
                            <p className="text-xs text-red-500 mt-1">{validationErrors.ward}</p>
                          )}
                        </div>

                        <div>
                          <label className="text-sm font-semibold mb-2 block">
                            Bed Number <span className="text-red-500">*</span>
                          </label>
                          <Input name="bed" value={formData.bed} onChange={handleChange} placeholder="e.g., 101" className={`h-11 ${validationErrors.bed ? 'border-red-500' : ''}`} />
                          {validationErrors.bed && (
                            <p className="text-xs text-red-500 mt-1">{validationErrors.bed}</p>
                          )}
                        </div>

                        <div>
                          <label className="text-sm font-semibold mb-2 block">Patient Status</label>
                          <select name="status" value={formData.status} onChange={handleChange} className="w-full h-11 border border-slate-200 rounded-md px-3 outline-none focus:border-blue-500">
                            <option value="stable">Stable</option>
                            <option value="critical">Critical</option>
                            <option value="moderate">Moderate</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-semibold mb-2 block">Admission Date</label>
                          <Input type="date" name="admissionDate" value={formData.admissionDate} onChange={handleChange} className="h-11" />
                        </div>

                        <div>
                          <label className="text-sm font-semibold mb-2 block">Referring Doctor</label>
                          <Input name="referringDoctor" value={formData.referringDoctor} onChange={handleChange} placeholder="Doctor name" className="h-11" />
                        </div>

                        <div>
                          <label className="text-sm font-semibold mb-2 block">Consulting Doctor</label>
                          <Input name="consultingDoctor" value={formData.consultingDoctor} onChange={handleChange} placeholder="Assigned consultant" className="h-11" />
                        </div>
                      </div>

                      <div className="pt-6 border-t border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <Shield size={20} className="text-blue-600" />
                          Insurance & Payment
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-semibold mb-2 block">Insurance Provider</label>
                            <Input name="insuranceProvider" value={formData.insuranceProvider} onChange={handleChange} placeholder="e.g., LIC, Star Health" className="h-11" />
                          </div>
                          <div>
                            <label className="text-sm font-semibold mb-2 block">Insurance Number</label>
                            <Input name="insuranceNumber" value={formData.insuranceNumber} onChange={handleChange} placeholder="Policy number" className="h-11" />
                          </div>
                          <div>
                            <label className="text-sm font-semibold mb-2 block">Payment Method</label>
                            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full h-11 border border-slate-200 rounded-md px-3 outline-none focus:border-blue-500">
                              <option value="Cash">Cash</option>
                              <option value="Card">Card</option>
                              <option value="Insurance">Insurance</option>
                              <option value="UPI">UPI</option>
                              <option value="Cheque">Cheque</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-semibold mb-2 block">Additional Notes</label>
                        <Textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Any other information" rows={3} />
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Review */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="bg-green-100 p-3 rounded-xl">
                          <CheckCircle2 size={28} className="text-green-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-slate-900">Review & Confirm</h2>
                          <p className="text-sm text-slate-600">Verify all information</p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6">
                        <div className="flex items-center gap-4 mb-6">
                          {profilePhoto ? (
                            <img src={profilePhoto} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg" />
                          ) : (
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-lg">
                              {formData.name[0] || 'P'}
                            </div>
                          )}
                          <div>
                            <h3 className="text-2xl font-bold text-slate-900">{formData.name || 'Patient Name'}</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge className="bg-blue-600">{formData.age || '0'}Y / {formData.gender}</Badge>
                              {formData.bloodGroup && <Badge className="bg-red-600">{formData.bloodGroup}</Badge>}
                              <Badge className={
                                formData.status === 'critical' ? 'bg-red-600' :
                                formData.status === 'stable' ? 'bg-green-600' : 'bg-yellow-600'
                              }>{formData.status.toUpperCase()}</Badge>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <ReviewItem label="Ward" value={formData.ward || 'Not set'} />
                          <ReviewItem label="Bed" value={formData.bed || 'Not set'} />
                          <ReviewItem label="Admission" value={formData.admissionDate} />
                          <ReviewItem label="Phone" value={formData.phone} />
                          <ReviewItem label="Email" value={formData.email || 'N/A'} />
                          <ReviewItem label="BMI" value={formData.bmi || 'N/A'} />
                        </div>

                        {formData.allergies && (
                          <div className="mt-4 bg-red-100 border-2 border-red-300 rounded-lg p-3">
                            <p className="text-sm font-semibold text-red-900 mb-1">⚠️ ALLERGIES</p>
                            <p className="text-sm text-red-800">{formData.allergies}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 p-4 bg-amber-50 border-2 border-amber-300 rounded-lg">
                        <AlertTriangle className="text-amber-600" size={20} />
                        <p className="text-sm text-amber-900">
                          By submitting, you confirm all information is accurate.
                        </p>
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-slate-200">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1" disabled={isSubmitting}>
                    <ArrowLeft size={16} className="mr-2" />
                    Previous
                  </Button>
                )}

                {currentStep < steps.length && (
                  <Button type="button" onClick={nextStep} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Next
                    <ArrowLeft size={16} className="ml-2 rotate-180" />
                  </Button>
                )}

                {currentStep === steps.length && (
                  <Button type="submit" disabled={isSubmitting} className="flex-1 bg-green-600 hover:bg-green-700">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 animate-spin" size={16} />
                        Registering...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2" size={16} />
                        Complete Registration
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <CheckCircle2 size={28} />
                Registration Successful!
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 text-center">
                {qrCodeUrl && (
                  <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32 mx-auto mb-4" />
                )}
                
                <h3 className="text-3xl font-bold text-slate-900 mb-2">{registeredPatient?.name}</h3>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Badge className="bg-blue-600 text-lg px-4 py-2 font-mono">{generatedHHID}</Badge>
                  <Button size="sm" variant="ghost" onClick={() => {
                    navigator.clipboard.writeText(generatedHHID);
                    alert('HHID copied!');
                  }}>
                    <Copy size={16} />
                  </Button>
                </div>
                
                <div className="flex justify-center gap-2">
                  <Badge className="bg-green-600">{formData.ward}</Badge>
                  <Badge className="bg-purple-600">Bed {formData.bed}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button onClick={() => { setTimeout(handlePrint, 100); }} className="bg-blue-600">
                  <Printer size={16} className="mr-2" />
                  Print Document
                </Button>
                
                <Button variant="outline" onClick={() => navigate('/patient-records')}>
                  <FileText size={16} className="mr-2" />
                  View Records
                </Button>
                
                <Button variant="outline" onClick={() => { setShowSuccessModal(false); window.location.reload(); }}>
                  <UserPlus size={16} className="mr-2" />
                  New Patient
                </Button>
                
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  <Home size={16} className="mr-2" />
                  Dashboard
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Print Document */}
      <div className="hidden">
        <div ref={printRef} className="p-8 bg-white">
          <div className="border-b-4 border-blue-600 pb-4 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-blue-600">OmniGate Hospital</h1>
                <p className="text-sm text-slate-600 mt-1">Advanced Healthcare System</p>
              </div>
              {qrCodeUrl && <img src={qrCodeUrl} alt="QR" className="w-24 h-24" />}
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">PATIENT REGISTRATION DOCUMENT</h2>
            <p className="text-sm text-slate-600">Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          </div>

          <div className="bg-slate-100 border-2 border-slate-300 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-600 mb-1">HHID</p>
                <p className="text-2xl font-bold font-mono text-blue-600">{generatedHHID}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">ADMISSION DATE</p>
                <p className="text-xl font-bold">{formData.admissionDate}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3 border-b-2 border-slate-300 pb-2">Personal Information</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <PrintField label="Name" value={formData.name} />
              <PrintField label="Age" value={`${formData.age} Years`} />
              <PrintField label="Gender" value={formData.gender} />
              <PrintField label="Blood Group" value={formData.bloodGroup} />
              <PrintField label="Phone" value={formData.phone} />
              <PrintField label="Email" value={formData.email} />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3 border-b-2 border-slate-300 pb-2">Medical Information</h3>
            <div className="grid grid-cols-4 gap-4 text-sm mb-4">
              <PrintField label="Weight" value={`${formData.weight} kg`} />
              <PrintField label="Height" value={`${formData.height} cm`} />
              <PrintField label="BMI" value={formData.bmi} />
              <PrintField label="BP" value={formData.bloodPressure} />
            </div>
            
            {formData.allergies && (
              <div className="bg-red-100 border-2 border-red-500 rounded p-3 mb-3">
                <p className="text-xs font-bold text-red-900 mb-1">⚠️ ALLERGIES</p>
                <p className="text-sm text-red-800">{formData.allergies}</p>
              </div>
            )}

            <PrintField label="Diagnosis" value={formData.diagnosis} />
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3 border-b-2 border-slate-300 pb-2">Hospital Details</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <PrintField label="Ward" value={formData.ward} />
              <PrintField label="Bed" value={formData.bed} />
              <PrintField label="Status" value={formData.status.toUpperCase()} />
            </div>
          </div>

          <div className="mt-12 pt-6 border-t-2 border-slate-300">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-bold mb-1">Patient Signature:</p>
                <div className="border-b-2 border-slate-400 mt-8"></div>
              </div>
              <div>
                <p className="text-sm font-bold mb-1">Authorized Signature:</p>
                <div className="border-b-2 border-slate-400 mt-8"></div>
              </div>
            </div>
            <p className="text-xs text-center text-slate-500 mt-6">
              Printed on {new Date().toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewItem({ label, value }) {
  return (
    <div className="bg-white rounded-lg p-3 border border-slate-200">
      <p className="text-xs text-slate-600 mb-1">{label}</p>
      <p className="text-sm font-semibold text-slate-900 truncate">{value}</p>
    </div>
  );
}

function PrintField({ label, value }) {
  if (!value) return null;
  return (
    <div className="mb-2">
      <p className="text-xs text-slate-600 font-semibold">{label}</p>
      <p className="text-sm text-slate-900">{value}</p>
    </div>
  );
}
