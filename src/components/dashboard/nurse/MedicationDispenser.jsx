import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Pill, 
  UnlockKeyhole, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Lock
} from 'lucide-react';
import RackSelector from './RackSelector';

export default function MedicationDispenser({ patient, medications, nurse }) {
  const [selectedMed, setSelectedMed] = useState(null);
  const [rackOpened, setRackOpened] = useState(false);
  const [administeredMeds, setAdministeredMeds] = useState([]);

  const getUrgencyConfig = (urgency) => {
    switch(urgency) {
      case 'overdue':
        return {
          color: 'border-red-500 bg-red-50',
          badgeVariant: 'destructive',
          icon: AlertTriangle,
          iconColor: 'text-red-500',
          label: 'OVERDUE'
        };
      case 'due_soon':
        return {
          color: 'border-yellow-500 bg-yellow-50',
          badgeVariant: 'default',
          icon: Clock,
          iconColor: 'text-yellow-600',
          label: 'DUE SOON'
        };
      case 'prn':
        return {
          color: 'border-purple-500 bg-purple-50',
          badgeVariant: 'secondary',
          icon: Pill,
          iconColor: 'text-purple-600',
          label: 'PRN'
        };
      default:
        return {
          color: 'border-green-500 bg-white',
          badgeVariant: 'outline',
          icon: CheckCircle2,
          iconColor: 'text-green-500',
          label: 'ON TIME'
        };
    }
  };

  const handleDispense = (med) => {
    setSelectedMed(med);
    setRackOpened(false);
  };

  const handleRackOpen = () => {
    setRackOpened(true);
    // Simulate IoT trigger
    console.log('🔓 IoT Cabinet Triggered - Rack:', selectedMed.rackId);
  };

  const handleAdminister = () => {
    setAdministeredMeds([...administeredMeds, selectedMed.id]);
    // Log administration
    console.log('✅ Medication Administered:', {
      patient: patient.hhid,
      medication: selectedMed.drugName,
      nurse: nurse.id,
      time: new Date().toISOString(),
      rack: selectedMed.rackId
    });
    
    // Reset
    setSelectedMed(null);
    setRackOpened(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill size={20} />
            Current Medications for {patient.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          
          {medications.length === 0 ? (
            <Alert>
              <AlertDescription>
                No active medications found for this patient.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {medications.map((med) => {
                const config = getUrgencyConfig(med.urgency);
                const isAdministered = administeredMeds.includes(med.id);
                const UrgencyIcon = config.icon;

                return (
                  <Card 
                    key={med.id} 
                    className={`border-l-4 ${config.color} ${isAdministered ? 'opacity-50' : ''} transition-all hover:shadow-md`}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{med.drugName}</h3>
                            {isAdministered && (
                              <Badge variant="default" className="bg-green-500">
                                <CheckCircle2 size={12} className="mr-1" />
                                Administered
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600">{med.dose} • {med.route}</p>
                          <p className="text-sm font-medium text-slate-700 mt-1">{med.frequency}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={config.badgeVariant} className="gap-1">
                            <UrgencyIcon size={12} />
                            {config.label}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Rack {med.rackId}
                          </Badge>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded p-2 mb-3">
                        <div className="flex items-center gap-2 text-xs text-slate-600 mb-1">
                          <Clock size={12} />
                          <span>Schedule: {med.timing.join(', ')}</span>
                        </div>
                        {med.nextDue !== 'PRN' && (
                          <p className="text-xs text-slate-600">
                            Next due: {new Date(med.nextDue).toLocaleString('en-IN')}
                          </p>
                        )}
                        {med.instructions && (
                          <p className="text-xs text-slate-500 mt-1 italic">
                            ℹ️ {med.instructions}
                          </p>
                        )}
                      </div>

                      <Button
                        className="w-full"
                        variant={isAdministered ? "outline" : "default"}
                        disabled={isAdministered}
                        onClick={() => handleDispense(med)}
                      >
                        {isAdministered ? (
                          <>
                            <CheckCircle2 size={16} className="mr-2" />
                            Already Administered
                          </>
                        ) : (
                          <>
                            <UnlockKeyhole size={16} className="mr-2" />
                            Dispense from Rack {med.rackId}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rack Selector Dialog */}
      {selectedMed && (
        <RackSelector
          medication={selectedMed}
          patient={patient}
          nurse={nurse}
          isOpen={!!selectedMed}
          rackOpened={rackOpened}
          onClose={() => {
            setSelectedMed(null);
            setRackOpened(false);
          }}
          onOpenRack={handleRackOpen}
          onAdminister={handleAdminister}
        />
      )}
    </div>
  );
}
