import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Activity, CheckCircle2 } from 'lucide-react';

export default function ActivityFeed({ logs }) {
  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity size={20} />
          Live Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {logs.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">
              No activities yet today
            </p>
          ) : (
            logs.map((log) => (
              <div 
                key={log.id} 
                className="border-l-4 border-l-green-500 bg-green-50 rounded-r-lg p-3 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle2 size={12} className="mr-1" />
                    Administered
                  </Badge>
                  <span className="text-xs text-slate-500">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                <p className="font-medium text-sm">{log.patientHHID}</p>
                <p className="text-xs text-slate-600 mt-1">
                  By: {log.nurseName}
                </p>
                <p className="text-xs text-slate-500">
                  Rack: {log.rackId}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 pt-4 border-t">
          <p className="text-xs font-medium text-slate-600 mb-2">Today's Summary</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 rounded p-2">
              <p className="text-2xl font-bold text-green-600">{logs.length}</p>
              <p className="text-xs text-slate-600">Administered</p>
            </div>
            <div className="bg-slate-50 rounded p-2">
              <p className="text-2xl font-bold text-blue-600">
                {new Set(logs.map(l => l.patientHHID)).size}
              </p>
              <p className="text-xs text-slate-600">Patients</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
