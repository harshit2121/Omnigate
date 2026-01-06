import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus } from 'lucide-react';

export default function AddMedicationModal({ patient, isOpen, onClose, onAdded }) {
  const [formData, setFormData] = useState({
    drugName: '',
    dose: '',
    frequency: '',
    route: 'Oral',
    timing: '',
    rackId: '',
    instructions: '',
    status: 'active'
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    if (!patient?.hhid) {
      alert('Error: Patient information missing');
      return;
    }

    if (!formData.drugName || !formData.dose || !formData.frequency) {
      alert('Please fill all required fields');
      return;
    }

    setSaving(true);
    try {
      const timingArray = formData.timing.split(',').map(t => t.trim());
      
      await addDoc(collection(db, 'medications'), {
        patientHHID: patient.hhid,
        drugName: formData.drugName,
        dose: formData.dose,
        frequency: formData.frequency,
        route: formData.route,
        timing: timingArray,
        rackId: formData.rackId || 'A00',
        instructions: formData.instructions,
        status: 'active',
        startDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      });
      
      console.log('✅ Medication added successfully!');
      alert('✅ Medication added successfully!');
      
      // Reset form
      setFormData({
        drugName: '',
        dose: '',
        frequency: '',
        route: 'Oral',
        timing: '',
        rackId: '',
        instructions: '',
        status: 'active'
      });
      
      onAdded();
      onClose();
    } catch (error) {
      console.error('❌ Error adding medication:', error);
      alert(`❌ Failed to add: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Plus size={24} className="text-green-600" />
            Add New Medication
          </DialogTitle>
          {patient && (
            <p className="text-sm text-slate-500">
              For: <span className="font-semibold">{patient.name}</span> ({patient.hhid})
            </p>
          )}
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Drug Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Drug Name <span className="text-red-500">*</span>
            </label>
            <Input
              name="drugName"
              value={formData.drugName}
              onChange={handleChange}
              placeholder="e.g., Metformin"
              className="text-base"
              required
            />
          </div>

          {/* Dose & Frequency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Dose <span className="text-red-500">*</span>
              </label>
              <Input
                name="dose"
                value={formData.dose}
                onChange={handleChange}
                placeholder="e.g., 500mg"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Frequency <span className="text-red-500">*</span>
              </label>
              <Input
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                placeholder="e.g., Twice daily"
                required
              />
            </div>
          </div>

          {/* Route & Rack ID */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Route <span className="text-red-500">*</span>
              </label>
              <select
                name="route"
                value={formData.route}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Oral">Oral</option>
                <option value="IV">IV (Intravenous)</option>
                <option value="IM">IM (Intramuscular)</option>
                <option value="SC">SC (Subcutaneous)</option>
                <option value="Topical">Topical</option>
                <option value="Inhalation">Inhalation</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Rack ID
              </label>
              <Input
                name="rackId"
                value={formData.rackId}
                onChange={handleChange}
                placeholder="e.g., A12"
              />
              <p className="text-xs text-slate-500">Cabinet rack location</p>
            </div>
          </div>

          {/* Timing */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Timing Schedule
            </label>
            <Input
              name="timing"
              value={formData.timing}
              onChange={handleChange}
              placeholder="e.g., 08:00, 20:00"
            />
            <p className="text-xs text-slate-500">Enter times separated by commas (24-hour format)</p>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Instructions
            </label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="e.g., Take with food, avoid alcohol"
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !formData.drugName || !formData.dose || !formData.frequency}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Adding...
              </span>
            ) : (
              <>
                <Plus size={16} className="mr-1" />
                Add Medication
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
