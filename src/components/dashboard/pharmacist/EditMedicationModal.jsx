import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

export default function EditMedicationModal({ medication, isOpen, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    drugName: '',
    dose: '',
    frequency: '',
    route: '',
    instructions: '',
    status: 'active'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (medication) {
      setFormData({
        drugName: medication.drugName || '',
        dose: medication.dose || '',
        frequency: medication.frequency || '',
        route: medication.route || '',
        instructions: medication.instructions || '',
        status: medication.status || 'active'
      });
    }
  }, [medication]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    if (!medication?.id) return;

    setSaving(true);
    try {
      const medRef = doc(db, 'medications', medication.id);
      await updateDoc(medRef, {
        ...formData,
        updatedAt: new Date().toISOString()
      });
      
      alert('✅ Medication updated successfully!');
      onSaved();
      onClose();
    } catch (error) {
      console.error('Error updating medication:', error);
      alert('❌ Failed to update medication');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Medication</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Drug Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Drug Name</label>
            <Input
              name="drugName"
              value={formData.drugName}
              onChange={handleChange}
              placeholder="e.g., Metformin"
              className="text-base"
            />
          </div>

          {/* Dose & Frequency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Dose</label>
              <Input
                name="dose"
                value={formData.dose}
                onChange={handleChange}
                placeholder="e.g., 500mg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Frequency</label>
              <Input
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                placeholder="e.g., Twice daily"
              />
            </div>
          </div>

          {/* Route */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Route</label>
            <select
              name="route"
              value={formData.route}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="Oral">Oral</option>
              <option value="IV">IV (Intravenous)</option>
              <option value="IM">IM (Intramuscular)</option>
              <option value="SC">SC (Subcutaneous)</option>
              <option value="Topical">Topical</option>
              <option value="Inhalation">Inhalation</option>
            </select>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Instructions</label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="e.g., Take with food"
              rows={3}
              className="w-full px-3 py-2 border rounded-md resize-none"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="active">Active</option>
              <option value="discontinued">Discontinued</option>
              <option value="completed">Completed</option>
            </select>
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
            disabled={saving}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
