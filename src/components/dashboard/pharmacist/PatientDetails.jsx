import { useState } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Search, Edit, Eye, Pill } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import EditMedicationModal from './EditMedicationModal';

export default function PatientList({ patients, medications }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewPatient, setViewPatient] = useState(null);
  const [editMedication, setEditMedication] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filteredPatients = patients.filter(p => 
    p.hhid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPatientMeds = (hhid) => {
    return medications.filter(m => m.patientHHID === hhid && m.status === 'active');
  };

  const handleEditMedication = (med) => {
    setEditMedication(med);
    setIsEditModalOpen(true);
  };

  const handleMedicationSaved = () => {
    // Refresh handled by Firebase real-time listener
    setEditMedication(null);
  };

  return (
    <>
      <Card className="animate-in slide-in-from-bottom duration-500">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Patient Records</h2>
            <p className="text-sm text-slate-500 mt-1">{filteredPatients.length} patients found</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by HHID or name..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-semibold">HHID</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Age/Sex</TableHead>
                  <TableHead className="font-semibold">Weight</TableHead>
                  <TableHead className="font-semibold">Ward</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Medications</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => {
                  const meds = getPatientMeds(patient.hhid);
                  return (
                    <TableRow 
                      key={patient.hhid} 
                      className={`hover:bg-slate-50 transition-colors ${patient.status === 'critical' ? 'bg-red-50' : ''}`}
                    >
                      <TableCell className="font-medium font-mono">{patient.hhid}</TableCell>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{patient.age}/{patient.sex}</TableCell>
                      <TableCell>{patient.weight} kg</TableCell>
                      <TableCell>{patient.ward}</TableCell>
                      <TableCell>
                        <Badge variant={patient.status === 'critical' ? 'destructive' : 'default'}>
                          {patient.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          <Pill size={14} />
                          {meds.length} active
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setViewPatient(patient)}
                            className="hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Patient Details Dialog */}
      {viewPatient && (
        <Dialog open={!!viewPatient} onOpenChange={() => setViewPatient(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Patient Details - {viewPatient.name}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Patient Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-medium">HHID</p>
                  <p className="font-semibold font-mono">{viewPatient.hhid}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-medium">Age / Sex</p>
                  <p className="font-semibold">{viewPatient.age} years / {viewPatient.sex}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-medium">Weight / Height</p>
                  <p className="font-semibold">{viewPatient.weight} kg / {viewPatient.height} cm</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-medium">Ward / Bed</p>
                  <p className="font-semibold">{viewPatient.ward} - {viewPatient.bed}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Diagnosis</p>
                  <p className="font-semibold">{viewPatient.diagnosis}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500 font-medium">Provisional Diagnosis</p>
                  <p className="font-semibold">{viewPatient.provisionalDiagnosis}</p>
                </div>
              </div>

              {/* Medications with Edit */}
              <div>
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Pill size={20} />
                  Current Medications
                </h3>
                <div className="space-y-3">
                  {getPatientMeds(viewPatient.hhid).map(med => (
                    <div key={med.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg">{med.drugName}</h4>
                          <p className="text-sm text-slate-600 mt-1">
                            {med.dose} • {med.frequency} • {med.route}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">Rack: {med.rackId}</Badge>
                            <Badge variant={med.status === 'active' ? 'default' : 'secondary'}>
                              {med.status}
                            </Badge>
                          </div>
                          {med.instructions && (
                            <p className="text-xs text-slate-500 mt-2 italic">{med.instructions}</p>
                          )}
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditMedication(med)}
                          className="hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Medication Modal */}
      <EditMedicationModal
        medication={editMedication}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditMedication(null);
        }}
        onSaved={handleMedicationSaved}
      />
    </>
  );
}
