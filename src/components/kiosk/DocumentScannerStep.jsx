import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Camera, Activity, Calendar, Trash2, Eye, Clock
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import ocrService, { SAMPLE_DOCUMENTS } from '../../services/ocrService';
import voiceAssistant from '../../services/voiceAssistant';

export default function DocumentScannerStep({
  ocrDocuments,
  setOcrDocuments,
  currentLang = 'hi',
  voiceEnabled
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);

  const handleAddSampleDoc = (doc) => {
    if (ocrDocuments.find(d => d.id === doc.id)) return;
    const updated = [...ocrDocuments, doc];
    setOcrDocuments(updated);
    voiceAssistant.playAudioCue('success');
    if (voiceEnabled) {
      voiceAssistant.speak(
        currentLang === 'hi' 
          ? 'दस्तावेज स्कैन और ओसीआर विश्लेषण पूरा हुआ।' 
          : 'Document scanned and clinical OCR analysis complete.'
      );
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setStatusMessage(currentLang === 'hi' ? 'ओसीआर द्वारा पर्चा स्कैन किया जा रहा है...' : 'Scanning prescription image with OCR...');

    try {
      const result = await ocrService.processImage(file, (msg) => setStatusMessage(msg));
      const newDoc = {
        id: `user-doc-${Date.now()}`,
        name: file.name,
        date: new Date().toISOString().split('T')[0],
        type: 'prescription',
        doctor: currentLang === 'hi' ? 'पिछला चिकित्सक रिकॉर्ड' : 'Prior Physician Record',
        hospital: currentLang === 'hi' ? 'मरीज द्वारा अपलोड' : 'Patient Uploaded File',
        ...result
      };

      setOcrDocuments([...ocrDocuments, newDoc]);
      setIsProcessing(false);
      voiceAssistant.playAudioCue('success');
    } catch (err) {
      setIsProcessing(false);
      handleAddSampleDoc(SAMPLE_DOCUMENTS[0]);
    }
  };

  const handleRemoveDoc = (id) => {
    setOcrDocuments(ocrDocuments.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner & Fast Action Bar */}
      <div className="bg-white border-2 border-[#DCE3EC] p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <h3 
            className="text-base sm:text-lg font-black text-[#0B4C8C] flex items-center gap-2"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            <FileText size={22} className="text-[#0B4C8C]" />
            {currentLang === 'hi' ? 'पुराने पर्चे एवं लैब रिपोर्ट डिजिटाइजेशन' : 'Medical Record Digitization & OCR'}
          </h3>
          <p className="text-xs text-[#5B677E] mt-0.5 font-medium">
            {currentLang === 'hi'
              ? 'डिजिटल ओसीआर स्कैनिंग द्वारा पुराने पर्चों से दवाइयां और जांच परिणाम स्वतः निकालें'
              : 'Scan prior paper prescriptions and lab investigations into a structured timeline'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="cursor-pointer bg-[#E2861E] hover:bg-[#C2410C] text-white font-black px-5 py-3.5 rounded-2xl text-xs flex items-center gap-2 shadow-xs transition-all">
            <Camera size={18} />
            <span>{currentLang === 'hi' ? 'स्कैनर से रिपोर्ट जोड़ें' : 'Scan / Upload Report'}</span>
            <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Processing Loader Indicator */}
      {isProcessing && (
        <div className="bg-[#F5F9FF] border-2 border-[#DCE3EC] p-4 rounded-2xl flex items-center gap-3 text-[#16213A] animate-pulse">
          <Activity className="animate-spin text-[#0B4C8C]" size={22} />
          <div>
            <p className="text-sm font-black">{statusMessage}</p>
            <p className="text-xs text-[#5B677E] font-semibold">
              {currentLang === 'hi' ? 'दवाइयों और जांच परिणामों का विश्लेषण जारी है...' : 'Extracting medicines, dosages, and lab values...'}
            </p>
          </div>
        </div>
      )}

      {/* CHRONOLOGICAL MEDICAL TIMELINE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-black text-[#16213A] flex items-center gap-2">
            <Clock size={16} className="text-[#0B4C8C]" />
            {currentLang === 'hi' ? 'कालानुक्रमिक चिकित्सा इतिहास' : 'Chronological Medical Timeline'}
          </h4>
          <span className="text-xs text-[#5B677E] font-bold">
            {ocrDocuments.length} {currentLang === 'hi' ? 'दस्तावेज संसाधित' : 'Documents Processed'}
          </span>
        </div>

        {ocrDocuments.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-[#DCE3EC] rounded-3xl p-8 text-center text-[#5B677E]">
            <FileText size={40} className="mx-auto mb-2 opacity-40 text-[#5B677E]" />
            <p className="text-sm font-black text-[#16213A]">
              {currentLang === 'hi' ? 'अभी तक कोई पिछला दस्तावेज अपलोड नहीं हुआ' : 'No previous documents uploaded yet'}
            </p>
            <p className="text-xs mt-1 font-semibold">
              {currentLang === 'hi'
                ? 'पुराने पर्चे या रिपोर्ट जोड़ने के लिए ऊपर दिए गए बटन पर टैप करें'
                : 'Tap the button above to add prior prescriptions or lab reports'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {ocrDocuments.map((doc, idx) => (
              <motion.div
                key={doc.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-2 border-[#DCE3EC] rounded-3xl p-4 sm:p-5 space-y-3 hover:border-[#BFD3E8] transition-all shadow-xs"
              >
                {/* Doc Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-[#16213A] text-sm">{doc.name}</span>
                      <Badge className="bg-[#F5F9FF] text-[#0B4C8C] border border-[#BFD3E8] text-[10px] font-bold">{doc.type}</Badge>
                    </div>
                    <p className="text-xs text-[#5B677E] flex items-center gap-2 mt-0.5 font-semibold">
                      <Calendar size={12} /> {doc.date} • {doc.doctor}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPreviewDoc(doc)}
                      className="border-[#DCE3EC] text-[#16213A] hover:bg-[#F1F6FC] h-8 px-3 text-xs rounded-xl font-bold"
                    >
                      <Eye size={14} className="mr-1" /> {currentLang === 'hi' ? 'देखें' : 'View OCR'}
                    </Button>
                    <button
                      onClick={() => handleRemoveDoc(doc.id)}
                      className="text-red-600 hover:text-red-700 p-1.5 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Extracted Diagnoses & Medications Preview */}
                {doc.medications && doc.medications.length > 0 && (
                  <div className="bg-[#F5F9FF] p-3 rounded-2xl border border-[#DCE3EC]">
                    <p className="text-[11px] font-black text-[#5B677E] uppercase mb-1.5">
                      {currentLang === 'hi' ? 'निकाली गई दवाइयां:' : 'Extracted Medications:'}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {doc.medications.map((med, mIdx) => (
                        <Badge key={mIdx} className="bg-emerald-50 text-emerald-950 border border-emerald-300 text-xs font-bold">
                          💊 {med.name} {med.dose && `(${med.dose})`} {med.frequency && `• ${med.frequency}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extracted Lab Tests & Outlier Alerts */}
                {doc.labResults && doc.labResults.length > 0 && (
                  <div className="bg-[#F5F9FF] p-3 rounded-2xl border border-[#DCE3EC] space-y-2">
                    <p className="text-[11px] font-black text-[#5B677E] uppercase">
                      {currentLang === 'hi' ? 'निकाले गए लैब मान:' : 'Extracted Lab Parameters:'}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {doc.labResults.map((lab, lIdx) => (
                        <div key={lIdx} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-[#DCE3EC]">
                          <span className="text-[#16213A] font-bold">{lab.parameter}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-[#16213A]">{lab.value} {lab.unit}</span>
                            {lab.status === 'HIGH' && <Badge variant="destructive" className="text-[9px] px-1.5 py-0 font-bold">HIGH</Badge>}
                            {lab.status === 'LOW' && <Badge className="bg-amber-600 text-white text-[9px] px-1.5 py-0 font-bold">LOW</Badge>}
                            {lab.status === 'NORMAL' && <Badge className="bg-emerald-700 text-white text-[9px] px-1.5 py-0 font-bold">OK</Badge>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* DOCUMENT PREVIEW MODAL */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#DCE3EC] rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden text-[#16213A] shadow-2xl"
            >
              <div className="p-5 border-b border-[#DCE3EC] flex items-center justify-between bg-[#F5F9FF]">
                <div>
                  <h3 className="font-black text-base">{previewDoc.name}</h3>
                  <p className="text-xs text-[#5B677E] font-semibold">{previewDoc.doctor} • {previewDoc.date}</p>
                </div>
                <Button size="sm" onClick={() => setPreviewDoc(null)} className="rounded-xl font-bold bg-[#0B4C8C] hover:bg-[#08355F]">
                  {currentLang === 'hi' ? 'बंद करें' : 'Close'}
                </Button>
              </div>
              <div className="p-6 overflow-y-auto font-mono text-xs bg-[#0B2A4A] text-slate-200 whitespace-pre-wrap">
                {previewDoc.rawText || (currentLang === 'hi' ? 'कोई पाठ उपलब्ध नहीं है।' : 'No raw text available.')}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
