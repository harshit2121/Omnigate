import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import {
  Stethoscope, FileText, User, Pill, Plus, Trash2, Search, 
  ArrowLeft, Clock, Calendar, AlertCircle, X, History, CheckCircle2
} from 'lucide-react';
import { usePatients } from '../hooks/useFirebaseData';
import medicationDatabase from '../data/medicationDatabase'; // ✅ FIXED IMPORT

export default function DoctorPrescription() {
  const navigate = useNavigate();
  const { patients } = usePatients();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [medications, setMedications] = useState([]);
  const [previousMedications, setPreviousMedications] = useState([]);
  const [diagnosis, setDiagnosis] = useState('');
  const [currentMed, setCurrentMed] = useState({
    drugName: '', brandName: '', dose: '', frequency: '', route: 'Oral',
    timing: [], duration: '', instructions: ''
  });
  const [drugSuggestions, setDrugSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showPreviousMeds, setShowPreviousMeds] = useState(false);

  const filteredPatients = patients.filter(p =>
    p.hhid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ FIX 1: DYNAMIC TIMINGS FUNCTION
  const getTimingsForFrequency = (frequency) => {
    const timings = {
      'OD': ['09:00'],
      'BD': ['09:00', '21:00'],
      'TID': ['09:00', '14:00', '21:00'],
      'QID': ['09:00', '13:00', '17:00', '21:00'],
      'HS': ['22:00'],
      'SOS': []
    };
    return timings[frequency] || [];
  };

  // Update timings when frequency changes
  useEffect(() => {
    if (currentMed.frequency) {
      setCurrentMed(prev => ({ ...prev, timing: getTimingsForFrequency(currentMed.frequency) }));
    }
  }, [currentMed.frequency]);

  // Drug search
  useEffect(() => {
    if (currentMed.drugName.length >= 2) {
      setDrugSuggestions(medicationDatabase.searchDrugs(currentMed.drugName));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [currentMed.drugName]);

  // Load previous meds
  useEffect(() => {
    if (selectedPatient) {
      setPreviousMedications([
        { id: 1, drugName: 'Pantoprazole', brandName: 'Pantocid 40', dose: '40mg', frequency: 'OD', timing: ['09:00'], duration: '14 days' },
        { id: 2, drugName: 'Azithromycin', brandName: 'Azithral 500', dose: '500mg', frequency: 'OD', timing: ['09:00'], duration: '3 days' }
      ]);
    }
  }, [selectedPatient]);

  const handleDrugSelect = (drug) => {
    const suggestion = medicationDatabase.getAutoSuggestions(drug.name);
    if (suggestion) {
      setCurrentMed({
        drugName: drug.name, brandName: suggestion.brands[0] || '',
        dose: suggestion.doses[0] || '', frequency: suggestion.defaultFrequency || 'OD',
        route: 'Oral', timing: getTimingsForFrequency(suggestion.defaultFrequency || 'OD'),
        duration: suggestion.duration || '', instructions: ''
      });
    }
    setShowSuggestions(false);
  };

  const handleAddMedication = () => {
    if (!currentMed.drugName || !currentMed.dose || !currentMed.frequency) return alert('Complete drug details');
    
    setMedications([...medications, { ...currentMed, id: Date.now() }]);
    setCurrentMed({ drugName: '', brandName: '', dose: '', frequency: '', route: 'Oral', timing: [], duration: '', instructions: '' });
  };

  const handleRemoveMedication = (id) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  if (!selectedPatient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Button onClick={() => navigate('/dashboard')} className="mb-8">
            <ArrowLeft className="mr-2" size={16} /> Back
          </Button>
          <Card className="border-2 border-blue-200 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <User size={48} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Select Patient</h2>
              <div className="relative max-w-md mx-auto mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <Input
                  placeholder="Search HHID or Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPatients.slice(0, 9).map(patient => (
                  <Card key={patient.hhid} className="cursor-pointer hover:shadow-lg transition-all p-6 border-2 hover:border-blue-400"
                    onClick={() => setSelectedPatient(patient)}>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                      {patient.name[0]}
                    </div>
                    <h3 className="font-bold text-lg text-center mb-2">{patient.name}</h3>
                    <p className="text-sm text-slate-600 text-center mb-2">{patient.hhid}</p>
                    <div className="flex justify-center gap-2 text-xs">
                      <span>{patient.age}Y</span>
                      <span>•</span>
                      <span>{patient.gender}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="outline" onClick={() => setSelectedPatient(null)} className="border-slate-300">
          <ArrowLeft size={16} className="mr-2" /> Change Patient
        </Button>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-3 mx-auto">
            <Stethoscope size={28} className="text-blue-600" />
            E-Prescription - {selectedPatient.name}
          </h1>
          <p className="text-sm text-slate-600 mt-1">{selectedPatient.hhid} • {selectedPatient.age}Y</p>
        </div>
        <div className="w-32" />
      </div>

      {/* Previous Medications */}
      {previousMedications.length > 0 && (
        <Card className="border-2 border-purple-200">
          <div className="p-4 border-b border-purple-200 bg-purple-50 rounded-t-lg">
            <Button
              variant="ghost"
              onClick={() => setShowPreviousMeds(!showPreviousMeds)}
              className="text-purple-700 hover:bg-purple-100"
            >
              <History size={18} className="mr-2" />
              {showPreviousMeds ? 'Hide' : 'View'} Previous ({previousMedications.length})
            </Button>
          </div>
          {showPreviousMeds && (
            <CardContent className="p-0">
              {previousMedications.map(med => (
                <div key={med.id} className="p-4 border-b last:border-b-0 hover:bg-purple-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Pill size={16} className="text-purple-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{med.drugName}</div>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{med.dose}</Badge>
                          <Badge variant="outline" className="text-xs">{med.frequency}</Badge>
                          <Badge variant="outline" className="text-xs">{med.duration}</Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentMed({
                        drugName: med.drugName, brandName: med.brandName,
                        dose: med.dose, frequency: med.frequency,
                        timing: med.timing, duration: med.duration
                      })}
                    >
                      <Plus size={14} className="mr-1" /> Add
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      )}

      {/* Current Prescription Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Medication Form */}
        <Card className="border-2 border-blue-200 lg:col-span-1">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-xl flex items-center gap-2">
              <Plus size={24} className="text-blue-600" />
              Add Medication
            </h3>

            {/* Drug Name */}
            <div className="relative">
              <label className="text-sm font-semibold mb-2 block">Drug Name *</label>
              <Input
                value={currentMed.drugName}
                onChange={(e) => setCurrentMed({ ...currentMed, drugName: e.target.value })}
                placeholder="Type 2+ letters e.g., Pantop"
                className="h-12"
              />
              {showSuggestions && drugSuggestions.map((drug, i) => (
                <div key={i} className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-auto"
                  onClick={() => handleDrugSelect(drug)}>
                  <div className="p-3 border-b hover:bg-blue-50 cursor-pointer">
                    <div className="font-semibold text-sm">{drug.name}</div>
                    <div className="text-xs text-gray-600">{drug.genericName}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold mb-1 block">Dose *</label>
                <Input value={currentMed.dose} onChange={(e) => setCurrentMed({ ...currentMed, dose: e.target.value })} className="h-10" />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block">Frequency *</label>
                <select
                  value={currentMed.frequency}
                  onChange={(e) => setCurrentMed({ ...currentMed, frequency: e.target.value })}
                  className="h-10 border rounded-md px-3 w-full"
                >
                  <option value="">Select</option>
                  <option value="OD">OD</option>
                  <option value="BD">BD</option>
                  <option value="TID">TID</option>
                  <option value="QID">QID</option>
                </select>
              </div>
            </div>

            {/* ✅ TIMING DISPLAY - FIXED */}
            {currentMed.timing.length > 0 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium text-green-800 mb-2">
                  <Clock size={16} />
                  Timing: {currentMed.frequency}
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentMed.timing.map((time, i) => (
                    <Badge key={i} className="bg-green-100 text-green-800">{time}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Duration" value={currentMed.duration} 
                onChange={(e) => setCurrentMed({ ...currentMed, duration: e.target.value })} className="h-10" />
              <Input placeholder="Route" value={currentMed.route} 
                onChange={(e) => setCurrentMed({ ...currentMed, route: e.target.value })} className="h-10" />
            </div>

            <Button onClick={handleAddMedication} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg">
              <Plus size={20} className="mr-2" /> Add to Prescription ({medications.length + 1})
            </Button>
          </CardContent>
        </Card>

        {/* Current Medications List */}
        <Card className="border-2 border-green-200 lg:col-span-1">
          <CardContent className="p-6">
            <h3 className="font-bold text-xl flex items-center gap-2 mb-6">
              <Pill size={24} className="text-green-600" />
              Current Prescription ({medications.length})
            </h3>
            
            {medications.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Pill size={64} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">No medications added</p>
                <p className="text-sm mt-2">Add medications using the form above</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {medications.map((med) => (
                  <div key={med.id} className="p-4 border rounded-lg bg-white shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="font-bold text-lg mb-1">{med.drugName}</div>
                        {med.brandName && <div className="text-blue-600 text-sm mb-2">{med.brandName}</div>}
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge>{med.dose}</Badge>
                          <Badge variant="outline">{med.frequency}</Badge>
                          <Badge variant="outline">{med.duration}</Badge>
                          <Badge variant="outline">{med.route}</Badge>
                        </div>
                        {med.timing.length > 0 && (
                          <div className="flex items-center gap-1 text-sm text-slate-600 mb-2">
                            <Clock size={14} />
                            {med.timing.join(', ')}
                          </div>
                        )}
                        {med.instructions && (
                          <div className="text-xs text-slate-600 italic p-2 bg-slate-50 rounded">
                            "{med.instructions}"
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMedication(med.id)}
                        className="text-red-500 hover:bg-red-50 h-8 w-8 p-0"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Diagnosis & Submit */}
      {medications.length > 0 && (
        <Card className="border-2 border-indigo-200">
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">Diagnosis *</label>
              <Textarea
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Enter diagnosis..."
                rows={3}
                className="border-2 focus:border-indigo-500"
              />
            </div>
            <Button className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-xl">
              ✅ Generate Prescription ({medications.length} meds)
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
